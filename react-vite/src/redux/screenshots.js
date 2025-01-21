const SET_SCREENSHOTS = "screenshots/setScreenshots";
const ADD_SCREENSHOT = "screenshots/addScreenshot";
const UPDATE_SCREENSHOT = "screenshots/updateScreenshot";
const DELETE_SCREENSHOT = "screenshots/deleteScreenshot";

// Action Creators
export const setScreenshots = (screenshots) => ({
    type: SET_SCREENSHOTS,
    payload: screenshots,
});

export const addScreenshot = (screenshot) => ({
    type: ADD_SCREENSHOT,
    payload: screenshot,
});

export const updateScreenshot = (screenshot) => ({
    type: UPDATE_SCREENSHOT,
    payload: screenshot,
});

export const deleteScreenshot = (screenshotId) => ({
    type: DELETE_SCREENSHOT,
    payload: screenshotId,
});

// Thunks
export const thunkFetchScreenshots = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/screenshots?game_id=${gameId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setScreenshots(data.screenshots));
    }
};

export const thunkAddScreenshot = (screenshot) => async (dispatch) => {

    console.log("ENTERING ADD THUNK")
    const response = await fetch(`/api/screenshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screenshot),
    });

    console.log("RESPONSE-------",response)

    if (response.ok) {
        const data = await response.json();
        dispatch(addScreenshot(data));
    }
};

export const thunkUpdateScreenshot = (screenshotId, updatedData) => async (dispatch) => {
    const response = await fetch(`/api/screenshots/${screenshotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateScreenshot(data));
    }
};

export const thunkDeleteScreenshot = (screenshotId) => async (dispatch) => {
    const response = await fetch(`/api/screenshots/${screenshotId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteScreenshot(screenshotId));
    }
};

// Initial State
const initialState = [];

// Reducer
const screenshotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SCREENSHOTS:
            return action.payload;
        case ADD_SCREENSHOT:
            return [...state, action.payload];
        case UPDATE_SCREENSHOT:
            return state.map((screenshot) =>
                screenshot.id === action.payload.id ? action.payload : screenshot
            );
        case DELETE_SCREENSHOT:
            return state.filter((screenshot) => screenshot.id !== action.payload);
        default:
            return state;
    }
};

export default screenshotsReducer;
