import React, { useState } from "react";
import "./Signup.scss";
import { Link } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "user created",
        })
      );
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
    <div className="signup">
      <div className="signup-box">
        <h1 className="heading">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="name"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

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

          <input type="submit" className="submit" />
        </form>
        <p className="sub-heading">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
