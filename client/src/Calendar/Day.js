import React, { Component } from 'react'
import './Day.css'
import Event from './Event';
import { hours, months } from './../Constant/dates';
import { testEventData } from './../test/eventData';
class Day extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdated: false
        }
    }
    renderHours() {
        return hours.map((time) => {
            return <div className="row" key={time}>
                <div className="time-row" >{time}</div>
                <hr className="line"></hr>
            </div>
        })
    }
    renderEvents(currentDay) {
        // side by side logic
        // data should be sorted coming in
        var columns = [];
        // lets put things into columns
        var data = this.props.data.sort(function(a,b) { if((a.start - b.start) > 0) { return -1} else {return 1} });
        //console.log(data);
        //data = testEventData;
        data.forEach((event) => {
            var canFit = false;
            for (var i in columns) {
                var column = columns[i];
                var lastEntry = column[column.length - 1];
                if (event.startTime > lastEntry.endTime) {
                    column.push(event);
                    canFit = true;
                    break;
                }       
            }
            if(!canFit) {
                columns.push([event]);
            }
        })
        var iterator = 0;
        // for each column
        var numColumns = columns.length;
        return columns.map((column) => {
            iterator = iterator + 1;
            // for each event in a column
            return column.map((event) => {
                var obj = {
                    ...event, numColumns: numColumns, columnNum: iterator, currentDay: currentDay
                }
                return <div><Event data={obj} /></div>
            })
        });
    }
    render() {
        const date = new Date()
        const year = date.getFullYear();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        var currentDate = this.props.month + " " + this.props.day + "th" + " " + this.props.year;
        var currentDay = new Date(this.props.year, this.props.monthNumber, this.props.day);
        if(currentDate === " th ") { currentDay = new Date(year, month, dayOfMonth) }
        if(currentDate === " th ") { currentDate = months[month] + " " + dayOfMonth + "th " + year}
        
        return (
            <div className="day-container">
                <h2 className="display-date">{currentDate}</h2>
                <div className = "calendar-container">
                    <hr className="vertical-line" width="1" size="500" />
                    <div>
                        {this.renderHours()}
                    </div>
                    <div style = {{width: "100%"}}>
                        {this.renderEvents(currentDay)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Day;