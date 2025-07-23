import { createHash, randomBytes } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const { SOCIAL_ACCOUNTS_TABLE } = process.env;

function createResponse(statusCode: number, body: any, headers = {}) {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type , Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify(body),
  };
}

function createRedirectResponse(location: string) {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Location: location,
  };
  return {
    statusCode: 302,
    headers: defaultHeaders,
    body: "",
  };
}

function generateCodeVerifier() {
  return randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

function handleHome() {
  return createResponse(200, { message: "Hello, world!" });
}

async function putSocialAccount(item: any) {
  if (!SOCIAL_ACCOUNTS_TABLE)
    throw new Error("SOCIAL_ACCOUNTS_TABLE env var not set");
  const putCommand = new PutCommand({
    TableName: SOCIAL_ACCOUNTS_TABLE,
    Item: item,
  });
  await docClient.send(putCommand);
}

async function getSocialAccountByAccountId(accountId: string) {
  if (!SOCIAL_ACCOUNTS_TABLE)
    throw new Error("SOCIAL_ACCOUNTS_TABLE env var not set");
  const getCommand = new GetCommand({
    TableName: SOCIAL_ACCOUNTS_TABLE,
    Key: { account_id: accountId },
  });
  const res = await docClient.send(getCommand);
  return res.Item;
}

const CLIENT_ID = "UXdpNVhWdE10SlhLTUo1VnZxQ1Y6MTpjaQ";
const CLIENT_SECRET = "vfucHWGnrXuzAo6Z9XpMGRHdH2Td8mx49gVhPxkfx5w46CtAmx";
const REDIRECT_URI =
  "https://jjjmsxa5pd.execute-api.ap-south-1.amazonaws.com/connect/twitter/callback";

async function handleAuth(event: any) {
  console.log("🚀 Starting Twitter OAuth flow...", event);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = randomBytes(16).toString("hex");
  const sessionId = randomBytes(16).toString("hex");
  const userId = event.headers.authorization;

  console.log("UserrrrId", userId);

  if (!userId) {
    return createResponse(400, { error: "User ID not found" });
  }

  await putSocialAccount({
    account_id: sessionId,
    user_id: userId,
    code_verifier: codeVerifier,
    state,
    social_name: "twitter",
    created_at: new Date().toISOString(),
  });
  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "tweet.read tweet.write users.read offline.access",
    state: `${state}:${sessionId}`,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    user_id: userId,
  });
  const authUrl = `https://twitter.com/i/oauth2/authorize?${authParams.toString()}`;
  return createRedirectResponse(authUrl);
}

async function handleCallback(event: any) {
  console.log("EVENT::: ", event);
  const { code, state, error } = event.queryStringParameters;
  if (error) return createResponse(400, { error });
  if (!code)
    return createResponse(400, { error: "Missing authorization code" });
  if (!state) return createResponse(400, { error: "Missing state parameter" });
  const [originalState, sessionId] = state.split(":");
  if (!sessionId)
    return createResponse(400, { error: "Invalid state parameter" });
  const sessionData = await getSocialAccountByAccountId(sessionId);
  if (!sessionData)
    return createResponse(400, { error: "Session expired or invalid" });
  if (originalState !== sessionData.state)
    return createResponse(400, { error: "Invalid state parameter" });
  const codeVerifier = sessionData.code_verifier;
  const userId = event.user_id;

  if (!userId) {
    return createResponse(400, { error: "User ID not found" });
  }

  try {
    const tokenParams = new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );
    const fetchResponse = await fetch(
      "https://api.twitter.com/2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: tokenParams.toString(),
      }
    );
    const response = { data: await fetchResponse.json() };
    await putSocialAccount({
      account_id: sessionId,
      user_id: userId,
      code: code,
      state: sessionData.state,
      code_verifier: codeVerifier,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      social_name: "twitter",
      updated_at: new Date().toISOString(),
    });
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

exports.handler = async (event: any, context: any) => {
  const httpMethod = event.requestContext?.http?.method;
  const rawPath = event.rawPath;
  const pathParts = rawPath.split("/").filter((p: any) => p);
  try {
    if (httpMethod === "OPTIONS") return createResponse(200, {});
    if (
      httpMethod !== "GET" &&
      httpMethod !== "POST" &&
      httpMethod !== "OPTIONS"
    ) {
      return createResponse(405, { error: "Method Not Allowed" });
    }
    if (pathParts[0] === "connect" && pathParts[1] === "twitter") {
      const endpoint = pathParts[2] || "home";
      switch (endpoint) {
        case "home":
          return handleHome();
        case "auth":
          return handleAuth(event);
        case "callback":
          return handleCallback(event);
        default:
          return createResponse(404, { error: "Endpoint not found" });
      }
    }
  } catch (error) {
    return createResponse(500, {
      error: "Internal server error and error from catch block",
    });
  }
};
