import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js";

export default function Home() {
  const { currentUser, userLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div style={{ color: "white" }}>
      Home
      {userLoggedIn ? (
        <h1>Welcome {currentUser.email}</h1>
      ) : (
        <h1>Please login</h1>
      )}
      <Link to="/login">
        <button onClick={() => {}}>Sign in</button>
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
