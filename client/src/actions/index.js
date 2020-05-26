
import { UPDATE_EVENT_SUCCESS, SELECTED_DATE} from './types'
export const updateDailyEvents = (events) => async (dispatch) => {
    dispatch({type: UPDATE_EVENT_SUCCESS, payload: events});
}

export const updateSelectedDate = (dateObject) => async (dispatch) => {
    dispatch({type: SELECTED_DATE, payload: dateObject});
}