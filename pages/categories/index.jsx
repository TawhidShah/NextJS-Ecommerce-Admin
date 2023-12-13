import { useEffect, useState } from "react";
import { Layout, PageLoader, ConfirmActionModal, Table } from "@/components";
import axios from "axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryDeleteTitle, setCategoryDeleteTitle] = useState(null);

  const getCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      // Sort the categories based on the 'title' key
      const sortedCategories = res.data.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        return titleA < titleB ? -1 : 1;
      });

      setCategories(sortedCategories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addNewCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be blank");
      return;
    }

    // if category name already exists, return
    if (categories.find((category) => category.title === categoryName)) {
      alert("Category already exists");
      return;
    }

    try {
      await axios.post("/api/categories", { title: categoryName });
      setCategoryName("");
      getCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id, title) => {
    setCategoryId(id);
    setCategoryDeleteTitle(title);
    setShowModal(true);
  };

  const deleteCategory = async (id) => {
    try {
      if (!id) return;
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Layout>
      {loading && <PageLoader />}

      {!loading && (
        <>
          <h1>Categories</h1>
          <form onSubmit={addNewCategory}>
            <label htmlFor="categoryName">New Category Name</label>
            <div className="flex">
              <input
                className="my-input !mb-0 mr-2"
                type="text"
                id="categoryName"
                placeholder="Category name"
                value={categoryName}
                onChange={(e) =>
                  setCategoryName(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  )
                }
              />
              <button type="submit" className="btn-primary">
                Add
              </button>
            </div>
          </form>

          {categories.length === 0 ? (
            <h1 className="mt-4">No Categories</h1>
          ) : (
            <>
              <Table
                tableHead={"Cateogry Name"}
                items={categories}
                handleDelete={handleDelete}
              />

              <ConfirmActionModal
                showModal={showModal}
                onClose={() => setShowModal(false)}
                title="Confirm"
                message={`Are you sure you want to delete category "${categoryDeleteTitle}"?\nThis action cannot be undone.`}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={() => deleteCategory(categoryId)}
                onCancel={() => setShowModal(false)}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
}

export default Categories;