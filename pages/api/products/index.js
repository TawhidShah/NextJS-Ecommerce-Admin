import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminReq } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  await isAdminReq(req, res);

  if (method === "GET") {
    res.json(await Product.find({}));
  }

  if (method === "POST") {
    const { title, description, images, categories, price } = req.body;

    if (!title || !description || !images || !categories || !price) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    try {
      const formattedPrice = parseFloat(price).toFixed(2);

      const product = await Product.create({
        title,
        description,
        images,
        categories,
        price: formattedPrice,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === "PUT") {
    const { _id, title, description, images, categories, price, isFeatured } =
      req.body;

    // Check if _id is provided and at least one of the other fields to update
    if (
      !_id ||
      (!title &&
        !description &&
        !images &&
        !categories &&
        !price &&
        !isFeatured)
    ) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    const productUpdate = {};
    if (title) productUpdate.title = title;
    if (description) productUpdate.description = description;
    if (images) productUpdate.images = images;
    if (categories) productUpdate.categories = categories;
    if (price) productUpdate.price = parseFloat(price).toFixed(2);
    // is a bool so we need to check if it is undefined cannot just do if(isFeatured)
    if (isFeatured !== undefined && isFeatured !== null)
      productUpdate.isFeatured = isFeatured;

    const result = await Product.updateOne({ _id }, productUpdate);
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Product updated successfully" });
    } else if (result.matchedCount > 0) {
      res.status(200).json({ message: "No changes made" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }

  if (method === "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
  }
}