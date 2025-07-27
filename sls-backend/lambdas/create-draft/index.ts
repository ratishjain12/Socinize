import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const POSTS_TABLE = process.env.POSTS_TABLE!;

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const {
      platform,
      content,
      media,
      status = "draft",
    } = JSON.parse(event.body);

    if (!["draft", "active", "scheduled"].includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid status. Must be 'draft', 'active', or 'scheduled'",
        }),
      };
    }

    const claims = (event.requestContext as any).authorizer?.jwt?.claims;
    const userId = claims?.sub;
    if (!userId) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const postId = uuidv4();
    const now = new Date().toISOString();

    const item = {
      post_id: postId,
      user_id: userId,
      platform,
      content,
      media,
      status,
      created_at: now,
      updated_at: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: POSTS_TABLE,
        Item: item,
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ post_id: postId, status }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal server error" };
  }
};
