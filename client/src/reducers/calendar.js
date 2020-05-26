import {UPDATE_EVENT_SUCCESS} from './../actions/types';
export function todaysEvents(state = [], action) {
    switch (action.type) {
        case UPDATE_EVENT_SUCCESS: 
            return action.payload;
        default: 
            return state
    }
}