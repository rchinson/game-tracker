import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchReviews, thunkDeleteReview, thunkUpdateReview } from "../../redux/reviews";
import { thunkFetchGames } from "../../redux/games"; // Import game fetch thunk
import "./ReviewsUser.css";
import { useParams } from "react-router-dom";

const ReviewsUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user); // Get current user from Redux
  const reviews = useSelector((state) => state.reviews); // Get reviews from Redux
  const games = useSelector((state) => state.games); // Get games from Redux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null); // State for editing a review

  // Filter reviews for the current user
  const currReviews = reviews.filter((review) => review.user_id == userId);

  useEffect(() => {
    const fetchUserReviewsAndGames = async () => {
      if (currentUser) {
        try {
          await Promise.all([
            dispatch(thunkFetchReviews(currentUser.id)), // Fetch reviews for the current user
            dispatch(thunkFetchGames()), // Fetch all games
          ]);
        } catch (err) {
          setError("Failed to load your reviews or games.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserReviewsAndGames();
  }, [dispatch, currentUser]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(thunkDeleteReview(reviewId)); // Delete the review
    } catch (err) {
      setError("Failed to delete the review.");
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkUpdateReview(editData.id, editData)); // Update the review
      setEditData(null); // Clear edit form
    } catch (err) {
      setError("Failed to update the review.");
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your reviews.</div>;
  }

  if (loading) {
    return <div>Loading your reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-reviews">
      <h2>{`${currentUser.first_name}'s Reviews`}</h2>
      {currReviews.length > 0 ? (
        <div className="reviews-list">
          {currReviews.map((review) => {
            const game = games.find((game) => game.id === review.game_id); // Find the game by ID
            return (
              <div key={review.id} className="review-card">
                <h3>{review.title}</h3>
                <p>{review.body}</p>
                <p>
                  <strong>Rating:</strong> {review.starRating} / 5
                </p>
                <p>
                  <strong>Game:</strong> {game?.title || "Unknown Game"}
                </p>
                <div className="review-actions">
                  <button
                    onClick={() => setEditData(review)} // Set review for editing
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)} // Delete the review
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have not submitted any reviews yet.</p>
      )}

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
          <div className="form-actions">
            <button type="submit" className="update-button">
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditData(null)} // Cancel editing
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewsUser;
