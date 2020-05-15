import React, { Component } from 'react'
import './Day.css'
import obj from './dates'
var months = obj.months
var weekdays = obj.weekdays;
class Day extends Component {
    renderHours() {
        var values = ['1:00 am', '2:00 am', '3:00 am', '4:00 am',
            '5:00 am', '6:00am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 pm',
            '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm',
            '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm']
        return values.map((time) => {
            return <div className="row" key = {time}>
                <div className="time-row" >{time}</div>
                <hr className="line"></hr>
            </div>
        })
    }
    render() {
        const date = new Date()
        const year = date.getFullYear();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        return (
            <div className="day">
                <h2 className="date">{this.props.currentDay || months[month] + " " + dayOfMonth + "th " + year}</h2>
                <div>
                    <hr className="vertical-line" width="1" size="500" />
                    {this.renderHours()}
                </div>
            </div>
        );
    }
}

export default Day;