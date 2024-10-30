import React, { Suspense, useContext, useEffect } from "react";
import "./App.css";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/Signup";
// import Cart from "./Pages/Cart";
import View from "./Pages/ViewPost";
import { AuthContext } from "./store/userContext";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const LazyComponent = React.lazy(() => import("./Pages/Cart"));

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("protected::", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("public", user);

  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      if (userData) {
        setUser(userData);
        console.log("user:::", userData);
      } else {
        setUser(null);
        console.log("no user data found");
      }
    });

    return () => unsubscribe();
  });

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/sell",
      element: (
        <ProtectedRoute>
          <Create />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/view",
      element: (
        <ProtectedRoute>
          <View />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </Suspense>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
