// pages/api/products/[id].js
import { Product } from "@/models/Product";
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

  if (method === "GET") {
    if (!id) {
      res.status(400).json({ error: "Bad Request", message: "id is required" });
      return;
    }

    const product = await Product.findById(id).populate("categories", Category);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  }

  if (method === "DELETE" && id) {
    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }
}
