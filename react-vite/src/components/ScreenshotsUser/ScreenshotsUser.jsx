import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import {
  thunkFetchScreenshots,
  thunkUpdateScreenshot,
  thunkDeleteScreenshot,
} from "../../redux/screenshots";
import "./ScreenshotsUser.css";

const ScreenshotsUser = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const screenshots = useSelector((state) => state.screenshots);
  const currentUser = useSelector((state) => state.session.user); // Get the logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  // Filter screenshots for the current user
  const userScreenshots = screenshots.filter(
    (screenshot) => screenshot.user_id === currentUser?.id
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(thunkFetchScreenshots()); // Fetch all screenshots
      } catch (err) {
        setError("Failed to load screenshots.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

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

  // const handleNavigateToNewScreenshot = () => {
  //   navigate(`/screenshots/new`); // Navigate to the new screenshot path
  // };

  if (!currentUser) {
    return <div>Please log in to view your screenshots.</div>;
  }

  if (loading) return <div>Loading screenshots...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-screenshots">
      <h2>{`${currentUser.first_name}'s Screenshots`}</h2>

      {/* Button to navigate to add new screenshot */}
      {/* <button
        onClick={handleNavigateToNewScreenshot}
        className="new-screenshot-button"
      >
        Add New Screenshot
      </button> */}

      {userScreenshots.length > 0 ? (
        <div className="screenshots-grid">
          {userScreenshots.map((screenshot) => (
            <div key={screenshot.id} className="screenshot-card">
              <img
                src={screenshot.image_url}
                alt={screenshot.description || "Screenshot"}
                className="screenshot-image"
              />
              <p>{screenshot.description}</p>

              {/* Allow Edit/Delete only if the current user owns the screenshot */}
              <div className="screenshot-actions">
                <button onClick={() => setEditData(screenshot)}>Edit</button>
                <button
                  onClick={() => handleDeleteScreenshot(screenshot.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not uploaded any screenshots yet.</p>
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

export default ScreenshotsUser;
