import React, { Component } from 'react'
import './Calendar.css'
import { months, weekdays} from './../Constant/dates';
class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: ''
        }
    }
    renderDays() {
        var result = [];
        var end_date = 31;
        var thirty_day_months = ['Sep', 'Apr', 'Jun', 'Nov']
        if(thirty_day_months.includes(this.state.month)) {
            end_date = 30;
        }
        for (var _i = 1; _i <= end_date; _i += 1) {
            var _addClass = '';
            if (_i === 12) { _addClass = ' className="selected"'; }

            switch (_i) {
                case 8:
                case 10:
                case 27:
                    _addClass = ' className="event"';
                    break;
            }
            const value = { _i } + { _addClass }
            result.push(<li key={_i}><div title={_i} data-value={value}>{_i}</div></li>);
        }

        return result;
    }
    // only show months from now on
    renderMonths() {
        var num = new Date().getMonth();
        var result = []
        for (var i = num; i < 12; i++) {
            result.push(<li key={i}><div title={months[i]} data-value={i}>{months[i].substring(0, 3)}</div></li>)
        }
        return result;

    }
    render() {
        const date = new Date()
        const day = date.getDay();
        const year = date.getFullYear();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        return (
            <div className="calendar">

                <div className="col leftCol">
                    <div className="content">
                        <h1 className="date">{weekdays[day]}<span>{months[month]} {dayOfMonth}th</span></h1>
                    </div>
                </div>

                <div className="col rightCol">
                    <div className="content">
                        <h2 className="year">{year}</h2>
                        <ul className="months" onClick = {(e) => {
                            var month = e.target.innerHTML;
                            this.setState({month: month});
                        }}>
                            {this.renderMonths()}
                        </ul>
                        <div className="clearfix"></div>
                        <ul className="days" onClick={(e) => {
                            var currentDay = e.target.innerText;
                            this.props.handleSelectDay(months[month], currentDay, year, month);
                        }}>
                            {this.renderDays()}
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                </div>

                <div className="clearfix"></div>

            </div>
        )
    }
}

export default Calendar;