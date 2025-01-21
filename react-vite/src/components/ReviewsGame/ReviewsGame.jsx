import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  thunkFetchReviews,
  thunkDeleteReview,
  thunkUpdateReview,
} from "../../redux/reviews";
import { thunkFetchGames } from "../../redux/games"; // To fetch game information
import "./ReviewsGame.css";

const ReviewsGame = () => {
  const { gameId } = useParams(); // Get game ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const currentUser = useSelector((state) => state.session.user); // Get current user from Redux
  const reviews = useSelector((state) => state.reviews); // Get reviews from Redux
  const games = useSelector((state) => state.games); // Get games from Redux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null); // Edit review state

  // Find the current game by its ID
  const currentGame = games.find((game) => game.id === parseInt(gameId, 10));

  // Filter reviews for the current game
  const currentGameReviews = reviews.filter(
    (review) => review.game_id === parseInt(gameId, 10)
  );

  // Check if the current user has already reviewed this game
  const hasReviewed = currentGameReviews.some(
    (review) => review.user_id === currentUser?.id
  );

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        await Promise.all([
          dispatch(thunkFetchGames()), // Fetch games if not already loaded
          dispatch(thunkFetchReviews(gameId)), // Fetch reviews for the current game
        ]);
      } catch (err) {
        setError("Failed to load reviews or game information.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [dispatch, gameId]);

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
      setEditData(null); // Clear edit data
    } catch (err) {
      setError("Failed to update the review.");
    }
  };

  const handleNavigateToNewReview = () => {
    if (!hasReviewed) {
      navigate(`/games/${gameId}/reviews/new`); // Navigate to the new review path
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="game-reviews">
      <h2>{`Reviews for ${currentGame?.title || "this game"}`}</h2>

      {/* Button to navigate to the Add New Review form */}
      {currentUser && !hasReviewed && (
        <button
          onClick={handleNavigateToNewReview}
          className="new-review-button"
        >
          Add New Review
        </button>
      )}

      {/* Show a message if the user has already reviewed the game */}
      {currentUser && hasReviewed && (
        <p className="review-notice">
          {/* You have already submitted a review for this game. */}
        </p>
      )}

      {currentGameReviews.length > 0 ? (
        <div className="reviews-list">
          {currentGameReviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.title}</h3>
              <p>{review.body}</p>
              <p>
                <strong>Rating:</strong> {review.starRating} / 5
              </p>
              {/* Show Edit/Delete buttons only for reviews owned by the logged-in user */}
              {currentUser && currentUser.id === review.user_id && (
                <div className="review-actions">
                  <button
                    onClick={() => setEditData(review)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>
          There are no reviews for {currentGame?.title || "this game"} yet.
        </p>
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
          <button type="submit" className="update-button">
            Update Review
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setEditData(null)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewsGame;
