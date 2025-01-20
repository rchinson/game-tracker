import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  thunkFetchGames,
  thunkUpdateGame,
  thunkDeleteGame,
} from "../../redux/games";
import {
  thunkFetchUserGamesLibrary,
  thunkAddGameToLibrary,
} from "../../redux/usergames"; // Import userGames thunks
import "./Games.css";

const Games = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const games = useSelector((state) => state.games);
  const currentUser = useSelector((state) => state.session.user);
  const userLibrary = useSelector((state) => state.userGames || []); // User's library
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(thunkFetchGames());
        if (currentUser) {
          await dispatch(thunkFetchUserGamesLibrary(currentUser.id)); // Fetch user's library
        }
      } catch (err) {
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentUser]);

  const handleEditGame = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkUpdateGame(editData.id, editData));
      setEditData(null);
    } catch (err) {
      setError("Failed to update game.");
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await dispatch(thunkDeleteGame(gameId));
    } catch (err) {
      setError("Failed to delete game.");
    }
  };

  const handleAddToLibrary = async (gameId) => {
    alert("Feature Coming Soon.");
  };

  const handleNavigateToNewGame = () => {
    if (!currentUser) {
      alert("You must be logged in to add a new game.");
      return;
    }
    navigate("/games/new");
  };

  const isGameInLibrary = (gameId) => {
    return userLibrary.some((game) => game.id === gameId); // Check if the game is in the user's library
  };

  const handleNavigateToGameDetails = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="games">
      <h2>Games</h2>

      {/* Conditionally render the Add New Game button */}
      {currentUser ? (
        <button onClick={handleNavigateToNewGame} className="new-game-button">
          Add New Game
        </button>
      ) : (
        <p className="login-message">Log in to add new games.</p>
      )}

      {games.length > 0 ? (
        <div className="games-list">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => handleNavigateToGameDetails(game.id)} // Redirect to game details
              style={{ cursor: "pointer" }} // Add pointer cursor for clarity
            >
              <img
                src={game.image}
                alt={game.title || "Game"}
                className="game-image"
              />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p>{game.platform}</p>
              <p>${game.price}</p>

              {/* Show Add to Library only if the game is not in the user's library */}
              {currentUser && !isGameInLibrary(game.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking the button
                    handleAddToLibrary(game.id);
                  }}
                  className="add-to-library-button"
                >
                  Add to Library
                </button>
              )}

              {/* Show Edit/Delete only if the current user is the creator */}
              {currentUser && currentUser.id === game.creator_id && (
                <div className="game-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking the button
                      setEditData(game);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking the button
                      handleDeleteGame(game.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No games available.</p>
      )}

      {/* Edit Game Form */}
      {editData && (
        <form onSubmit={handleEditGame} className="edit-game-form">
          <h3>Edit Game</h3>
          <input
            type="text"
            placeholder="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={editData.genre}
            onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Platform"
            value={editData.platform}
            onChange={(e) =>
              setEditData({ ...editData, platform: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: parseFloat(e.target.value) })
            }
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={editData.image}
            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
            required
          />
          <button type="submit">Update Game</button>
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

export default Games;
