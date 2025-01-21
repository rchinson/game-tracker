import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; 
import { thunkAddScreenshot } from "../../redux/screenshots";
import "./ScreenshotsCreate.css";

const ScreenshotsCreate = ({ onSuccess, onError }) => {
  const { gameId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    image_url: "",
    description: "",
    game_id: gameId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkAddScreenshot(formData));
      setFormData({ image_url: "", description: "", game_id: gameId });
      if (onSuccess) onSuccess();
      navigate(`/games/${gameId}/screenshots`);
    } catch (err) {
      if (onError) onError("Failed to add screenshot.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-screenshot-form">
      <h3>Add Screenshot</h3>
      <input
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={formData.image_url}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
      ></textarea>
      <button type="submit">Add Screenshot</button>
    </form>
  );
};

export default ScreenshotsCreate;
