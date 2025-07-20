import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { TwitterApi } from "twitter-api-v2";

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const SOCIAL_ACCOUNTS_TABLE =
  process.env.SOCIAL_ACCOUNTS_TABLE || "SocialAccounts";

const CLIENT_ID =
  process.env.TWITTER_CLIENT_ID || "UXdpNVhWdE10SlhLTUo1VnZxQ1Y6MTpjaQ";
const CLIENT_SECRET =
  process.env.TWITTER_CLIENT_SECRET ||
  "vfucHWGnrXuzAo6Z9XpMGRHdH2Td8mx49gVhPxkfx5w46CtAmx";
const REDIRECT_URI =
  process.env.TWITTER_REDIRECT_URI ||
  "https://jjjmsxa5pd.execute-api.ap-south-1.amazonaws.com/connect/twitter/callback";

function extractUserIdFromToken(event: APIGatewayProxyEvent): string | null {
  try {
    const requestContext = event.requestContext;
    if (requestContext.authorizer && requestContext.authorizer.claims) {
      return requestContext.authorizer.claims.sub;
    }
    return null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
}

async function setLoginCredentials(userId: string, credentials: any) {
  try {
    const timestamp = new Date().toISOString();

    const params = {
      TableName: SOCIAL_ACCOUNTS_TABLE,
      Item: {
        account_id: userId,
        user_id: userId,
        social_name: "twitter",
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
        created_at: timestamp,
        updated_at: timestamp,
        is_active: true,
      },
    };

    await docClient.send(new PutCommand(params));
    console.log(`✅ Stored Twitter credentials for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error storing Twitter credentials:`, error);
    throw error;
  }
}

async function getLoginCredentials(userId: string) {
  try {
    const params = {
      TableName: SOCIAL_ACCOUNTS_TABLE,
      Key: {
        account_id: userId,
      },
    };

    const result = await docClient.send(new GetCommand(params));
    if (result.Item) {
      return {
        accessToken: result.Item.access_token,
        refreshToken: result.Item.refresh_token,
        socialName: result.Item.social_name,
        createdAt: result.Item.created_at,
        updatedAt: result.Item.updated_at,
      };
    }
    return null;
  } catch (error) {
    console.error(`❌ Error getting Twitter credentials:`, error);
    throw error;
  }
}

async function setLoginVerifierForState(state: string, codeVerifier: string) {
  try {
    const timestamp = new Date().toISOString();
    const userId = state.split("_")[0];

    const params = {
      TableName: SOCIAL_ACCOUNTS_TABLE,
      Item: {
        account_id: userId,
        user_id: userId,
        social_name: "twitter_verifier",
        code_verifier: codeVerifier,
        state: state,
        created_at: timestamp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        is_active: true,
      },
    };

    await docClient.send(new PutCommand(params));
    console.log(`✅ Stored code verifier for state: ${state}`);
    return true;
  } catch (error) {
    console.error(`❌ Error storing code verifier:`, error);
    throw error;
  }
}

async function getLoginVerifierFromState(state: string) {
  try {
    const userId = state.split("_")[0];

    const params = {
      TableName: SOCIAL_ACCOUNTS_TABLE,
      Key: {
        account_id: userId,
      },
    };

    const result = await docClient.send(new GetCommand(params));

    if (result.Item && result.Item.social_name === "twitter_verifier") {
      const expiresAt = new Date(result.Item.expires_at);
      if (expiresAt < new Date()) {
        console.log(`❌ Code verifier expired for state: ${state}`);

        await deleteLoginVerifierFromState(state);
        return null;
      }

      console.log(`✅ Retrieved code verifier for state: ${state}`);
      return result.Item.code_verifier;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error getting code verifier:`, error);
    throw error;
  }
}

async function deleteLoginVerifierFromState(state: string) {
  try {
    const userId = state.split("_")[0];

    const params = {
      TableName: SOCIAL_ACCOUNTS_TABLE,
      Key: {
        account_id: userId,
      },
    };

    await docClient.send(new DeleteCommand(params));
    console.log(`✅ Deleted code verifier for state: ${state}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting code verifier:`, error);
    throw error;
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const path = event.path;
    const method = event.httpMethod;
    const userId = extractUserIdFromToken(event);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    };

    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: "",
      };
    }

    const pathParts = path.split("/");

    if (pathParts[2] !== "twitter") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Only Twitter is supported" }),
      };
    }

    if (pathParts[3] === "auth" && method === "GET") {
      if (!userId) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      console.log("🚀 Starting Twitter OAuth flow...");
      console.log("Cognito User ID:", userId);

      try {
        const loginClient = new TwitterApi({
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
        });

        const { url, codeVerifier, state } = loginClient.generateOAuth2AuthLink(
          REDIRECT_URI,
          {
            scope: [
              "tweet.read",
              "tweet.write",
              "users.read",
              "offline.access",
            ],
          }
        );

        await setLoginVerifierForState(state, codeVerifier);

        console.log("🔐 Generated code_verifier:", codeVerifier);
        console.log("🎲 Generated state:", state);
        console.log("📎 Redirecting to Twitter authorization URL...");

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            authUrl: url,
            state: state,
            platform: "twitter",
          }),
        };
      } catch (error: any) {
        console.error("❌ Error generating OAuth link:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: "Failed to generate OAuth link",
            details: error.message,
          }),
        };
      }
    } else if (pathParts[3] === "callback" && method === "GET") {
      const queryParams = event.queryStringParameters || {};
      const { code, state, error } = queryParams;

      console.log("📥 Received callback from Twitter");
      console.log("Code:", code ? "Present" : "Missing");
      console.log("State:", state);
      console.log("Error:", error);

      if (error) {
        console.error("❌ OAuth error:", error);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `OAuth Error: ${error}` }),
        };
      }

      if (!code) {
        console.error("❌ No authorization code received");
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing authorization code" }),
        };
      }

      const codeVerifier = await getLoginVerifierFromState(state || "");
      if (!codeVerifier) {
        console.error("❌ No code verifier found for state or session expired");
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "You denied the app or your session expired!",
          }),
        };
      }

      try {
        console.log("🔄 Exchanging authorization code for access token...");

        const loginClient = new TwitterApi({
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
        });

        const { client, accessToken, refreshToken } =
          await loginClient.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: REDIRECT_URI,
          });

        const concernedUser = await client.v2.me();
        const twitterUserId = concernedUser.data.id;

        console.log("🎉 Token exchange successful!");
        console.log("Twitter User ID:", twitterUserId);
        console.log("Access Token:", accessToken ? "Present" : "Missing");
        console.log("Refresh Token:", refreshToken ? "Present" : "Missing");

        const cognitoUserId = state?.split("_")[0];

        if (!cognitoUserId) {
          console.error("❌ No Cognito user ID found in state");
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: "Cognito user ID not found",
              message: "Please restart OAuth flow",
            }),
          };
        }

        console.log("Cognito User ID:", cognitoUserId);

        await setLoginCredentials(cognitoUserId, { accessToken, refreshToken });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "OAuth flow completed successfully!",
            cognitoUserId: cognitoUserId,
            twitterUser: concernedUser.data,
            tokens: { accessToken, refreshToken },
            nextSteps:
              "You can now use the access_token to make API calls to Twitter",
          }),
        };
      } catch (error: any) {
        console.error("❌ Token exchange failed:");
        console.error("Error:", error.message);

        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            error: "Invalid verifier or access tokens!",
            details: error.message,
            troubleshooting: {
              common_issues: [
                "Authorization code expired (30 second limit)",
                "Code verifier mismatch",
                "Invalid client credentials",
                "Incorrect redirect URI",
                "App not properly configured in Twitter Developer Portal",
              ],
            },
          }),
        };
      }
    } else if (pathParts[3] === "refresh" && method === "GET") {
      if (!userId) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      try {
        const credentials = await getLoginCredentials(userId);
        if (!credentials) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              error: "No Twitter credentials found for user",
            }),
          };
        }

        const client = new TwitterApi(credentials.accessToken);
        const user = await client.v2.me();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: "Access token is valid.",
            user: user.data,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
          }),
        };
      } catch (error: any) {
        console.error("❌ Token refresh failed:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            message: "Failed to refresh token",
            error: error.message,
          }),
        };
      }
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Endpoint not found" }),
      };
    }
  } catch (error: any) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
