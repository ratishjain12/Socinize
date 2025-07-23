"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const { USERS_TABLE } = process.env;
const handler = async (event) => {
    console.log("Post-confirmation event:", JSON.stringify(event, null, 2));
    try {
        const { userName } = event;
        const { userAttributes } = event.request;
        console.log("userName:", userName);
        console.log("userAttributes:", JSON.stringify(userAttributes, null, 2));
        console.log("USERS_TABLE:", USERS_TABLE);
        if (!userName) {
            throw new Error("userName is required but was not provided");
        }
        if (!userAttributes || !userAttributes.email) {
            throw new Error("userAttributes.email is required but was not provided");
        }
        const userItem = {
            user_id: userName,
            email: userAttributes.email,
            preferred_username: userAttributes.name || userAttributes.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "active",
        };
        console.log("Creating user item:", JSON.stringify(userItem, null, 2));
        const putCommand = new lib_dynamodb_1.PutCommand({
            TableName: USERS_TABLE,
            Item: userItem,
            ConditionExpression: "attribute_not_exists(user_id)",
        });
        await docClient.send(putCommand);
        console.log("User created successfully:", userItem);
        return event;
    }
    catch (error) {
        console.error("Error creating user:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        if (error.name === "ConditionalCheckFailedException") {
            console.log("User already exists, continuing...");
            return event;
        }
        console.error("Full error object:", error);
        throw error;
    }
};
exports.handler = handler;
