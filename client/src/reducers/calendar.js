import {REPLACE_EVENT, UPDATE_EVENT, ADD_EVENT} from './../actions/types';
export function todaysEvents(state = [], action) {
    switch (action.type) {
        case REPLACE_EVENT: 
            return action.payload;
        case ADD_EVENT: 
            return [...state, action.payload];        
        case UPDATE_EVENT: 
            var obj = action.payload;
            var id = obj.id;
            var tag = obj.tag;
            var title = obj.title;
            const newState = state.map((event) => {if(event.id === id) { 
                var newEvent = event;
                if(tag) {
                    newEvent['tag'] = tag;
                }
                if(title) {
                    newEvent['title'] = title;
                }
                return newEvent;
            } else {
                return event;
            }})
            return newState;
        default: 
            return state
    }
}