const SET_USER_GAMES = "userGames/setUserGames";
const ADD_GAME_TO_LIBRARY = "userGames/addGameToLibrary";
const REMOVE_GAME_FROM_LIBRARY = "userGames/removeGameFromLibrary";

// Action Creators
export const setUserGames = (games) => ({
    type: SET_USER_GAMES,
    payload: games,
});

export const addGameToLibrary = (game) => ({
    type: ADD_GAME_TO_LIBRARY,
    payload: game,
});

export const removeGameFromLibrary = (gameId) => ({
    type: REMOVE_GAME_FROM_LIBRARY,
    payload: gameId,
});

// Thunks
export const thunkFetchUserGamesLibrary = (userId) => async (dispatch) => {
    const response = await fetch(`/api/user_games/${userId}/games`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setUserGames(data.games));
    } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load user games.");
    }
};

export const thunkAddGameToLibrary = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/user_games/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addGameToLibrary(data.game));
    } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add game to library.");
    }
};

export const thunkRemoveGameFromLibrary = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/user_games/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(removeGameFromLibrary(data.game.id));
    } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove game from library.");
    }
};

// Reducer
const initialState = [];

const userGamesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_GAMES:
            return action.payload;
        case ADD_GAME_TO_LIBRARY:
            return [...state, action.payload];
        case REMOVE_GAME_FROM_LIBRARY:
            return state.filter((game) => game.id !== action.payload);
        default:
            return state;
    }
};

export default userGamesReducer;
