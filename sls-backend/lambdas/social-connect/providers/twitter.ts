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
    const userId = validateUserId(event.queryStringParameters?.userId);

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

      return createResponse(200, {
        success: true,
        message: "OAuth flow completed successfully!",
        sessionId: sessionId,
        tokens: response.data,
        nextSteps: "Use the sessionId to make authenticated API calls",
      });
    } catch (error: any) {
      return createResponse(500, {
        error: "Token exchange failed",
        details: error.response?.data || error.message,
      });
    }
  }
}
