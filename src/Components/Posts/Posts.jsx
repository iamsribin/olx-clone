import React, { useEffect, useContext, useState } from "react";
import Heart from "../../assets/Heart";
import "./Post.css";
import { FirebaseContext } from "../../store/firebaseContext";
import { AuthContext } from "../../store/userContext";
import { CartContext } from "../../store/cartContext"; 
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { PostContext } from "../../store/postContext";
import { useNavigate } from "react-router-dom";

function Posts() {
  const { db } = useContext(FirebaseContext); 
  const { user } = useContext(AuthContext); 
  const {postDetails, setPostDetails} = useContext(PostContext)
  const { likedProducts, addLikedProduct, removeLikedProduct } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const toggleLike = (product) => {
    setIsLiked(!isLiked); 
    if (!isLiked) {
      addLikedProduct(product); 
    } else {
      removeLikedProduct(product.id); 
    }
  };

  const handleProductClick = (product) => {
    setPostDetails(product);
    navigate('/view'); 
  };

  useEffect(() => {    
    if (user) {
      const fetchProducts = async () => {
        try {
          const q = query(
            collection(db, "products")
           
          );

          const querySnapshot = await getDocs(q);

          const allProducts = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log("all products:", allProducts);

         let newData = allProducts.reverse()

          setProducts(newData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts(); 
    }
  }, [user, db]);

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map((product) => (
            <div key={product.id} className="card"  >
              <div onClick={() => toggleLike(product)} className="favorite">
                <Heart filled={likedProducts.some((item) => item.id === product.id)} />
              </div>
              <div className="image" onClick={()=> handleProductClick(product)}>
                <img src={product.image} alt={product.product} />
              </div>
              <div className="content">
                <p className="rate">&#x20B9; {product.price}</p>
                <span className="kilometer">{product.category}</span>
                <p className="name">{product.product}</p>
              </div>
              <div className="date">
                <span>{product.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Posts;
