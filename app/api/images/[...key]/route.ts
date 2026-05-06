import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME } from "@/lib/s3";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const s3Key = key.join("/");

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const response = await s3.send(command);
    const body = await response.Body?.transformToByteArray();

    if (!body) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": response.ContentType ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
