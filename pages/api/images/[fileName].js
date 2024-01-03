import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { isAdminReq } from "../auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {

    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await isAdminReq(req, res);
    await mongooseConnect();
    
    const { fileName } = req.query;

    const client = new S3Client({
        region: "eu-west-2",
        credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    
    await client.send(
        new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        }),
    );

    res.status(200).json({ message: "Image deleted successfully" });
}