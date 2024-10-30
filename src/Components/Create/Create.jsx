import React, { Fragment, useContext, useState } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { AuthContext } from "../../store/userContext";
import { FirebaseContext } from "../../store/firebaseContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { auth, db, storage } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({
    product: "",
    category: "",
    price: "",
    image: "",
    commonErr: "",
  });

  const handleForm = async (e) => {
    e.preventDefault();

    let tempErrors = {
      product: "",
      category: "",
      price: "",
      image: "",
      commonErr: "",
    };

    if (!product.trim()) tempErrors.product = "Product name is required";
    if (!category.trim()) tempErrors.category = "Category is required";
    if (!price.trim()) tempErrors.price = "Price is required";
    if (!image) tempErrors.image = "Image is required";

    setErrors(tempErrors);

    const isValid = Object.values(tempErrors).every((error) => error === "");

    if (isValid && user) {
      try {
        const fileName = `products/${user.uid}/${Date.now()}-${image.name}`;
        const storageRef = ref(storage, fileName);

        const snapshot = await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "products"), {
          product,
          category,
          price,
          image: imageUrl,
          user: user.uid,
          createdAt: new Date().toDateString(),
        });

        navigate("/");
      } catch (error) {
        console.error("Error while uploading:", error);
        setErrors((prev) => ({
          ...prev,
          commonErr: "Error uploading: " + error.message,
        }));
      }
    } else if (!user) {
      setErrors((prev) => ({
        ...prev,
        commonErr: "You must be logged in to upload products",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <Fragment>
      <Header />
      <div>
        <div className="centerDiv">
          <form onSubmit={handleForm}>
            <label htmlFor="fname">Name</label>
            <br />
            <input
              className="input"
              type="text"
              id="fname"
              name="Name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            {errors.product ? (
              <>
                <br /> <span className="error">{errors.product}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <label htmlFor="category">Category</label>
            <br />
            <input
              className="input"
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {errors.category ? (
              <>
                <br /> <span className="error">{errors.category}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <label htmlFor="price">Price</label>
            <br />
            <input
              className="input"
              type="number"
              id="price"
              name="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price ? (
              <>
                <br /> <span className="error">{errors.price}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <label htmlFor="image">Image</label>
            <br />
            <input type="file" onChange={handleImageChange} />
            {errors.image ? (
              <>
                <br /> <span className="error">{errors.image}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <img
              alt="Posts"
              width="200px"
              height="200px"
              src={image ? URL.createObjectURL(image) : ""}
            />
            <br />
            <button type="submit" className="uploadBtn">
              Upload and Submit
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Create;
