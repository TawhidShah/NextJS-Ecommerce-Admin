import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminReq } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    
    await isAdminReq(req, res);

    if (method === "GET") {
        const categories = await Category.find({});
        res.status(200).json(categories);
    }

    if (method === "POST") {
        const { title } = req.body;
        
        if (!title || title.trim() === "") {
            res.status(400).json({ error: "Bad Request", message: "Title is required" });
            return;
        }

        const category = await Category.create({ title });
        res.status(201).json(category);
    
    }

    if (method === "DELETE") {
        res.status(405).json({ error: "Method not allowed" });
    }
  
}
