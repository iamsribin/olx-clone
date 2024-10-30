import React, { useContext } from "react";
import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/userContext";
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSingOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          setUser(null);
          localStorage.removeItem("user");
          navigate("/login");
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }
    });
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div className="brandName">
          <OlxLogo></OlxLogo>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        <div className="language">
          <Link to={"/cart"}>CART</Link>
          {/* <span> CART </span> */}
          {/* <Arrow></Arrow> */}
        </div>
        <div className="loginPage">
          {user ? (
            <span onClick={handleSingOut} style={{ cursor: "pointer" }}>
              {user.displayName || "User"}
            </span>
          ) : (
            <Link to={"/login"}>Login</Link>
          )}{" "}
          <hr />
        </div>

        <div className="sellMenu">
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <Link to={"/sell"}>SELL</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
