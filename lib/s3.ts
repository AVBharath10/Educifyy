import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is not defined");
    }

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: contentType,
        // ACL: 'public-read', // Optional: depending on bucket settings
    });

    await s3Client.send(command);

    // Return the public URL (assuming public bucket access or CloudFront)
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export async function getPresignedUploadUrl(
    fileName: string,
    contentType: string
): Promise<{ url: string; fields: Record<string, string> }> {
    // This is a simplified version. For direct browser uploads, we'd use createPresignedPost
    // But for now, we'll stick to server-side upload or simple PUT presigned URL
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) throw new Error("AWS_BUCKET_NAME is not defined");

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, fields: {} };
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) return;

    try {
        // Extract key from URL
        // URL format: https://{bucket}.s3.{region}.amazonaws.com/{key}
        // or https://{bucket}.s3.amazonaws.com/{key}

        const urlObj = new URL(fileUrl);
        // The pathname includes the leading slash, e.g. "/folder/file.mp4"
        // We need to remove the leading slash to get the key
        const key = urlObj.pathname.substring(1);

        // Safety check: ensure we are deleting from our bucket
        if (!urlObj.hostname.includes(bucketName)) {
            console.warn(`Skipping S3 delete for non-matching bucket URL: ${fileUrl}`);
            return;
        }

        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);
        console.log(`Successfully deleted S3 object: ${key}`);
    } catch (error) {
        console.error(`Failed to delete S3 object: ${fileUrl}`, error);
        // We don't throw here to avoid blocking the DB delete if S3 fails
    }
}
