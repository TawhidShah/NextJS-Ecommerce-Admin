import multiparty from "multiparty";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import mime from "mime-types";
import { isAdminReq } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await isAdminReq(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const client = new S3Client({
    region: "eu-west-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];
  for (const file of files.files) {
    const fileName = `${file.originalFilename}-${uuidv4()}`;

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      }),
    );
    const link = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    links.push(link);
  }

  res.status(200).json({ links });
}

export const config = {
  api: { bodyParser: false },
};
