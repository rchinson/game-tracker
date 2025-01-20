const SET_USER_GAMES = "userGames/setUserGames";

// Action Creators
export const setUserGames = (games) => ({
    type: SET_USER_GAMES,
    payload: games,
});

// Thunks
export const thunkFetchUserGamesLibrary = (userId) => async (dispatch) => {
    const response = await fetch(`/api/user_games/${userId}/games`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setUserGames(data.games));
    }
};

// Initial State
const initialState = [];

// Reducer
const userGamesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_GAMES:
            return action.payload;
        default:
            return state;
    }
};

export default userGamesReducer;
