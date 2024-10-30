import React, { useContext, useState } from "react";
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

  const handleForm = async (e) => {
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
      try {
        // 1. Create the user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // 2. Update the profile
        await updateProfile(user, {
          displayName: userName,
        });

        // 3. Store in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: userName, 
          phone: phone,
          id: user.uid,
          email: email,
        });

        // 4. Update the local user state
        const updatedUser = auth.currentUser;
        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: email,
            displayName: userName,
            phone: phone,
          })
        );

        console.log("User successfully signed up and data saved");
        navigate("/");
      } catch (error) {
        console.error("Error during signup:", error);
        const tempErrors = {};
        tempErrors.commonErr = error.message;
        setErrors(tempErrors);
      }
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
