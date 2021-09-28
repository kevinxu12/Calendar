
import { REPLACE_EVENT, SELECTED_DATE, UPDATE_EVENT, SUGGESTED_DATE, ADD_EVENT, CLEAR_STATE} from './types'
export const replaceDailyEvents = (events) => async (dispatch) => {
    console.log("replacing existing events");
    dispatch({type: REPLACE_EVENT, payload: events});
}

export const updateSelectedDate = (dateObject) => async (dispatch) => {
    console.log("updating selected event");
    dispatch({type: SELECTED_DATE, payload: dateObject});
}

export const updateEvent= (obj) => async (dispatch) => {
    console.log("updating event");
    dispatch({type: UPDATE_EVENT, payload: obj});
}

export const addDailyEvent = (obj) => async (dispatch) => {
    console.log("adding new daily event");
    dispatch({type: ADD_EVENT, payload: obj})
}

export const updateSuggestedDate = (data) => async (dispatch) => {
    console.log("updating current suggested date");
    dispatch({type: SUGGESTED_DATE, payload: data});
}

export const clearState = (obj) => async (dispatch) => {
    console.log("clearing state");
    dispatch({type: CLEAR_STATE, payload: obj});
}