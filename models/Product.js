import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String] },
  categories: { type: [mongoose.Types.ObjectId], ref: "Category" },
  price: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },

}, {
  timestamps: true,
});

export const Product = models.Product || model("Product", ProductSchema);
  