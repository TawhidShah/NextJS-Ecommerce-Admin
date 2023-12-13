import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminReq } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  await mongooseConnect();
  
  await isAdminReq(req, res);
  
  // Not used, exists if needed
  if (method === "GET") {
    if (!id) {
      res.status(400).json({ error: "Bad Request - id is required" });
      return;
    }

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  }

  if (method === "DELETE" && id) {
    const result = await Category.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  }
}
