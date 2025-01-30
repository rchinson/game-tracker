import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; 
import { thunkAddReview } from "../../redux/reviews";
import "./ReviewsCreate.css";

const ReviewsCreate = () => {
  const { gameId } = useParams
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [newReview, setNewReview] = useState({
    title: "",
    body: "",
    starRating: "",
    game_id: gameId,
  });
  const [error, setError] = useState("");

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkAddReview(newReview));
      setNewReview({ title: "", body: "", starRating: "", game_id: gameId });
      navigate(`/games/${gameId}/reviews`);
    } catch (err) {
      setError("Failed to add review.");
    }
  };

  return (
    <form onSubmit={handleAddReview} className="add-review-form">
      <h3>Add Review</h3>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={newReview.title}
        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Review Body"
        value={newReview.body}
        onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
        required
      ></textarea>
      <input
        type="number"
        placeholder="Star Rating"
        value={newReview.starRating}
        onChange={(e) =>
          setNewReview({ ...newReview, starRating: Number(e.target.value) })
        }
        min="1"
        max="5"
        required
      />
      <button type="submit">Add Review</button>
    </form>
  );
};

export default ReviewsCreate;
