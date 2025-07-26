import { SocialMediaProvider, SocialMediaConfig, AuthResponse } from "../types";
import {
  createResponse,
  createRedirectResponse,
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateSessionId,
  putSocialAccount,
  getSocialAccountByAccountId,
  validateUserId,
} from "../utils";

export class TwitterProvider implements SocialMediaProvider {
  private config: SocialMediaConfig = {
    clientId: "UXdpNVhWdE10SlhLTUo1VnZxQ1Y6MTpjaQ",
    clientSecret: "vfucHWGnrXuzAo6Z9XpMGRHdH2Td8mx49gVhPxkfx5w46CtAmx",
    redirectUri:
      "https://jjjmsxa5pd.execute-api.ap-south-1.amazonaws.com/connect/twitter/callback",
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    scope: "tweet.read tweet.write users.read offline.access",
    socialName: "twitter",
  };

  getConfig(): SocialMediaConfig {
    return this.config;
  }

  async handleAuth(event: any): Promise<AuthResponse> {
    console.log("🚀 Starting Twitter OAuth flow...", event);

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();
    const sessionId = generateSessionId();
    const userId = event.queryStringParameters?.userId;

    console.log("UserrrrId", userId);

    if (!userId) {
      return createResponse(400, { error: "User ID not found" });
    }

    await putSocialAccount({
      account_id: userId,
      user_id: userId,
      code_verifier: codeVerifier,
      state,
      social_name: this.config.socialName,
      created_at: new Date().toISOString(),
    });

    const authParams = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: `${state}:${sessionId}:${userId}`,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      user_id: userId,
    });

    const authUrl = `${this.config.authUrl}?${authParams.toString()}`;
    return createRedirectResponse(authUrl);
  }

  async handleCallback(event: any): Promise<AuthResponse> {
    console.log("EVENT::: ", event);

    const { code, state, error } = event.queryStringParameters;

    if (error) return createResponse(400, { error });
    if (!code)
      return createResponse(400, { error: "Missing authorization code" });
    if (!state)
      return createResponse(400, { error: "Missing state parameter" });

    const [originalState, sessionId, userId] = state.split(":");
    if (!sessionId)
      return createResponse(400, { error: "Invalid state parameter" });

    const sessionData = await getSocialAccountByAccountId(userId);
    if (!sessionData)
      return createResponse(400, { error: "Session expired or invalid" });
    if (originalState !== sessionData.state)
      return createResponse(400, { error: "Invalid state parameter" });

    const codeVerifier = sessionData.code_verifier;
    const validatedUserId = validateUserId(userId);

    if (!validatedUserId) {
      return createResponse(400, { error: "User ID not found" });
    }

    try {
      const tokenParams = new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier,
      });

      const credentials = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString("base64");

      const fetchResponse = await fetch(this.config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: tokenParams.toString(),
      });

      const response = { data: await fetchResponse.json() };

      await putSocialAccount({
        account_id: userId,
        user_id: validatedUserId,
        code: code,
        state: sessionData.state,
        code_verifier: codeVerifier,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        social_name: this.config.socialName,
        created_at: sessionData.created_at,
        updated_at: new Date().toISOString(),
      });

      const redirectUrl = `http://localhost:5173`;
      return createRedirectResponse(redirectUrl);
    } catch (error: any) {
      return createResponse(500, {
        error: "Token exchange failed",
        details: error.response?.data || error.message,
      });
    }
  }

  async refreshToken(event: any): Promise<AuthResponse> {
    console.log("🔄 Starting token refresh...", event);

    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return createResponse(400, { error: "User ID not found" });
    }

    const sessionData = await getSocialAccountByAccountId(userId);
    if (!sessionData || !sessionData.refresh_token) {
      return createResponse(401, { error: "No refresh token found" });
    }

    try {
      const credentials = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString("base64");

      const tokenParams = new URLSearchParams({
        refresh_token: sessionData.refresh_token,
        grant_type: "refresh_token",
        client_id: this.config.clientId,
      });

      const fetchResponse = await fetch(this.config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: tokenParams.toString(),
      });

      const response = { data: await fetchResponse.json() };

      // Update tokens in database
      await putSocialAccount({
        account_id: userId,
        user_id: sessionData.user_id,
        code_verifier: sessionData.code_verifier,
        state: sessionData.state,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token || sessionData.refresh_token,
        social_name: this.config.socialName,
        created_at: sessionData.created_at,
        updated_at: new Date().toISOString(),
      });

      return createResponse(200, {
        success: true,
        message: "Token refreshed successfully!",
        tokens: response.data,
      });
    } catch (error: any) {
      console.error("❌ Token refresh failed:", error);
      return createResponse(500, {
        error: "Token refresh failed",
        details: error.response?.data || error.message,
      });
    }
  }

  async createTweet(event: any): Promise<AuthResponse> {
    console.log("🐦 Creating tweet...", event);

    const userId = validateUserId(event.queryStringParameters?.userId);
    if (!userId) {
      return createResponse(400, { error: "User ID not found" });
    }

    const sessionData = await getSocialAccountByAccountId(userId);
    if (!sessionData || !sessionData.access_token) {
      return createResponse(401, { error: "No access token found" });
    }

    // Parse request body for tweet text
    let tweetText = "";
    try {
      if (event.body) {
        const body = JSON.parse(event.body);
        tweetText = body.text || "";
      }
    } catch (error) {
      return createResponse(400, { error: "Invalid request body" });
    }

    if (!tweetText) {
      return createResponse(400, { error: "Tweet text is required" });
    }

    try {
      const fetchResponse = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body: JSON.stringify({
          text: tweetText,
        }),
      });

      const response = { data: await fetchResponse.json() };

      if (!fetchResponse.ok) {
        return createResponse(fetchResponse.status, {
          error: "Failed to create tweet",
          details: response.data,
        });
      }

      return createResponse(200, {
        success: true,
        message: "Tweet created successfully!",
        tweet: response.data,
      });
    } catch (error: any) {
      console.error("❌ Tweet creation failed:", error);
      return createResponse(500, {
        error: "Tweet creation failed",
        details: error.message,
      });
    }
  }
}
