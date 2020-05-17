import React, { Component } from 'react'
import axios from 'axios';
import Calendar from './Calendar';
import Day from './Day';
import './Dashboard.css';
import { months } from './dates';
class Dashboard extends Component {
    // we should store events in state once we have fetched them
   
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            month: '',
            day: '',
            year: '',
            monthNumber: 0
        }
        this.handleSelectDay = this.handleSelectDay.bind(this);
    }
    // refactor this code later 
    // this code hsould default load current day events
    async componentDidMount() {
        const date = new Date()
        const year = date.getFullYear();
        const monthNumber = date.getMonth();
        const day = date.getDate();
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        const data = response.data.map((entry) => {
            var startdate = new Date(entry.start);
            var enddate = new Date(entry.end);
            var start = startdate.getHours() + startdate.getMinutes()/60;
            var end = enddate.getHours() + enddate.getMinutes()/60;
            return {
                title: entry.summary || 'no summary',
                startTime: start,
                endTime: end

            }
        })
        this.setState({events: data, month: months[monthNumber], day: day, year: year, monthNumber: monthNumber}, function() {
        })
    }

    async handleSelectDay(month, day, year, monthNumber) {
        console.log("handling selected day from calendar");
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        const data = response.data.map((entry) => {
            var startdate = new Date(entry.start);
            var enddate = new Date(entry.end);
            var start = startdate.getHours() + startdate.getMinutes()/60;
            var end = enddate.getHours() + enddate.getMinutes()/60;
            return {
                title: entry.summary || 'no summary',
                startTime: start,
                endTime: end

            }
        })
        this.setState({events: data, month: month, day: day, year: year, monthNumber: monthNumber}, function() {
        })
    }

    renderDayView() {
        console.log("rendered day view");
        return <Day 
        month = {this.state.month} 
        monthNumber = {this.state.monthNumber}
         day = {this.state.day} 
         year = {this.state.year}
         data = {this.state.events}/>
    }
    render() {

        return (
            <div className = "dash">
                <div className = "calendar-view">
                    <Calendar handleSelectDay = {this.handleSelectDay}
                    />
                </div>
                <div className = "day-view">
                {this.renderDayView()}
                </div>
            </div>
        )
    }
}

export default Dashboard;