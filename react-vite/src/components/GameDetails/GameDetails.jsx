import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchGames } from "../../redux/games";
import { useParams } from "react-router-dom";
import "./GameDetails.css";

const GameDetails = () => {
  const { gameId } = useParams(); // Get the gameId from the URL
  const dispatch = useDispatch();
  const games = useSelector((state) => state.games); // Get all games from Redux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const game = games.find((g) => g.id === parseInt(gameId, 10)); // Find the specific game

  useEffect(() => {
    const fetchGames = async () => {
      try {
        await dispatch(thunkFetchGames());
      } catch (err) {
        setError("Failed to load the game details.");
      } finally {
        setLoading(false);
      }
    };

    if (!games.length) {
      fetchGames();
    } else {
      setLoading(false);
    }
  }, [dispatch, games]);

  if (loading) {
    return <div>Loading game details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!game) {
    return <div>Game not found.</div>;
  }

  return (
    <div className="game-details">
      <h2>{game.title}</h2>
      <div className="game-details-container">
        <img
          src={game.image}
          alt={game.title}
          className="game-details-image"
        />
        <div className="game-details-info">
          <p>
            <strong>Genre:</strong> {game.genre}
          </p>
          <p>
            <strong>Platform:</strong> {game.platform}
          </p>
          <p>
            <strong>Price:</strong> ${game.price}
          </p>
          <p>
            <strong>Description:</strong> {game.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
