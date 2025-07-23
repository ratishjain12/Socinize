const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const session = require("express-session");
const {
  TwitterApiAutoTokenRefresher,
} = require("@twitter-api-v2/plugin-token-refresher");
const { TwitterApi } = require("twitter-api-v2");

const app = express();
const PORT = 3001;

// Twitter App Credentials (OAuth 2.0)
const CLIENT_ID = "UXdpNVhWdE10SlhLTUo1VnZxQ1Y6MTpjaQ";
const CLIENT_SECRET = "vfucHWGnrXuzAo6Z9XpMGRHdH2Td8mx49gVhPxkfx5w46CtAmx";
const REDIRECT_URI = "http://localhost:3001/auth/twitter/callback";

app.use(
  cors({
    origin: "https://98068544d733.ngrok-free.app",
  })
);
app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: "your-random-secret-key-change-this",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Helper: Generate code verifier (base64url-encoded random string)
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

// Helper: Generate code challenge from verifier (SHA256 hash)
function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

// Root endpoint for testing
app.get("/", (req, res) => {
  res.send(`
    <h1>Twitter OAuth 2.0 Server</h1>
    <p><a href="/auth/twitter">Click here to start Twitter OAuth flow</a></p>
  `);
});

// Step 1: Initiate OAuth flow
app.get("/auth/twitter", (req, res) => {
  console.log("🚀 Starting Twitter OAuth flow...");

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString("hex");

  // Store code verifier in session (critical for security)
  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  console.log("🔐 Generated code_verifier:", codeVerifier);
  console.log("🔒 Generated code_challenge:", codeChallenge);
  console.log("🎲 Generated state:", state);

  // Build authorization URL with proper scopes
  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "tweet.read tweet.write users.read offline.access",
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${authParams.toString()}`;

  console.log("📎 Redirecting to Twitter authorization URL...");
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for tokens
app.get("/auth/twitter/callback", async (req, res) => {
  const { code, state, error } = req.query;

  console.log("📥 Received callback from Twitter");
  console.log("Code:", code ? "Present" : "Missing");
  console.log("State:", state);
  console.log("Error:", error);

  // 🔍 DEBUG: See what's in your session
  console.log("🗃️ Session Contents:", {
    codeVerifier: req.session.codeVerifier ? "Present" : "Missing",
    state: req.session.state,
    sessionID: req.sessionID,
  });

  // Check for errors
  if (error) {
    console.error("❌ OAuth error:", error);
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  if (!code) {
    console.error("❌ No authorization code received");
    return res.status(400).send("Missing authorization code");
  }

  // Verify state parameter (CSRF protection)
  if (state !== req.session.state) {
    console.error("❌ State mismatch - potential CSRF attack");
    return res.status(400).send("Invalid state parameter");
  }

  // Get code verifier from session
  const codeVerifier = req.session.codeVerifier;
  if (!codeVerifier) {
    console.error("❌ No code verifier found in session");
    return res.status(400).send("Session expired or invalid");
  }

  console.log("🔄 Exchanging authorization code for access token...");

  try {
    // Prepare token exchange request
    const tokenParams = new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    // Create Basic Auth header (Base64 encoded CLIENT_ID:CLIENT_SECRET)
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    console.log("🔑 Using Basic Auth with credentials");

    // Exchange code for tokens
    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      tokenParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    console.log("🎉 Token exchange successful!");
    console.log("Token Response:", response.data);

    // Store tokens in session (in production, store securely in database)
    req.session.accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;

    // Clear PKCE parameters from session
    delete req.session.codeVerifier;
    delete req.session.state;

    // Send success response with tokens
    res.json({
      success: true,
      message: "OAuth flow completed successfully!",
      tokens: response.data,
      nextSteps:
        "You can now use the access_token to make API calls to Twitter",
    });
  } catch (error) {
    console.error("❌ Token exchange failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    res.status(500).json({
      error: "Token exchange failed",
      details: error.response?.data || error.message,
      troubleshooting: {
        common_issues: [
          "Authorization code expired (30 second limit)",
          "Code verifier mismatch",
          "Invalid client credentials",
          "Incorrect redirect URI",
          "App not properly configured in Twitter Developer Portal",
        ],
      },
    });
  }
});

const tokenStore = {
  accessToken:
    "M25Ia3F2STEyVExfazVjUy04X0t1NDFUZ2xaOXhhbXBfdlo1SUI2dE9Qc2Y0OjE3NTMwMTM4Mzk3MTE6MToxOmF0OjE",
  refreshToken:
    "NW43dkZSSzlwSkZ6Y0I0UFI3dFpVRDBHbVlCOTJWazM1WTU3b21CcUU3dHdPOjE3NTMwMTM4Mzk3MTE6MToxOnJ0OjE",
};

const credentials = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
};

const autoRefresherPlugin = new TwitterApiAutoTokenRefresher({
  refreshToken: tokenStore.refreshToken,
  refreshCredentials: credentials,
  async onTokenUpdate(token) {
    tokenStore.accessToken = token.accessToken;
    tokenStore.refreshToken = token.refreshToken;
    console.log("✅ Token refreshed");

    // Optional: Update in DB or secure storage
  },
  onTokenRefreshError(error) {
    console.error("❌ Failed to refresh token:", error);
  },
});

let twitterClient = new TwitterApi(tokenStore.accessToken, {
  plugins: [autoRefresherPlugin],
});

app.get("/refresh", async (req, res) => {
  try {
    const user = await twitterClient.v2.me();
    return res.json({
      message: "Access token is valid or refreshed successfully.",
      user,
      newAccessToken: tokenStore.accessToken,
      newRefreshToken: tokenStore.refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to refresh token", error });
  }
});

// Test endpoint to make a Twitter API call
app.get("/test-api", async (req, res) => {
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      error: "No access token found. Please complete OAuth flow first.",
      authUrl: "/auth/twitter",
    });
  }

  try {
    // Test API call - post a tweet
    const response = await axios.post(
      "https://api.x.com/2/tweets",
      {
        text: "Hi how were you",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      success: true,
      message: "API call successful!",
      user: response.data,
    });
  } catch (error) {
    console.error("❌ API call failed:", error.response?.data);
    res.status(500).json({
      error: "API call failed",
      details: error.response?.data || error.message,
    });
  }
});

// Endpoint to refresh access token
app.post("/refresh-token", async (req, res) => {
  const refreshToken = req.session.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: "No refresh token found",
    });
  }

  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const tokenParams = new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
    });

    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      tokenParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    // Update tokens in session
    req.session.accessToken = response.data.access_token;
    if (response.data.refresh_token) {
      req.session.refreshToken = response.data.refresh_token;
    }

    res.json({
      success: true,
      message: "Token refreshed successfully!",
      tokens: response.data,
    });
  } catch (error) {
    console.error("❌ Token refresh failed:", error.response?.data);
    res.status(500).json({
      error: "Token refresh failed",
      details: error.response?.data || error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(
    `👉 Open http://localhost:${PORT}/auth/twitter to begin OAuth flow`
  );
  console.log(`🧪 Test API calls at http://localhost:${PORT}/test-api`);
  console.log("\n📋 Setup checklist:");
  console.log("   ✅ Ensure your Twitter app has OAuth 2.0 enabled");
  console.log(
    "   ✅ Add http://localhost:3001/auth/twitter/callback to allowed redirect URIs"
  );
  console.log("   ✅ Set app permissions to Read and Write");
  console.log("   ✅ Your CLIENT_ID and CLIENT_SECRET are correct");
});
