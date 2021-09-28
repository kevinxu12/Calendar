import { combineReducers } from 'redux'
import { todaysEvents } from './calendar';
import { dateInformation } from './dateInformation';
import { currentSuggestedEvent } from './suggestedEvent';
import { CLEAR_STATE } from './../actions/types';
const appReducer = combineReducers({
    todaysEvents,
    dateInformation,
    currentSuggestedEvent
})

export default (state, action) => {
    switch(action.type) {
        case CLEAR_STATE:
            state = undefined;
    }
    return appReducer(state, action);
}