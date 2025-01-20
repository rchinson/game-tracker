const SET_REVIEWS = "reviews/setReviews";
const ADD_REVIEW = "reviews/addReview";
const UPDATE_REVIEW = "reviews/updateReview";
const DELETE_REVIEW = "reviews/deleteReview";

// Action Creators
export const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
});

export const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review,
});

export const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    payload: review,
});

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    payload: reviewId,
});

// Thunks
export const thunkFetchReviews = (gameId) => async (dispatch) => {
    const response = await fetch(`/api/reviews?game_id=${gameId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setReviews(data.reviews));
    }
};

export const thunkAddReview = (review) => async (dispatch) => {
    const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addReview(data));
    }
};

export const thunkUpdateReview = (reviewId, updatedData) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateReview(data));
    }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
};

// Initial State
const initialState = [];

// Reducer
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS:
            return action.payload;
        case ADD_REVIEW:
            return [...state, action.payload];
        case UPDATE_REVIEW:
            return state.map((review) =>
                review.id === action.payload.id ? action.payload : review
            );
        case DELETE_REVIEW:
            return state.filter((review) => review.id !== action.payload);
        default:
            return state;
    }
};

export default reviewsReducer;
