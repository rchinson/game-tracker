const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_USER_REVIEWS = "session/setUserReviews";
const SET_USER_GAMES = "session/setUserGames";

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});


const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  payload: reviews,
});

const setUserGames = (games) => ({
  type: SET_USER_GAMES,
  payload: games,
});



export const thunkSteamUser = () => async (dispatch) => {
  const response = await fetch("/api/auth/steam-login");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};



export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};




export const thunkFetchUserReviews = (userId) => async (dispatch) => {
  const response = await fetch(`/api/reviews?user_id=${userId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setUserReviews(data));
  }
};

export const thunkFetchUserGames = (userId) => async (dispatch) => {
  const response = await fetch(`/api/user_games?user_id=${userId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setUserGames(data));
  }
};




const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null, reviews: [], games: [] };
    case SET_USER_REVIEWS:
      return { ...state, reviews: action.payload };
    case SET_USER_GAMES:
      return { ...state, games: action.payload };
    default:
      return state;
  }
}

export default sessionReducer;
