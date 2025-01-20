import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  thunkFetchReviews,
  thunkAddReview,
  thunkUpdateReview,
  thunkDeleteReview,
} from "../../redux/reviews";
import { useParams } from "react-router-dom";
import "./Reviews.css";

const Reviews = () => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews);
  const currentUser = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({
    title: "",
    body: "",
    starRating: 1,
    game_id: gameId,
  });

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(thunkFetchReviews(gameId));
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, gameId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkAddReview(newReview));
      setNewReview({ title: "", body: "", starRating: 1, game_id: gameId });
    } catch (err) {
      setError("Failed to add review.");
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkUpdateReview(editData.id, editData));
      setEditData(null);
    } catch (err) {
      setError("Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(thunkDeleteReview(reviewId));
    } catch (err) {
      setError("Failed to delete review.");
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="reviews">
      <h2>Game Reviews</h2>
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.title}</h3>
              <p>{review.body}</p>
              <p>Rating: {review.starRating} / 5</p>
              {/* Show Edit/Delete only if the user owns the review */}
              {currentUser && currentUser.id === review.user_id && (
                <div className="review-actions">
                  <button onClick={() => setEditData(review)}>Edit</button>
                  <button onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available for this game.</p>
      )}

      {/* Add Review Form */}
      <form onSubmit={handleAddReview} className="add-review-form">
        <h3>Add Review</h3>
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

      {/* Edit Review Form */}
      {editData && (
        <form onSubmit={handleEditReview} className="edit-review-form">
          <h3>Edit Review</h3>
          <input
            type="text"
            placeholder="Title"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Review Body"
            value={editData.body}
            onChange={(e) =>
              setEditData({ ...editData, body: e.target.value })
            }
            required
          ></textarea>
          <input
            type="number"
            placeholder="Star Rating"
            value={editData.starRating}
            onChange={(e) =>
              setEditData({ ...editData, starRating: Number(e.target.value) })
            }
            min="1"
            max="5"
            required
          />
          <button type="submit">Update Review</button>
          <button type="button" onClick={() => setEditData(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Reviews;
