import { Layout, ConfirmActionModal } from "@/components";
import { mongooseConnect } from "@/lib/mongoose";
import React, { useState } from "react";
import { Admin } from "@/models/Admin";
import axios from "axios";
import { useRouter } from "next/router";

const Admins = ({ admins }) => {
  const router = useRouter();

  const refreshPage = () => {
    router.replace(router.asPath);
  }

  const [newAdminEmail, setNewAdminEmail] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [adminDeleteTitle, setAdminDeleteTitle] = useState(null);

  const addNewAdmin = async (e) => {
    e.preventDefault();

    if (!newAdminEmail.trim()) {
      alert("Admin email cannot be blank");
      return;
    }

    // if category name already exists, return
    if (admins.find((admin) => admin.email === newAdminEmail)) {
      alert("Admin already exists");
      return;
    }

    try {
      await axios.post("/api/admins", { email: newAdminEmail });
      setNewAdminEmail("");
      refreshPage();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id, title) => {
    if (admins.length === 1) {
      alert("Cannot delete the last admin");
      return;
    }
    setAdminId(id);
    setAdminDeleteTitle(title);
    setShowModal(true);
  };

  const deleteAdmin = async (id) => {
    try {
      if (!id) return;
      await axios.delete(`/api/admins/${id}`);
      refreshPage();
    } catch (error) {
      console.error(error);
    }
    finally {
      setShowModal(false);
    }
  };

  return (
    <Layout>
      <h1>Admins</h1>
      <form onSubmit={addNewAdmin}>
        <label htmlFor="newAdminEmail">Add New Admin</label>
        <div className="flex">
          <input
            className="my-input !mb-0 mr-2"
            type="text"
            id="newAdminEmail"
            placeholder="example@email.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </div>
      </form>

      {admins.length === 0 ? (
        <h1 className="mt-4">No Admins</h1>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Admin Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="max-w-[4rem] break-words">{admin.email}</td>
                  <td> {new Date(admin.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleDelete(admin._id, admin.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ConfirmActionModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            title="Confirm"
            message={`Are you sure you want to delete admin "${adminDeleteTitle}"?\nThis action cannot be undone.`}
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={() => deleteAdmin(adminId)}
            onCancel={() => setShowModal(false)}
          />
        </>
      )}
    </Layout>
  );
};

export default Admins;

export async function getServerSideProps() {
  mongooseConnect();
  const admins = await Admin.find({});
  return {
    props: {
      admins: JSON.parse(JSON.stringify(admins)),
    },
  };
}
