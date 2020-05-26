import React, { Component } from 'react';
import Day from '../Calendar/Day';
import './SchedulingHome.css';
import SchedulingPage from './SchedulingPage';
class SchedulingHome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="friends-schedule-filter">
                    <SchedulingPage />
                </div>
                <div className="scheduling-day-view">
                    <Day/>
                      
                </div>

            </div>
        )
    }
}

export default SchedulingHome