"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const s3Client = new client_s3_1.S3Client({});
const MEDIA_BUCKET = process.env.MEDIA_UPLOADS_BUCKET;
const handler = async (event) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: "Missing request body" };
        }
        const { operation, fileName, contentType } = JSON.parse(event.body);
        const claims = event.requestContext.authorizer?.jwt?.claims;
        const userId = claims?.sub;
        if (!userId) {
            return { statusCode: 401, body: "Unauthorized" };
        }
        if (!["GET", "PUT"].includes(operation)) {
            return { statusCode: 400, body: "Operation must be 'GET' or 'PUT'" };
        }
        const fileKey = fileName
            ? `media/${userId}/${fileName}`
            : `media/${userId}/${(0, uuid_1.v4)()}`;
        let presignedUrl;
        if (operation === "PUT") {
            const putCommand = new client_s3_1.PutObjectCommand({
                Bucket: MEDIA_BUCKET,
                Key: fileKey,
                ContentType: contentType || "application/octet-stream",
            });
            presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, putCommand, {
                expiresIn: 3600,
            });
        }
        else {
            const getCommand = new client_s3_1.GetObjectCommand({
                Bucket: MEDIA_BUCKET,
                Key: fileKey,
            });
            presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, getCommand, {
                expiresIn: 3600,
            });
        }
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                presignedUrl,
                fileKey,
                operation,
                expiresIn: 3600,
            }),
        };
    }
    catch (err) {
        console.error("Error generating presigned URL:", err);
        return { statusCode: 500, body: "Internal server error" };
    }
};
exports.handler = handler;
