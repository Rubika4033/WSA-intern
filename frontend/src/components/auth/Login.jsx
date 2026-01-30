import React, { useState } from 'react';
import Input from '../common/input';
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import { closeAuthModal } from "../../redux/slices/uiSlice";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state

  return (
    <div className="login-wrapper">
      <h3 className="login-title">Welcome Back</h3>
      <p className="login-subtitle">Please enter your details to login</p>
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        label="Email Address"
        placeholder="andrew@email.com"
        type="email"
      />
      <Input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        label="Password"
        // Merged placeholder from both snippets for better user experience
        placeholder="Min 8 characters"
        type="password"
      />

      <button
        type="submit"
        className="login-submit-btn"
        disabled={isLoading}
      >
        <span>{isLoading ? "Logging in..." : "Login"}</span>
      </button>
    </div>
  );
};

export default Login;
