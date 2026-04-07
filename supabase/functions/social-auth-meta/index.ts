import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const META_APP_ID = Deno.env.get("META_APP_ID")!;
const META_APP_SECRET = Deno.env.get("META_APP_SECRET")!;
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/social-auth-meta`;
const ADMIN_URL = Deno.env.get("ADMIN_URL") || "https://ethoz.cl/admin/content";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Step 1: Redirect to Meta OAuth
  if (!code) {
    const authUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
    authUrl.searchParams.set("client_id", META_APP_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("scope", "pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish");
    authUrl.searchParams.set("state", crypto.randomUUID());
    return Response.redirect(authUrl.toString(), 302);
  }

  // Step 2: Exchange code for short-lived token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${META_APP_SECRET}&code=${code}`
  );
  if (!tokenRes.ok) {
    return new Response(`Meta token error: ${await tokenRes.text()}`, { status: 400 });
  }
  const { access_token: shortToken } = await tokenRes.json();

  // Step 3: Exchange for long-lived user token
  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`
  );
  const { access_token: longToken, expires_in } = await longRes.json();

  // Step 4: Get Page Access Token (never expires)
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${longToken}`
  );
  const pagesData = await pagesRes.json();
  let page = pagesData.data?.[0];

  // Fallback: if no pages returned, try getting token for known Page ID directly
  if (!page) {
    const knownPageId = "1083964671464526";
    const directRes = await fetch(
      `https://graph.facebook.com/v21.0/${knownPageId}?fields=access_token,name&access_token=${longToken}`
    );
    const directData = await directRes.json();
    if (directData.access_token) {
      page = { id: knownPageId, access_token: directData.access_token, name: directData.name || "Ethoz" };
    }
  }

  if (!page) {
    return new Response(`No Facebook Pages found. Pages response: ${JSON.stringify(pagesData)}`, { status: 400 });
  }

  const pageToken = page.access_token;
  const pageId = page.id;

  // Step 5: Get Instagram Business Account ID
  const igRes = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
  );
  const igData = await igRes.json();
  const igAccountId = igData.instagram_business_account?.id || "";

  // Step 6: Save to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const expiry = expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null;

  await supabase.from("social_tokens").upsert({
    platform: "meta",
    access_token: longToken,
    token_expiry: expiry,
    page_token: pageToken,
    page_id: pageId,
    ig_account_id: igAccountId,
    metadata: { page_name: page.name },
  }, { onConflict: "platform" });

  // Redirect back to admin
  return Response.redirect(`${ADMIN_URL}?connected=meta`, 302);
});
