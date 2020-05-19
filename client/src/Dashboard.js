import React, { Component } from 'react'
import axios from 'axios';
import Calendar from './Calendar/Calendar';
import Day from './Calendar/Day';
import './Dashboard.css';
import { months } from './Constant/dates';
import Filters from './Filter/filter';
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
        this.handleSearch = this.handleSearch.bind(this);
    }
    // refactor this code later 
    // this code hsould default load current day events

     helperStateUpdater(response, day, monthNumber, year) {
        const data = response.data.map((entry) => {
            var startdate = new Date(entry.start);
            var enddate = new Date(entry.end);
            var start = startdate.getHours() + startdate.getMinutes()/60;
            var end = enddate.getHours() + enddate.getMinutes()/60;
            return {
                title: entry.summary || 'no summary',
                startTime: start,
                endTime: end,
                description: entry.description,
                creator: entry.creator,
                owner: entry.owner,
                _id: entry._id,
                permissions: entry.permissions,
                id: entry.id
    
            }
        })
        this.setState({events: data, month: months[monthNumber], day: day, year: year, monthNumber: monthNumber}, function() {
        })
    }

    async componentDidMount() {
        const date = new Date()
        const year = date.getFullYear();
        const monthNumber = date.getMonth();
        const day = date.getDate();
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        this.helperStateUpdater(response, day, monthNumber, year);
    }

    async handleSelectDay(month, day, year, monthNumber) {
        console.log("handling selected day from calendar");
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        this.helperStateUpdater(response, day, monthNumber, year);
    }

    async handleSearch(searchKeyWords) {
        console.log("handling smart search");
        const response = await axios.post('/api/smartSearch', { searchString: searchKeyWords, startdate: new Date(this.state.year, this.state.monthNumber, this.state.day)});
        this.helperStateUpdater(response, this.state.day, this.state.monthNumber, this.state.year);
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
                <div className = "filters">
                    <Filters search = {this.handleSearch}/>
                </div> 
            </div>
        )
    }
}

export default Dashboard;