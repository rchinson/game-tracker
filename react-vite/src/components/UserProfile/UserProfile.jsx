import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchUserReviews, thunkFetchUserGames } from "../../redux/session";
import "./UserProfile.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.session.reviews || []);
  const games = useSelector((state) => state.session.games || []);

    console.log("USER GAMES___",games)

  useEffect(() => {
    if (user) {
      dispatch(thunkFetchUserReviews(user.id));
      dispatch(thunkFetchUserGames(user.id));
    }
  }, [dispatch, user]);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="user-profile">
      {/* User Info */}
      <div className="user-info">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" />
          ) : (
            <div className="placeholder-avatar">No Avatar</div>
          )}
        </div>
        <div className="user-details">
          <h2>{user.username}</h2>
          <p>
            <strong>First Name:</strong> {user.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {user.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>About Me:</strong> {user.about_me || "No description yet."}
          </p>
        </div>
      </div>

      {/* User Reviews */}
      <div className="user-reviews">
        <h3>Your Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h4>{review.title}</h4>
              <p>
                <strong>Game:</strong> {review.game.title}
              </p>
              <p>{review.body}</p>
              <p>
                <strong>Rating:</strong> {review.starRating} / 5
              </p>
            </div>
          ))
        ) : (
          <p>You haven’t written any reviews yet.</p>
        )}
      </div>

      {/* User Game Collection */}
      <div className="user-games">
        <h3>Your Game Collection</h3>
        <div className="games-grid">

          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-image">
                  {game.image ? (
                    <img src={game.image} alt={game.title} />
                  ) : (
                    <div className="placeholder-game">No Image Available</div>
                  )}
                </div>
                <h4>{game.title}</h4>
                <p>
                  <strong>Genre:</strong> {game.genre}
                </p>
                <p>
                  <strong>Platform:</strong> {game.platform}
                </p>
                <p>
                  <strong>Price:</strong> ${game.price}
                </p>
              </div>
            ))
          ) : (
            <p>Your collection is empty.</p>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
