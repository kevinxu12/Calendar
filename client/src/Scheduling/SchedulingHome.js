import React, { Component } from 'react';
import axios from 'axios';
import { months } from '../Constant/dates';
import Day from '../Calendar/Day';
import { getCalendarDataFromResponse } from '../Constant/helperFunctions'
import { testEventData } from '../test/eventData';
import './SchedulingHome.css';
import SchedulingPage from './SchedulingPage';
class SchedulingHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: '',
            year: '',
            monthNumber: '',
            day: '',
            events: []
        }
    }
    async componentDidMount() {
        const date = new Date()
        const year = date.getFullYear();
        const monthNumber = date.getMonth();
        const day = date.getDate();
        const response = await axios.post('/api/getAllEventsForDate', { startdate: new Date(year, monthNumber, day) });
        const data = getCalendarDataFromResponse(response);
        if (data) {
            this.setState({ events: data, month: months[monthNumber], day: day, year: year, monthNumber: monthNumber });
        }

    }

    render() {
        return (
            <div>
                <div className="friends-schedule-filter">
                    <SchedulingPage />
                </div>
                <div className="scheduling-day-view">
                    <Day
                        month={this.state.month}
                        monthNumber={this.state.monthNumber}
                        day={this.state.day}
                        year={this.state.year}
                        data={this.state.events} />
                </div>

            </div>
        )
    }
}

export default SchedulingHome