"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const POSTS_TABLE = process.env.POSTS_TABLE;
const handler = async (event) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: "Missing request body" };
        }
        const { platform, content, media } = JSON.parse(event.body);
        const claims = event.requestContext.authorizer?.jwt?.claims;
        const userId = claims?.sub;
        if (!userId) {
            return { statusCode: 401, body: "Unauthorized" };
        }
        const postId = (0, uuid_1.v4)();
        const now = new Date().toISOString();
        const item = {
            post_id: postId,
            user_id: userId,
            platform,
            content,
            media,
            status: "draft",
            created_at: now,
            updated_at: now,
        };
        await docClient.send(new lib_dynamodb_1.PutCommand({
            TableName: POSTS_TABLE,
            Item: item,
        }));
        return {
            statusCode: 201,
            body: JSON.stringify({ post_id: postId, status: "draft" }),
        };
    }
    catch (err) {
        console.error(err);
        return { statusCode: 500, body: "Internal server error" };
    }
};
exports.handler = handler;
