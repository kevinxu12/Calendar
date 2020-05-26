import { combineReducers } from 'redux'
import { todaysEvents } from './calendar';
import { dateInformation } from './dateInformation';

export default combineReducers({
    todaysEvents,
    dateInformation
})