import {SELECTED_DATE} from './../actions/types';
import { months } from './../Constant/dates'
const date = new Date()
const year = date.getFullYear();
const monthNumber = date.getMonth();
const day = date.getDate();
export function dateInformation(state = {day, year, monthNumber, month: months[monthNumber] }, action) {
    switch (action.type) {
        case SELECTED_DATE:
            return action.payload;
        default: 
            return state
    }
}