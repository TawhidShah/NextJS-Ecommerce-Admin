import { Admin } from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminReq } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  await mongooseConnect();

  await isAdminReq(req, res);

  if (method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const numberOfAdmins = await Admin.countDocuments({});
  if (numberOfAdmins === 1) {
    res.status(403).json({ message: "Cannot delete last admin" });
    return;
  }

  const result = await Admin.deleteOne({ _id: id });

  if (result.deletedCount > 0) {
    res.status(200).json({ message: "Admin deleted successfully" });
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
}
