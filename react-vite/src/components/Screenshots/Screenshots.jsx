import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  thunkFetchScreenshots,
  thunkUpdateScreenshot,
  thunkDeleteScreenshot,
} from "../../redux/screenshots";
import { thunkFetchUserGamesLibrary } from "../../redux/usergames"; // Import user library thunk
import "./Screenshots.css";

const Screenshots = () => {
  const { gameId } = useParams(); // Get game ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const screenshots = useSelector((state) => state.screenshots);
  const currentUser = useSelector((state) => state.session.user); // Get the logged-in user
  const userLibrary = useSelector((state) => state.userGames || []); // User's library
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  let currScreenshots = [];

  screenshots.forEach((element) => {
    if (element.game_id == gameId) {
      currScreenshots.push(element);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(thunkFetchScreenshots(gameId)); // Fetch screenshots for the game
        if (currentUser) {
          await dispatch(thunkFetchUserGamesLibrary(currentUser.id)); // Fetch user's library
        }
      } catch (err) {
        setError("Failed to load screenshots or library data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, gameId, currentUser]);

  const handleEditScreenshot = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkUpdateScreenshot(editData.id, editData));
      setEditData(null);
    } catch (err) {
      setError("Failed to update screenshot.");
    }
  };

  const handleDeleteScreenshot = async (screenshotId) => {
    try {
      await dispatch(thunkDeleteScreenshot(screenshotId));
    } catch (err) {
      setError("Failed to delete screenshot.");
    }
  };

  const handleNavigateToNewScreenshot = () => {
    if (!isGameInLibrary(gameId)) {
      alert("You must own this game in your library to add screenshots.");
      return;
    }
    navigate(`/games/${gameId}/screenshots/new`); // Navigate to the new screenshot path
  };

  const isGameInLibrary = (gameId) => {
    return userLibrary.some((game) => game.id === parseInt(gameId, 10)); // Check if the game is in the user's library
  };

  if (loading) return <div>Loading screenshots...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="game-screenshots">
      <h2>Game Screenshots</h2>

      {/* Button to navigate to add new screenshot */}
      {currentUser && (
        <button
          onClick={handleNavigateToNewScreenshot}
          className="new-screenshot-button"
        >
          Add New Screenshot
        </button>
      )}

      {currScreenshots.length > 0 ? (
        <div className="screenshots-grid">
          {currScreenshots.map((screenshot) => (
            <div key={screenshot.id} className="screenshot-card">
              <img
                src={screenshot.image_url}
                alt={screenshot.description || "Screenshot"}
                className="screenshot-image"
              />
              <p>{screenshot.description}</p>

              {/* Allow Edit/Delete only if the current user owns the screenshot */}
              {currentUser && currentUser.id === screenshot.user_id && (
                <div className="screenshot-actions">
                  <button onClick={() => setEditData(screenshot)}>Edit</button>
                  <button
                    onClick={() => handleDeleteScreenshot(screenshot.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No screenshots available for this game.</p>
      )}

      {/* Edit Screenshot Form */}
      {editData && (
        <form onSubmit={handleEditScreenshot} className="edit-screenshot-form">
          <h3>Edit Screenshot</h3>
          <input
            type="text"
            placeholder="Image URL"
            value={editData.image_url}
            onChange={(e) =>
              setEditData({ ...editData, image_url: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          ></textarea>
          <button type="submit">Update Screenshot</button>
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

export default Screenshots;
