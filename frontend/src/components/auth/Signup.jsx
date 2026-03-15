import React, { useState } from "react";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal } from "../../redux/slices/uiSlice";
import {
  clearError,
  setError,
  setLoading,
  setUser,
  switchAuthMode,
} from "../../redux/slices/authSlice";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import "../../css/auth/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!fullName || !email || !password) {
      dispatch(setError("Please fill all fields"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const payload = { name: fullName, email, password };
      if (base64Image) payload.avatar = base64Image;

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        payload
      );

      const data = res.data;
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Signup Successful");
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error;
      dispatch(setError(serverMessage || "Signup Failed. Please Try again"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an Account</h3>
      <p className="signup-subtitle">
        Join us today by entering your details
      </p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="profile-image-container">
          {previewImage ? (
            <img
              src={previewImage}
              alt="avatar preview"
              className="profile-preview"
            />
          ) : (
            <div className="profile-placeholder">
              <CiUser size={40} />
            </div>
          )}
          <label className="image-upload-icon">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your Email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="forgot-link"
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("login"));
          }}
        >
          Already have an account?
        </span>

        {error && <div className="signup-error">{error}</div>}

        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Signing Up..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
