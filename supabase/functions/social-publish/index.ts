import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Admin-only gate. verify_jwt=false means getUser() alone authenticates ANY valid
// user; this scopes the function to the single admin (env override, falls back to
// the canonical admin UUID used across the RLS policies).
const ADMIN_USER_ID = Deno.env.get("ADMIN_USER_ID") || "169e6037-fcc2-4201-b2af-92547e1d6739";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// SEC-2: block SSRF via the admin-supplied image_url (https only, reject internal hosts).
function isSafeImageUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "https:") return false;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h === "0.0.0.0" || h === "::1" || !h.includes(".")) return false;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
  return true;
}

// ── Platform publishers ──

async function publishLinkedIn(post: any, token: any): Promise<string> {
  const orgId = token.org_id;
  const author = orgId ? `urn:li:organization:${orgId}` : "urn:li:person:me";

  const body: any = {
    author,
    commentary: post.body + (post.hashtags ? "\n\n" + post.hashtags : ""),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
  };

  // If post has an image, upload it first
  if (post.image_url) {
    // Initialize image upload
    const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "LinkedIn-Version": "202504",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        initializeUploadRequest: { owner: author },
      }),
    });

    if (initRes.ok) {
      const initData = await initRes.json();
      const uploadUrl = initData.value?.uploadUrl;
      const imageUrn = initData.value?.image;

      if (uploadUrl && imageUrn) {
        // Download image and upload to LinkedIn
        if (!isSafeImageUrl(post.image_url)) throw new Error("Unsafe image URL");
        const imgRes = await fetch(post.image_url);
        const imgBlob = await imgRes.blob();
        await fetch(uploadUrl, { method: "PUT", body: imgBlob });

        body.content = { media: { id: imageUrn } };
      }
    }
  }

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "LinkedIn-Version": "202504",
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn publish failed: ${res.status} ${err}`);
  }

  const postId = res.headers.get("x-restli-id") || "";
  return `https://www.linkedin.com/feed/update/${postId}`;
}

async function publishFacebook(post: any, token: any): Promise<string> {
  const pageToken = token.page_token;
  const pageId = token.page_id;
  if (!pageToken || !pageId) throw new Error("No Facebook Page token");

  let endpoint: string;
  const params: any = { access_token: pageToken };

  if (post.image_url) {
    // Photo post
    endpoint = `https://graph.facebook.com/v21.0/${pageId}/photos`;
    params.message = post.body + (post.hashtags ? "\n\n" + post.hashtags : "");
    params.url = post.image_url;
  } else {
    // Text/link post
    endpoint = `https://graph.facebook.com/v21.0/${pageId}/feed`;
    params.message = post.body + (post.hashtags ? "\n\n" + post.hashtags : "");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook publish failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const fbPostId = data.id || data.post_id || "";
  return `https://www.facebook.com/${fbPostId}`;
}

async function publishInstagram(post: any, token: any): Promise<string> {
  const pageToken = token.page_token;
  const igId = token.ig_account_id;
  if (!pageToken || !igId) throw new Error("No Instagram account connected");
  if (!post.image_url) throw new Error("Instagram requires an image");

  // Step 1: Create media container
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: post.image_url,
      caption: post.body + (post.hashtags ? "\n\n" + post.hashtags : ""),
      access_token: pageToken,
    }),
  });

  if (!containerRes.ok) {
    const err = await containerRes.text();
    throw new Error(`Instagram container failed: ${containerRes.status} ${err}`);
  }

  const { id: creationId } = await containerRes.json();

  // Wait for container to be ready (Instagram processes async)
  await new Promise((r) => setTimeout(r, 5000));

  // Step 2: Publish
  const pubRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: pageToken,
    }),
  });

  if (!pubRes.ok) {
    const err = await pubRes.text();
    throw new Error(`Instagram publish failed: ${pubRes.status} ${err}`);
  }

  const { id: mediaId } = await pubRes.json();
  return `https://www.instagram.com/p/${mediaId}/`;
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  // Any valid user passes getUser(); only the admin may read OAuth tokens and publish.
  if (user.id !== ADMIN_USER_ID) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const { post_id, platform } = await req.json();
    if (!post_id || !platform) {
      return Response.json({ error: "post_id and platform required" }, { status: 400, headers: corsHeaders });
    }

    // Get the post
    const { data: post, error: postErr } = await supabase
      .from("content_posts")
      .select("*")
      .eq("id", post_id)
      .single();

    if (postErr || !post) {
      return Response.json({ error: "Post not found" }, { status: 404, headers: corsHeaders });
    }

    // Get the token for the platform
    const tokenPlatform = platform === "facebook" || platform === "instagram" ? "meta" : platform === "youtube" ? "google" : platform;
    const { data: token, error: tokenErr } = await supabase
      .from("social_tokens")
      .select("*")
      .eq("platform", tokenPlatform)
      .single();

    if (tokenErr || !token) {
      return Response.json({ error: `No ${platform} token found. Connect the account first.` }, { status: 400, headers: corsHeaders });
    }

    // CORR-1: LinkedIn tokens expire (~60d) with no refresh — fail fast with a clear
    // message instead of a blind 401 that the outer catch turns into a generic 500.
    if (platform === "linkedin" && token.token_expiry && new Date(token.token_expiry) < new Date()) {
      return Response.json({ error: "LinkedIn token expired. Reconnect the account." }, { status: 400, headers: corsHeaders });
    }

    // Publish based on platform
    let publishedUrl = "";

    switch (platform) {
      case "linkedin":
        publishedUrl = await publishLinkedIn(post, token);
        break;
      case "facebook":
        publishedUrl = await publishFacebook(post, token);
        break;
      case "instagram":
        publishedUrl = await publishInstagram(post, token);
        break;
      case "youtube":
        // YouTube requires video upload — handled separately
        return Response.json({ error: "YouTube publishing requires video upload. Use the video upload flow." }, { status: 400, headers: corsHeaders });
      default:
        return Response.json({ error: `Unknown platform: ${platform}` }, { status: 400, headers: corsHeaders });
    }

    // Update post status. The post is already live on the platform at this point,
    // so a failed DB update must NOT be swallowed — otherwise a retry double-posts.
    const { error: updateErr } = await supabase.from("content_posts").update({
      status: "published",
      published_at: new Date().toISOString(),
      published_url: publishedUrl,
    }).eq("id", post_id);

    if (updateErr) {
      console.error("[social-publish] status update failed after publish", updateErr);
      return Response.json(
        {
          error: "Post was published to the platform, but the database status update failed. Do NOT retry — mark it published manually.",
          published_url: publishedUrl,
        },
        { status: 500, headers: corsHeaders },
      );
    }

    return Response.json({ ok: true, published_url: publishedUrl }, { headers: corsHeaders });
  } catch (err) {
    console.error("[social-publish] Error:", err);
    return Response.json({ error: "Publishing failed. Please try again." }, { status: 500, headers: corsHeaders });
  }
});
