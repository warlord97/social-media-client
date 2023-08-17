import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../../App";
import { useDispatch } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      navigate("/");
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error,
        })
      );
    }
  }

  return (
    <div className="login">
      <div className="login-box">
        <h1 className="heading">Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <input type="submit" onClick={handleSubmit} className="submit" />
        </form>
        <p className="sub-heading">
          Do not have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
