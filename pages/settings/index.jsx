import { Layout, PageLoader } from "@/components";
import React from "react";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import Select from "react-select";
import { set } from "mongoose";

const Settings = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [oldFeaturedProduct, setOldFeaturedProduct] = useState(null);
  const [newFeaturedProduct, setNewFeaturedProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        const products = res.data;

        const featuredProduct = products.find((prodcut) => prodcut.isFeatured);

        setOldFeaturedProduct(featuredProduct);

        setAllProducts(products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  ///////////////////////
  ///Categories Select///
  //////////////////////

  const colorStyles = {
    control: (styles, state) => ({
      ...styles,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#0ea5e9" : null,
        color: isFocused ? "white" : null,
      };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        // backgroundColor: "#0ea5e9",
        color: "black",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "black",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "black",
      ":hover": {
        // backgroundColor: "#0ea5e9",
        color: "black",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
      },
    }),
  };

  // TODO: handle featured product on server side instead of sending two requests on client side
  const handleFeaturedProductSelect = async (product) => {
    setOldFeaturedProduct({ ...oldFeaturedProduct, isFeatured: false });
    setNewFeaturedProduct({ ...product, isFeatured: true });
  };

  const onSave = async () => {
    try {
      if (oldFeaturedProduct) {
        axios.put(`/api/products`, oldFeaturedProduct);
      }

      if (newFeaturedProduct) {
        axios.put(`/api/products`, newFeaturedProduct);
      }

      setOldFeaturedProduct(newFeaturedProduct);
      setNewFeaturedProduct(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {loading && <PageLoader />}

      {!loading && (
        <>
          <h1>Settings</h1>
          <label htmlFor="">Featured Product</label>
          <Select
            options={allProducts}
            getOptionLabel={(option) => option.title}
            getOptionValue={(option) => option._id}
            styles={colorStyles}
            value={newFeaturedProduct || oldFeaturedProduct}
            onChange={handleFeaturedProductSelect}
          />
          <button type="button" className="btn-primary mt-4" onClick={onSave}>
            Save
          </button>
        </>
      )}
    </Layout>
  );
};

export default Settings;
