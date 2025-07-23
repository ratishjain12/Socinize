import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({});
const MEDIA_BUCKET = process.env.MEDIA_UPLOADS_BUCKET!;

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const { operation, fileName, contentType } = JSON.parse(event.body);

    const claims = (event.requestContext as any).authorizer?.jwt?.claims;
    const userId = claims?.sub;
    if (!userId) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    if (!["GET", "PUT"].includes(operation)) {
      return { statusCode: 400, body: "Operation must be 'GET' or 'PUT'" };
    }

    const fileKey = fileName
      ? `media/${userId}/${fileName}`
      : `media/${userId}/${uuidv4()}`;

    let presignedUrl: string;

    if (operation === "PUT") {
      const putCommand = new PutObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: fileKey,
        ContentType: contentType || "application/octet-stream",
      });

      presignedUrl = await getSignedUrl(s3Client, putCommand, {
        expiresIn: 3600,
      });
    } else {
      const getCommand = new GetObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: fileKey,
      });

      presignedUrl = await getSignedUrl(s3Client, getCommand, {
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
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    return { statusCode: 500, body: "Internal server error" };
  }
};
