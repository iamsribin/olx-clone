import React, { useContext, useState } from 'react';
import Logo from '../../olx-logo.png';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../../store/firebaseContext';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(FirebaseContext);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    commonErr: "",
  });

  const handleForm = (e) => {
    e.preventDefault();

    let tempErrors = {
      email: "",
      password: "",
      commonErr: "",
    };

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!email.trim()) {
      tempErrors.email = "Email is required";
      
    } else if (!email.match(emailPattern)) {
      tempErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);

    const isValid = Object.values(tempErrors).every((error) => error === "");

    if (isValid) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         userCredential.user;
         navigate("/")
         console.log("login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        tempErrors.commonErr = errorMessage;
        setErrors(tempErrors);
      });
    }
  };

  return (
    <div>
      <div className="loginParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        {errors.commonErr && <span className="error">{errors.commonErr}</span>}
        <form onSubmit={handleForm}>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        {errors.email ? <span className="error">{errors.email}</span>: <br/>}
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="lname"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? <span className="error">{errors.password}</span>: <br/>}
          <br />
          <button>Login</button>
        </form>
        <Link to={"/signUp"}>Signup</Link>
      </div>
    </div>
  );
}

export default Login;
