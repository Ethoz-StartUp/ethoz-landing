import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/social-auth-google`;
const ADMIN_URL = Deno.env.get("ADMIN_URL") || "https://ethoz.cl/admin/content";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Step 1: Redirect to Google OAuth
  if (!code) {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    const state = `${Date.now()}:${crypto.randomUUID()}`;
    authUrl.searchParams.set("state", state);
    return Response.redirect(authUrl.toString(), 302);
  }

  // Validate state parameter to prevent CSRF attacks
  const state = url.searchParams.get("state");
  if (!state) {
    return new Response("Missing state parameter", { status: 400 });
  }
  const [tsStr] = state.split(":");
  const ts = Number(tsStr);
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  if (isNaN(ts) || Date.now() - ts > TEN_MINUTES_MS) {
    console.error("[Google OAuth] State parameter invalid or expired:", state);
    return new Response("Invalid or expired state parameter", { status: 400 });
  }

  // Step 2: Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    console.error("[Google OAuth] Token exchange failed:", await tokenRes.text());
    return new Response("Authentication failed. Please try again.", { status: 400 });
  }

  const tokenData = await tokenRes.json();

  // Step 3: Get channel ID
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
  );
  const channelData = await channelRes.json();
  const channelId = channelData.items?.[0]?.id || "";

  // Step 4: Save to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const expiry = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

  await supabase.from("social_tokens").upsert({
    platform: "google",
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    token_expiry: expiry,
    channel_id: channelId,
    metadata: { scope: tokenData.scope },
  }, { onConflict: "platform" });

  return Response.redirect(`${ADMIN_URL}?connected=google`, 302);
});
