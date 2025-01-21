import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { thunkAddGame } from "../../redux/games";
import "./GamesCreate.css";

const GamesCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [newGame, setNewGame] = useState({
    title: "",
    genre: "",
    platform: "",
    price: "",
    image: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkAddGame(newGame));
      setNewGame({
        title: "",
        genre: "",
        platform: "",
        price: "",
        image: "",
        description: "",
      });
      navigate("/"); 
    } catch (err) {
      setError("Failed to add game.");
    }
  };

  return (
    <form onSubmit={handleAddGame} className="add-game-form">
      <h3>Add Game</h3>
      {error && <p className="error-message">{error}</p>}
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
      <input
        type="text"
        placeholder="Description"
        value={newGame.description}
        onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
        required
      />
      <button type="submit">Add Game</button>
    </form>
  );
};

export default GamesCreate;
