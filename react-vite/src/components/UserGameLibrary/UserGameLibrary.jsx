import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  thunkFetchUserGamesLibrary,
  // thunkRemoveGameFromLibrary,
} from "../../redux/usergames";
import "./UserGameLibrary.css";

const UserGameLibrary = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const userGames = useSelector((state) => state.userGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchUserGames = async () => {
        try {
          await dispatch(thunkFetchUserGamesLibrary(currentUser.id));
        } catch (err) {
          setError("Failed to load your game library.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserGames();
    }
  }, [dispatch, currentUser]);

  const handleRemoveFromLibrary = async () => {

    // adjusted until functionality is corrected
    alert("Feature coming soon.");



    // try {
    //   await dispatch(thunkRemoveGameFromLibrary(gameId));
    //   alert("Game removed from your library.");
    // } catch (err) {
    //   alert(err.message);
    // }
  };

  if (!currentUser) {
    return <div>Please log in to view your game library.</div>;
  }

  if (loading) {
    return <div>Loading your game library...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-game-library">
      <h2>{`${currentUser.username}'s Game Library`}</h2>
      {userGames.length > 0 ? (
        <div className="games-grid">
          {userGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.image} alt={game.title} className="game-image" />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p>{game.platform}</p>
              <p>${game.price}</p>
              <button
                onClick={() => handleRemoveFromLibrary(game.id)}
                className="remove-from-library-button"
              >
                Remove from Library
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no games in your library.</p>
      )}
    </div>
  );
};

export default UserGameLibrary;
