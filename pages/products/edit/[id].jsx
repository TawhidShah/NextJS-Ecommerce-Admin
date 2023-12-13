import { Layout, PageLoader, ProductForm } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const EditProduct = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (!id) {
      router.push(
        "/products?error=Error getting product - Press edit button if you want to edit an existing product",
      );
      return;
    }
    const getProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProductData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, []);

  return (
    <Layout>
      {loading && <PageLoader />}

      {!loading && productData && (
        <>
          <h1> Edit Product </h1>
          <ProductForm {...productData} />
        </>
      )}
    </Layout>
  );
}

export default EditProduct;