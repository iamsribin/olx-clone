import React, { useContext } from 'react';
import { CartContext } from '../../store/cartContext'; // Import CartContext
import './Cart.css'; // Import styles

function Cart() {
  const { likedProducts, removeLikedProduct, setLikedProducts } = useContext(CartContext);

  const clearAllProducts = () => {
    setLikedProducts([]);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Liked Products</h1>
      {likedProducts.length > 0 ? (
        <>
          {/* <button className="clear-button" onClick={clearAllProducts}>
            Clear All
          </button> */}
          <div className="cards">
            {likedProducts.map((product) => (
              <div key={product.id} className="card">
                <div className="image">
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
                <button className="delete-button" onClick={() => removeLikedProduct(product.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="empty-message">No liked products yet.</p>
      )}
    </div>
  );
}

export default Cart;
