import { createResponse } from "./utils";
import {
  getProvider,
  isPlatformSupported,
  getSupportedPlatforms,
} from "./providers";

function handleHome() {
  return createResponse(200, {
    message: "Social Media OAuth Handler",
    supportedPlatforms: getSupportedPlatforms(),
    endpoints: {
      auth: "/connect/{platform}/auth",
      callback: "/connect/{platform}/callback",
      home: "/connect/{platform}/home",
    },
  });
}

function handleUnsupportedPlatform(platform: string) {
  return createResponse(400, {
    error: `Unsupported platform: ${platform}`,
    supportedPlatforms: getSupportedPlatforms(),
  });
}

function handleMethodNotAllowed() {
  return createResponse(405, { error: "Method Not Allowed" });
}

function handleNotFound() {
  return createResponse(404, { error: "Endpoint not found" });
}

exports.handler = async (event: any, context: any) => {
  console.log("EVENT::: ", event);

  const httpMethod = event.requestContext?.httpMethod;
  const rawPath = event.path;
  const pathParts = rawPath.split("/").filter((p: any) => p);

  try {
    if (httpMethod === "OPTIONS") {
      return createResponse(200, {});
    }

    if (
      httpMethod !== "GET" &&
      httpMethod !== "POST" &&
      httpMethod !== "OPTIONS"
    ) {
      return handleMethodNotAllowed();
    }

    if (pathParts[0] === "connect" && pathParts.length >= 2) {
      const platform = pathParts[1];
      const endpoint = pathParts[2] || "home";

      if (!isPlatformSupported(platform)) {
        return handleUnsupportedPlatform(platform);
      }

      const provider = getProvider(platform);
      if (!provider) {
        return handleUnsupportedPlatform(platform);
      }

      switch (endpoint) {
        case "home":
          return handleHome();
        case "auth":
          return await provider.handleAuth(event);
        case "callback":
          return await provider.handleCallback(event);
        default:
          return handleNotFound();
      }
    }

    return handleNotFound();
  } catch (error: any) {
    console.error("Error in handler:", error);
    return createResponse(500, {
      error: "Internal server error",
      details: error.message,
    });
  }
};
