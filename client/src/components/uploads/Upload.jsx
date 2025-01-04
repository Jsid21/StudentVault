import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./upload.css";

export const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-client-id": import.meta.env.VITE_CLIENT_ID, // Replace with actual client ID
          },
          withCredentials: true,
        }
      );
      // console.log("Post uploaded successfully:", response.data);
      alert("Post added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error uploading post:", error.response.data.message);
      alert("Error uploading post try again");
    }
  };

  return (
    <div className="container-md" style={{ color: "black" }}>
      <div className="header">
        <div className="text">Create New Post</div>
        <div className="underline"></div>
      </div>
      <form className="needs-validation my-4 mx-2" onSubmit={handleSubmit}>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          name="title"
          id="title"
          className="form-control"
          type="text"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            name="description"
            className="form-control"
            id="description"
            rows="3"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <br />
        <label htmlFor="file" className="form-label">
          Upload File (Image/PDF) (Optional)
        </label>
        <input
          name="file"
          className="form-control"
          type="file"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit" className="btn btn-primary submit_btn_1">
          Add
        </button>
      </form>
    </div>
  );
};
