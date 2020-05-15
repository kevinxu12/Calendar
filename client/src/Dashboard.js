import React, { Component } from 'react'
import axios from 'axios';
import Calendar from './Calendar';
import Day from './Day';
import './Dashboard.css';
class Dashboard extends Component {
    // we should store events in state once we have fetched them
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            currentDay: ''
        }
        this.handleSelectDay = this.handleSelectDay.bind(this);
    }

    handleSelectDay(month, day, year) {
        var currentDay = month + " " + day + "th " + year;
        this.setState({currentDay: currentDay})
    }

    renderDayView() {
        console.log("rendered day view");
        return <Day currentDay = {this.state.currentDay}/>
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