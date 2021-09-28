import React, { Component } from 'react'
import './Calendar.css'
import { months, weekdays, month_abbreviations} from './../Constant/dates';
import { connect } from 'react-redux';
class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: '',
            year: '',
            day: '',
            dayOfWeek: '',
            date: ''
        }
    }
    renderDays() {
        var result = [];
        var end_date = 31;
        var thirty_day_months = [8, 3, 5, 10];
        // check for months with 30 days.
        if(thirty_day_months.includes(this.state.month)) {
            end_date = 30;
        }
        // days of the week header
        for(var j = 0; j < 7; j++) {
            var day = '';
            switch(j) {
                case 0:
                    day = "M";
                    break;
                case 1: 
                    day = "T";
                    break;
                case 2:
                    day = "W";
                    break;
                case 3: 
                    day = "R";
                    break;
                case 4: 
                    day = "F";
                    break;
                case 5:
                    day = "S";
                    break;
                case 6:
                    day = "U";
                    break;
                default:
            }
            result.push(<li key ={day}><div> {day}</div> </li>)
        }
        // align first day with the filler
        const date = new Date(this.state.year, this.state.month, 1);
        const dayOfWeek = date.getDay();
        for(var k = 0; k < dayOfWeek; k +=1) {
            result.push(<li key = {-1 * k}><div></div></li>)
        }
        // rest of the days
        for (var _i = 1; _i <= end_date; _i += 1) {
            result.push(<li key={_i} className = "real-day"><div onClick={(e) => {
                var currentDay = e.target.innerText;
                this.setState({day: currentDay});
                this.props.handleSelectDay(months[this.state.month], currentDay, this.state.year, this.state.month);
            }}>{_i}</div></li>);
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
    componentDidMount() {
        var dateInformation = this.props.date;
        const year = dateInformation.year;
        const month = dateInformation.monthNumber;
        const day= dateInformation.day;
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        this.setState({dayOfWeek: dayOfWeek, date: date, day: day, month: month, year: year});
    }
    // onclick month is not done yet
    render() {
        // var dateInformation = this.props.date;
        // const year = dateInformation.year;
        // const month = dateInformation.monthNumber;
        // const day= dateInformation.day;
        // const date = new Date(year, month, day);
        // const dayOfWeek = date.getDay();
        return (
            <div className="calendar">

                <div className="col leftCol">
                    <div className="content">
                        <h1 className="date">{weekdays[this.state.dayOfWeek]}<span>{months[this.state.month]} {this.state.day}th</span></h1>
                    </div>
                </div>

                <div className="col rightCol">
                    <div className="content">
                        <h2>{this.state.year}</h2>
                        <ul className="months" onClick = {(e) => {
                            var month = e.target.innerText.toLowerCase();
                            console.log(month);
                            month = month_abbreviations[month];
                            this.setState({month: month});
                            console.log(this.state.day);
                            //console.log(month);
                            this.props.handleSelectDay(months[month], this.state.day, this.state.year, month);
                        }}>
                            {this.renderMonths()}
                        </ul>
                        <div className="clearfix"></div>
                        <ul className="days">
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
function mapStateToProps(state) {
    return { 
        date: state.dateInformation
    }
}
export default connect(mapStateToProps, null)(Calendar);