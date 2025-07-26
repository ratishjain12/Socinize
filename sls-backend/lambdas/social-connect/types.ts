export interface SocialMediaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  scope: string;
  socialName: string;
}

export interface OAuthSession {
  account_id: string;
  user_id: string;
  code_verifier: string;
  state: string;
  social_name: string;
  created_at: string;
  code?: string;
  access_token?: string;
  refresh_token?: string;
  updated_at?: string;
}

export interface AuthResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface SocialMediaProvider {
  handleAuth(event: any): Promise<AuthResponse>;
  handleCallback(event: any): Promise<AuthResponse>;
  refreshToken(event: any): Promise<AuthResponse>;
  createTweet(event: any): Promise<AuthResponse>;
  getConfig(): SocialMediaConfig;
}
