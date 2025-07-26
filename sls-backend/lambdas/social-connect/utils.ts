import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createHash, randomBytes } from "crypto";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthResponse, OAuthSession } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const { SOCIAL_ACCOUNTS_TABLE } = process.env;

export function createResponse(
  statusCode: number,
  body: any,
  headers = {}
): AuthResponse {
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

export function createRedirectResponse(location: string): AuthResponse {
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

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function generateState(): string {
  return randomBytes(16).toString("hex");
}

export function generateSessionId(): string {
  return randomBytes(16).toString("hex");
}

export async function putSocialAccount(item: OAuthSession): Promise<void> {
  if (!SOCIAL_ACCOUNTS_TABLE)
    throw new Error("SOCIAL_ACCOUNTS_TABLE env var not set");

  const putCommand = new PutCommand({
    TableName: SOCIAL_ACCOUNTS_TABLE,
    Item: item,
  });
  await docClient.send(putCommand);
}

export async function getSocialAccountByAccountId(
  accountId: string
): Promise<OAuthSession | undefined> {
  if (!SOCIAL_ACCOUNTS_TABLE)
    throw new Error("SOCIAL_ACCOUNTS_TABLE env var not set");

  const getCommand = new GetCommand({
    TableName: SOCIAL_ACCOUNTS_TABLE,
    Key: { account_id: accountId },
  });
  const res = await docClient.send(getCommand);
  return res.Item as OAuthSession | undefined;
}

export function validateUserId(userId: string | undefined): string | null {
  if (!userId) return null;
  return userId.replace(/^"|"$/g, "");
}
