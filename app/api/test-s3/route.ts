import { NextResponse } from "next/server";
import { S3Client, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    try {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const bucketName = process.env.AWS_BUCKET_NAME;

        // 1. Check if variables exist
        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
            return NextResponse.json({
                status: "error",
                message: "Missing Environment Variables",
                details: {
                    hasRegion: !!region,
                    hasAccessKey: !!accessKeyId,
                    hasSecret: !!secretAccessKey,
                    hasBucket: !!bucketName,
                }
            }, { status: 500 });
        }

        // 2. Initialize Client
        const client = new S3Client({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });

        // 3. Try to List Objects (Tests Read Permissions)
        const listCommand = new ListObjectsCommand({ Bucket: bucketName, MaxKeys: 1 });
        await client.send(listCommand);

        // 4. Try to Upload a Test File (Tests Write Permissions)
        const testFileName = "connection-test.txt";
        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: testFileName,
            Body: "Hello from Educify! S3 connection is working.",
            ContentType: "text/plain",
        });
        await client.send(putCommand);

        return NextResponse.json({
            status: "success",
            message: "✅ AWS S3 Connection Verified!",
            details: {
                bucket: bucketName,
                region: region,
                writeTest: "Success (uploaded connection-test.txt)",
                readTest: "Success (listed objects)"
            }
        });

    } catch (error: any) {
        console.error("S3 Test Error:", error);
        return NextResponse.json({
            status: "error",
            message: "❌ Connection Failed",
            error: error.message,
            code: error.Code || error.code,
            requestId: error.$metadata?.requestId
        }, { status: 500 });
    }
}
