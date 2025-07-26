import { SocialMediaProvider } from "../types";
import { TwitterProvider } from "./twitter";

export { TwitterProvider } from "./twitter";

const providers: Record<string, SocialMediaProvider> = {
  twitter: new TwitterProvider(),
};

export function getProvider(platform: string): SocialMediaProvider | null {
  return providers[platform.toLowerCase()] || null;
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(providers);
}

export function isPlatformSupported(platform: string): boolean {
  return platform.toLowerCase() in providers;
}
