import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkAuthenticate } from "../../redux/session"; // Thunk to refresh current user
import "./UserProfileEdit.css";

const UserProfileEdit = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || "",
    last_name: currentUser?.last_name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    about_me: currentUser?.about_me || "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await dispatch(thunkAuthenticate()); // Refresh the current user in Redux store
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred while updating your profile.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  if (!currentUser) {
    return <div>Please log in to edit your profile.</div>;
  }

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleFormSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar URL</label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="about_me">About Me</label>
          <textarea
            id="about_me"
            name="about_me"
            value={formData.about_me}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
