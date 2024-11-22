// Home.js
import supabase from "./config/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Fetch the user from the `user_` table with the provided email
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      setLoginError("Failed to fetch user data.");
      return;
    }

    // Check if the password matches
    if (data && data.password === password) {
      // Save first_name to localStorage
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("last_name", data.last_name);
      localStorage.setItem("id", data.id);
      setLoginError(null);
      navigate("/dashboard");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  return (
    <div className="page home">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      </div>
    </div>
  );
};

export default Home;
