# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


...singup
import React, { useCallback, useContext, useState } from "react";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../store/firebaseContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const { auth, db } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    commonErr: "",
  });

  const handleForm = (e) => {
    e.preventDefault();

    let tempErrors = {
      userName: "",
      email: "",
      phone: "",
      password: "",
      commonErr: "",
    };

    if (!userName.trim()) {
      tempErrors.userName = "Username is required";
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!email.match(emailPattern)) {
      tempErrors.email = "Invalid email format";
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!phone.match(phonePattern)) {
      tempErrors.phone = "Phone number must be 10 digits";
    }

    if (!password.trim()) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);

    const isValid = Object.values(tempErrors).every((error) => error === "");
    if (isValid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: userName,
          })
            .then(async () => {
              const { uid, email, displayName } = auth.currentUser;
              try {
                await setDoc(doc(db, "users", uid), {
                  username: displayName,
                  phone: phone,
                  id: uid,
                });

                console.log(
                  "User successfully signed up and data saved in Firestore"
                );
                navigate("/login");
              } catch (error) {                
                tempErrors.commonErr =
                  "Failed to save user data to Firestore: " + error.message;
                setErrors(tempErrors);
              }
            })
            .catch((error) => {              
              tempErrors.commonErr = error.message;
              setErrors(tempErrors);
            });
        })
        .catch((error) => {
          const errorMessage = error.message;
          tempErrors.commonErr = errorMessage;
          setErrors(tempErrors);
        });
    }
  };

  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo} alt="logo" />
        {errors.commonErr && <span className="error">{errors.commonErr}</span>}

        <form onSubmit={handleForm}>
          <label htmlFor="userName">Username</label>
          <br />
          <input
            className="input"
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          {errors.userName && <span className="error">{errors.userName}</span>}
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {errors.email && <span className="error">{errors.email}</span>}
          <br />
          <label htmlFor="phone">Phone</label>
          <br />
          <input
            className="input"
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          {errors.phone && <span className="error">{errors.phone}</span>}
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {errors.password && <span className="error">{errors.password}</span>}
          <br />
          <button type="submit">Signup</button>
        </form>
        <Link to={"/login"}>Login</Link>
      </div>
    </div>
  );
}
////////////////////////////////////

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Rules for users collection
    match /users/{userId} {
      allow read: if request.auth != null; // Allow only authenticated users
    }

    // Rules for products collection
    match /products/{productId} {
      allow read: if request.auth != null; // Allow only authenticated users
    }
  }
}
