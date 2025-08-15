import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const firebaseConfig = {
  apiKey: "AIzaSyDLvFK26HSYkTo9hBpZuW9APyldKKNKZMk",
  authDomain: "arya-2e021.firebaseapp.com",
  projectId: "arya-2e021",
  storageBucket: "arya-2e021.firebasestorage.app",
  messagingSenderId: "689574153265",
  appId: "1:689574153265:web:34be05b32321a019681910",
  measurementId: "G-5E8C8SSCPV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function SignUp() {
  const provider = new GoogleAuthProvider();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const payload = {
          username: user.displayName,
          email: user.email,
          google: true
        };
        return axios.post("https://arya-server.onrender.com/api/auth", payload);
      })
      .then((response) => {
        localStorage.setItem("user", (response.data.userId));
        localStorage.setItem("name", response.data.username);
        localStorage.setItem("cartItems", response.data.cartItems ? JSON.stringify(response.data.cartItems) : "[]");

        if (["shivavarma336@gmail.com","aryarestaurant6@gmail.com","mohanavamsi14@gmail.com", "jatinjayadev@gmail.com"].includes(response.data.email)){
          localStorage.setItem("admin", "yes");
        }
        else{
          localStorage.setItem("admin","No")
        }

        nav("/");
      })
      .catch((error) => {
        console.error("Google auth error:", error);
        alert("Google sign-in failed. Try again.", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <button
      onClick={handleGoogleSignIn}
      style={{
        color: "rgb(239, 231, 210)",
        backgroundColor: "transparent",
        padding: isMobile ? "16px" : "14px",
        borderRadius: "8px",
        border: "1px solid #444",
        fontSize: isMobile ? "14px" : "12px",
        cursor: "pointer",
        width: "100%",
        textTransform: "uppercase",
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        fontWeight: "500"
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: "8px" }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}

export default SignUp;
