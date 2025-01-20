import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  thunkFetchGames,
  thunkAddGame,
  thunkUpdateGame,
  thunkDeleteGame,
} from "../../redux/games";
import "./Games.css";

const Games = () => {
  const dispatch = useDispatch();
  const games = useSelector((state) => state.games);
  const currentUser = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newGame, setNewGame] = useState({
    title: "",
    genre: "",
    platform: "",
    price: "",
    image: "",
  });

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(thunkFetchGames());
      } catch (err) {
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkAddGame(newGame));
      setNewGame({ title: "", genre: "", platform: "", price: "", image: "" });
    } catch (err) {
      setError("Failed to add game.");
    }
  };

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

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="games">
      <h2>Games</h2>
      {games.length > 0 ? (
        <div className="games-list">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <img
                src={game.image}
                alt={game.title || "Game"}
                className="game-image"
              />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p>{game.platform}</p>
              <p>${game.price}</p>

              {/* Show Edit/Delete only if the current user is the creator */}
              {currentUser && currentUser.id === game.creator_id && (
                <div className="game-actions">
                  <button onClick={() => setEditData(game)}>Edit</button>
                  <button onClick={() => handleDeleteGame(game.id)}>
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

      {/* Add Game Form */}
      <form onSubmit={handleAddGame} className="add-game-form">
        <h3>Add Game</h3>
        <input
          type="text"
          placeholder="Title"
          value={newGame.title}
          onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={newGame.genre}
          onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Platform"
          value={newGame.platform}
          onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newGame.price}
          onChange={(e) =>
            setNewGame({ ...newGame, price: parseFloat(e.target.value) })
          }
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newGame.image}
          onChange={(e) => setNewGame({ ...newGame, image: e.target.value })}
          required
        />
        <button type="submit">Add Game</button>
      </form>

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
