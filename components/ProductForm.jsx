import axios from "axios";
import { BsTrash, BsUpload } from "react-icons/bs";
import { LuInfo } from "react-icons/lu";
import { FadeLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

const ProductForm = ({
  _id,
  title,
  description,
  images,
  categories,
  price,
}) => {
  const [formTitle, setFormTitle] = useState(title || "");
  const [formDescription, setFormDescription] = useState(description || "");
  const [formImages, setFormImages] = useState(images || []);
  const [formCategories, setFormCategories] = useState(categories || []);
  const [formPrice, setFormPrice] = useState(price || "");

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [showTitleRequired, setShowTitleRequired] = useState(false);
  const [showDescriptionRequired, setShowDescriptionRequired] = useState(false);
  const [showPriceRequired, setShowPriceRequired] = useState(false);

  const [allCategories, setAllCategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await axios.get("/api/categories");
      setAllCategories(res.data);
    };
    fetchAllCategories();
  }, []);

  const validateForm = () => {
    let isValid = true;

    // If formTitle is blank, show the required message for title, otherwise hide it
    if (!formTitle.trim()) {
      setShowTitleRequired(true);
      isValid = false;
    } else {
      setShowTitleRequired(false);
    }

    // If formDescription is blank, show the required message for description, otherwise hide it
    if (!formDescription.trim()) {
      setShowDescriptionRequired(true);
      isValid = false;
    } else {
      setShowDescriptionRequired(false);
    }

    // If formPrice is blank, show the required message for price, otherwise hide it
    // Converting formPrice to a string explicitly before calling trim():
    // - when creating a product, formPrice is a string type so trim works fine and when posting
    //   to the server, it is converted to a number type so no explicit conversion needed for
    //   that,
    // - but when updating a product, formPrice is a number type (becuase thats how its received
    //   from api) and calling trim() on a number type throws an error, so we convert it to a
    //   string explicitly.
    // Reason for not converting formPrice to a number while its stored in the state:
    // - in the case that price is left blank, converting to a number type will convert it to 0,
    //   so in validation we will not be able to distinguish between a blank price and a price of
    //   0, so we convert it to a number type only when we are posting to the server
    if (!String(formPrice).trim()) {
      setShowPriceRequired(true);
      isValid = false;
    } else {
      setShowPriceRequired(false);
    }

    return isValid;
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const product = {
      title: formTitle,
      description: formDescription,
      images: formImages,
      categories: formCategories,
      // Converting formPrice to a number type explicitly before posting to the server:
      // - when creating a product, formPrice is a string type so explicit conversion needed
      //   as db price field is a number type, this should always produce a valid number (not NaN)
      //   as the formatPrice function will always return a valid number (not NaN)
      // - in the case where client side is manipulated to prevent validation for example, the
      //   server side validation will catch it and prevent the product from being created.
      price: Number(formPrice),
    };

    if (_id) {
      updateExistingProduct(product);
    } else {
      createNewProduct(product);
    }
    setGoToProducts(true);
  };

  const updateExistingProduct = async (product) => {
    try {
      await axios.put(`/api/products`, { _id, ...product });
    } catch (error) {
      console.error(error);
    }
  };

  const createNewProduct = async (product) => {
    try {
      await axios.post("/api/products", product);
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////
  ///////Images/////////
  //////////////////////

  const uploadImages = async (e) => {
    const files = e.target?.files;
    if (files) {
      setIsUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await axios.post("/api/images/uploadImages", formData);
      const updatedImages = res.data.links;
      setFormImages((old) => {
        return [...old, ...updatedImages];
      });
      setIsUploading(false);
    }
  };

  const updateImageOrder = (newOrder) => {
    setFormImages(newOrder);
  };

  const handleDeleteImage = async (fileName, imgLink) => {
    try {
      await axios.delete(`/api/images/${fileName}`);
    } catch (error) {
      console.error(error);
      return;
    }

    setFormImages((old) => {
      return old.filter((img) => img !== imgLink);
    });
  };

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

  const handleCategoryChange = (categories) => {
    setFormCategories(categories);
  };

  ///////////////////////
  /////////Price////////
  //////////////////////

  const formatPrice = (amount) => {
    let value = amount.replace(/[^0-9.]/g, "");
    if (value.includes(".")) {
      let [whole, decimal] = value.split(".");
      if (decimal.length > 2) {
        decimal = decimal.substring(0, 2);
      }
      value = whole + "." + decimal;
    }
    return value;
  };

  ///////////////////////
  //KEY DOWN HANDLERS///
  //////////////////////

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter" && e.target.type !== "textarea") {
      e.preventDefault();
    }
  };

  const handleCategoriesKeyDown = (e) => {
    // Prevent backspace from deleting a selected option when the input is empty
    if (e.key === "Backspace" && !e.target.value) {
      e.preventDefault();
    }
  };

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={onFormSubmit} onKeyDown={handleFormKeyDown}>
      {/* PRODUCT NAME */}
      <label
        htmlFor="productName"
        className={showTitleRequired ? "required" : ""}
      >
        Product Name
      </label>

      <input
        type="text"
        id="productName"
        className="my-input"
        placeholder="Product name"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />

      {/* PRODUCT DESCRIPTION */}
      <label
        htmlFor="productDescription"
        className={showDescriptionRequired ? "required" : ""}
      >
        Description
      </label>
      <textarea
        id="productDescription"
        className="my-textarea h-40 "
        placeholder="Description"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
      ></textarea>

      {/* PRODUCT IMAGES */}
      <label className="flex items-center">
        Photos
        <LuInfo className="inline-block ml-1" data-tooltip-id="photosTooltip" />
      </label>
      <Tooltip id="photosTooltip" place="right" effect="solid" className="z-[1000000]">
        <div>
          <strong>Photo Actions:</strong>
          <ul>
            <li>Click: Open image in a new tab</li>
            <li>Click and drag: Reorder images</li>
            <li>Click trash icon: Delete image</li>
          </ul>
        </div>
      </Tooltip>
      <div className="mb-2 flex flex-wrap">
        <ReactSortable
          list={formImages}
          setList={updateImageOrder}
          className="mb-2 flex flex-wrap"
        >
          {formImages &&
            formImages.map((imgLink) => {
              const fileName = imgLink.split("/").pop(); // Extract fileName from URL
              return (
                <div
                  key={imgLink}
                  className="relative mb-2 mr-2 h-24 w-24 rounded-md border border-gray-300 object-cover shadow-xl"
                >
                  <img
                    src={imgLink}
                    className="cursor-grab rounded-md object-cover"
                    onClick={() => window.open(imgLink, "_blank")}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(fileName, imgLink)}
                    className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-500 bg-opacity-50 text-xs text-white hover:bg-gray-700"
                  >
                    <BsTrash />
                  </button>
                </div>
              );
            })}
        </ReactSortable>
        {isUploading && (
          <div className="flex h-24 w-24 items-center justify-center rounded-md border">
            <FadeLoader color={"##0ea5e9"} />
          </div>
        )}
        <div className="mb-2">
          <label
            type="button"
            className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-500 text-sky-500 shadow-lg hover:bg-gray-300"
          >
            <BsUpload className="h-10 w-10" />
            Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => uploadImages(e)}
            />
          </label>
        </div>
      </div>

      {/* PRODUCT CATEGORIES */}
      <label htmlFor="">Category</label>
      <Select
        options={allCategories}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option._id}
        isMulti
        styles={colorStyles}
        value={formCategories}
        onChange={handleCategoryChange}
        onKeyDown={handleCategoriesKeyDown}
      />

      {/* PRODUCT PRICE */}
      <label
        htmlFor="productPrice"
        className={showPriceRequired ? "required" : ""}
      >
        Price (GBP £)
      </label>
      <input
        id="productPrice"
        className="my-input"
        type="text"
        placeholder="0.00"
        value={formPrice}
        onChange={(e) => setFormPrice(formatPrice(e.target.value))}
      />
      <button type="submit" className="btn-primary mr-4">
        Save
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => router.push("/products")}
      >
        Go Back
      </button>
    </form>
  );
};

export default ProductForm;
