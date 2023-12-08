import React from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const onLoginSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    //send login info to backend
    return api.post("/auth/login", data).then((response) => {
      // if login is successfull get the user
      api
        .get("/me")
        .then((user) => {
          //write the user to rtk store
          console.log(user);
        })
        .then(() => {
          //navigate to user home/dashboard
          navigate("/dashboard");
        });
    });
  };

  return (
    <form className="login-form" onSubmit={onLoginSubmit}>
      <h2>Login</h2>
      <div className="input-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div className="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Login</button>
      <a href="register.html">
        <button type="button">Register</button>
      </a>
    </form>
    
  );
}

export default Login;
