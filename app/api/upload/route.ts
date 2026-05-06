import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET_NAME } from "@/lib/s3";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    const ext = filename.split(".").pop();
    const key = `products/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ presignedUrl, key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
