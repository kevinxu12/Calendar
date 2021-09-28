import React, { Component } from 'react'
import axios from 'axios';
import Calendar from './Calendar/Calendar';
import Day from './Calendar/Day';
import './Dashboard.css';
import { months } from './Constant/dates';
import Filters from './Filter/PersonalFilters';
import { testEventData } from './test/eventData';
import { getCalendarDataFromResponse } from './Constant/helperFunctions'
import { connect } from 'react-redux';
import { replaceDailyEvents, updateSelectedDate } from './actions'
class Dashboard extends Component {
    // we should store events in state once we have fetched them

    constructor(props) {
        super(props);
        this.handleSelectDay = this.handleSelectDay.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.myRef = React.createRef();
    }
    // refactor this code later 
    // this code hsould default load current day events

    async helperStateUpdater(response, day, monthNumber, year) {
        const data = getCalendarDataFromResponse(response);
        await this.props.updateSelectedDate({ month: months[monthNumber], day: day, year: year, monthNumber: monthNumber })
        await this.props.replaceDailyEvents(data);

    }

    // async componentDidMount() {
    //     const date = this.props.date;
    //     console.log(date);
    //     const year = date.year;
    //     const monthNumber = date.monthNumber;
    //     const day = date.day;
    //     const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
    //     await this.helperStateUpdater(response, day, monthNumber, year);
    // }

    async handleSelectDay(month, day, year, monthNumber) {
        console.log("handling selected day from calendar");
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        await this.helperStateUpdater(response, day, monthNumber, year);
    }

    async handleSearch(searchKeyWords, tag) {
        console.log("handling smart search");
        var dateInformation = this.props.date;
        const year = dateInformation.year;
        const monthNumber = dateInformation.monthNumber;
        const day = dateInformation.day;
        // run the search
        // lets put the data first so that we can take advantage of caching
        var response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        if (searchKeyWords) {
            // if no search reset back to the default for the date
            response = await axios.post('/api/smartSearch', { searchString: searchKeyWords, startdate: new Date(this.state.year, this.state.monthNumber, this.state.day) });
        }
        await this.helperStateUpdater(response, day, monthNumber, year);
        if (tag) {
            const processedTag = tag.toLowerCase();
            await this.props.replaceDailyEvents(this.props.todaysEvents.filter(event => { return event.tag === processedTag }));
        }

    }

    // handleNewEvent(e) {

    //     console.log("clicked on create event");
    //     console.log(e.clientY);
    //     console.log(this.myRef.current.scrollTop);
    //     // down by like 69 or 10%
    //     // set state for show pop up

    //     // once pop up is set to true, render the pop up

    //     // on close, change state

    // }
    render() {
        return (
            <div>
                <div className="calendar-view">
                    <Calendar handleSelectDay={this.handleSelectDay}
                    />
                </div>
                <div className="day-view" ref={this.myRef} onClick={this.handleNewEvent}>
                    <Day />
                </div>
                <div className="filters">
                    <Filters search={this.handleSearch} />
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        todaysEvents: state.todaysEvents,
        date: state.dateInformation
    }
}
const mapDispatchToProps = {
    replaceDailyEvents,
    updateSelectedDate
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);