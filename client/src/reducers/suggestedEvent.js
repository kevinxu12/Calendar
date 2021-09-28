import { SUGGESTED_DATE } from './../actions/types';
export function currentSuggestedEvent(state = {start: new Date(), end: new Date()}, action) {
    switch (action.type) {
        case SUGGESTED_DATE:
            return action.payload;
        default: 
            return state
    }
}