const SET_GAMES = "games/setGames";
const ADD_GAME = "games/addGame";
const UPDATE_GAME = "games/updateGame";
const DELETE_GAME = "games/deleteGame";

// Action Creators
export const setGames = (games) => ({
    type: SET_GAMES,
    payload: games,
});

export const addGame = (game) => ({
    type: ADD_GAME,
    payload: game,
});

export const updateGame = (game) => ({
    type: UPDATE_GAME,
    payload: game,
});

export const deleteGame = (gameId) => ({
    type: DELETE_GAME,
    payload: gameId,
});

// Thunks
export const thunkFetchGames = () => async (dispatch) => {
    const response = await fetch(`/api/games`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setGames(data.games));
    }
};

export const thunkAddGame = (game) => async (dispatch) => {
    const response = await fetch(`/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addGame(data));
    }
};

export const thunkUpdateGame = (gameId, updatedData) => async (dispatch) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateGame(data));
    }
};

export const thunkDeleteGame = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteGame(gameId));
    }
};

// Initial State
const initialState = [];

// Reducer
const gamesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GAMES:
            return action.payload;
        case ADD_GAME:
            return [...state, action.payload];
        case UPDATE_GAME:
            return state.map((game) =>
                game.id === action.payload.id ? action.payload : game
            );
        case DELETE_GAME:
            return state.filter((game) => game.id !== action.payload);
        default:
            return state;
    }
};

export default gamesReducer;
