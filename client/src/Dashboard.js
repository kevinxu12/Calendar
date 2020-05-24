import React, { Component } from 'react'
import axios from 'axios';
import Calendar from './Calendar/Calendar';
import Day from './Calendar/Day';
import './Dashboard.css';
import { months } from './Constant/dates';
import Filters from './Filter/PersonalFilters';
import { testEventData } from './test/eventData';
import { getCalendarDataFromResponse } from './Constant/helperFunctions'
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
        this.myRef = React.createRef();
    }
    // refactor this code later 
    // this code hsould default load current day events

    async helperStateUpdater(response, day, monthNumber, year) {
        const data = getCalendarDataFromResponse(response);
        await this.setState({ events: data, month: months[monthNumber], day: day, year: year, monthNumber: monthNumber }, function () {
        })

    }

    async componentDidMount() {
        //const logged_response = await axios.get('/api/currentUser');
        // insert some logic above about redirecting to home page if not logged in


        const date = new Date()
        const year = date.getFullYear();
        const monthNumber = date.getMonth();
        const day = date.getDate();
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        await this.helperStateUpdater(response, day, monthNumber, year);

    }

    async handleSelectDay(month, day, year, monthNumber) {
        console.log("handling selected day from calendar");
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        await this.helperStateUpdater(response, day, monthNumber, year);
    }

    async handleSearch(searchKeyWords, tag) {
        console.log("handling smart search");

        const year = this.state.year;
        const monthNumber = this.state.monthNumber;
        const day = this.state.day;
        // run the search
        // lets put the data first so that we can take advantage of caching
        var response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        if (searchKeyWords) {
            // if no search reset back to the default for the date
            response = await axios.post('/api/smartSearch', { searchString: searchKeyWords, startdate: new Date(this.state.year, this.state.monthNumber, this.state.day) });
        }
        console.log(response);
        this.helperStateUpdater(response, day, monthNumber, year);
        if (tag) {
            this.setState({ events: this.state.events.filter(event => { return event.tag === tag }) })
        }

    }

    handleNewEvent(e) {
    
        console.log("clicked on create event");
        console.log(e.clientY);
        console.log(this.myRef.current.scrollTop);
        // down by like 69 or 10%
        // set state for show pop up

        // once pop up is set to true, render the pop up

        // on close, change state
    
    }
    render() {
        return (
            <div>
                <div className="calendar-view">
                    <Calendar handleSelectDay={this.handleSelectDay}
                    />
                </div>
                <div className="day-view" ref = {this.myRef} onClick = {this.handleNewEvent}>
                    <Day
                        month={this.state.month}
                        monthNumber={this.state.monthNumber}
                        day={this.state.day}
                        year={this.state.year}
                        data={this.state.events} />
                </div>
                <div className="filters">
                    <Filters search={this.handleSearch} />
                </div>
            </div>
        )
    }
}

export default Dashboard;