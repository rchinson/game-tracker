import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchReviews, thunkDeleteReview } from "../../redux/reviews";
import "./ReviewsUser.css";

const ReviewsUser = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user); // Get current user from Redux
  const reviews = useSelector((state) => state.reviews); // Get reviews from Redux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (currentUser) {
        try {
          await dispatch(thunkFetchReviews(currentUser.id)); // Fetch reviews for the current user
        } catch (err) {
          setError("Failed to load your reviews.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserReviews();
  }, [dispatch, currentUser]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(thunkDeleteReview(reviewId)); // Delete the review
    } catch (err) {
      setError("Failed to delete the review.");
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
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.title}</h3>
              <p>{review.body}</p>
              <p>
                <strong>Rating:</strong> {review.starRating} / 5
              </p>
              <p>
                <strong>Game ID:</strong> {review.game_id}
              </p>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not submitted any reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewsUser;
