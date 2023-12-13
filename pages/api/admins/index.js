import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { isAdminReq } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    
    await isAdminReq(req, res);


    if (method === "GET") {
        const admins = await Admin.find({});
        res.status(200).json(admins);
    }

    if (method === "POST") {
        const { email } = req.body;
        
        if (!email || email.trim() === "") {
            res.status(400).json({ error: "Bad Request", message: "Email is required" });
            return;
        }

        const admin = await Admin.create({ email });
        res.status(201).json(admin);
    
    }

    if (method === "DELETE") {
        res.status(405).json({ error: "Method not allowed" });
    }
  
}
