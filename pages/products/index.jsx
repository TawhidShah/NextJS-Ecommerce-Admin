import { useEffect, useState } from "react";
import { Layout, PageLoader, Table, ConfirmActionModal } from "@/components";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  const [errorMessage, setErrorMessage] = useState(router.query.error);
  const [loading, setLoading] = useState(true);

  // State for controlling the visibility of the modal and product id for deletion
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productDeleteTitle, setProductDeleteTitle] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      router.push("/products");
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEdit = (id) => {
    router.push(`/products/edit/${id}`);
  };

  const handleDelete = (id, title) => {
    setProductId(id);
    setProductDeleteTitle(title);
    setShowModal(true);
  };

  const deleteProduct = async (id) => {
    try {
      if (!id) return;
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {loading && <PageLoader />}

      {!loading && (
        <>
          {errorMessage && (
            <p className="mb-2 font-bold text-red-500">{errorMessage}</p>
          )}
          <h1>Products</h1>
          <Link className="btn-primary h-12" href={"/products/newproduct"}>
            Add new product
          </Link>

          {products.length === 0 ? (
            <h1 className="mt-4">No Products</h1>
          ) : (
            <>
              <Table
                tableHead={"Product Name"}
                items={products}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />

              <ConfirmActionModal
                showModal={showModal}
                onClose={() => setShowModal(false)}
                title="Confirm"
                message={`Are you sure you want to delete "${productDeleteTitle}"?\nThis action cannot be undone.`}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={() => deleteProduct(productId)}
                onCancel={() => setShowModal(false)}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
}

export default Products;