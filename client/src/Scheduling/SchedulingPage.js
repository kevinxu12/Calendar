import React, { Component } from 'react';
import { testSchedules, testFriends } from '../test/eventData';
import SchedulingEvent from './SchedulingEvent';
import './SchedulingPage.css';
import SchedulingFilters from './SchedulingFilters';
import axios from 'axios'
import { generateLinkURL } from '../Constant/helperFunctions'
import Button from 'react-bootstrap/Button';
import SchedulingInput from './SchedulingInput';
import { connect } from 'react-redux';
import { updateSuggestedDate, addDailyEvent } from './../actions/index';
var { DateTime } = require('luxon');

class SchedulingPage extends Component {
    constructor(props) {
        super(props);
        // displayCreatedEvent: 0 for default, // 1 will toggle defining the event// 2 for the link generation
        // currrent event data gets start and end time of the event you clicked on
        // tag should be changed
        this.state = {
            data: testSchedules,
            friends: testFriends,
            tag: 'work',
            displayCreatedEvent: 0
        }
        this.handleFindTimes = this.handleFindTimes.bind(this);
        this.onOpenInput = this.onOpenInput.bind(this);
        this.onBack = this.onBack.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }
    renderSuggestedEvents() {
        // if 0 -> show all suggested time options 
        if (this.state.displayCreatedEvent === 0) {
            return this.state.data.map((entry) => {
                return <SchedulingEvent createEvent={this.onOpenInput} data={entry} friends={this.state.friends} tag={this.state.tag} />
            })
            // if 1 open up a page where you can input stuff
        } else if (this.state.displayCreatedEvent === 1) {
            return <SchedulingInput handleBack={this.onBack} handleCreate={this.createEvent} />


            // if 2, pop up a link where you can add yourself to an event
        } else if (this.state.displayCreatedEvent === 2) {
            // temporary link feature
            console.log(this.props.time);
            var data = {
                title: 'test',
                start: this.props.time.start,
                end: this.props.time.end
            }
            var link = generateLinkURL(data);
            return <div><a href={link} >  Link to the Event </a><Button onClick={this.onBack}> Back </Button></div>
        }
    }
    // when the user presses back button
    onBack() {
        this.setState({ displayCreatedEvent: 0 });
    }
    // when user ccreates an event. This is where we do display currrent event 2
    // logic below for sending a request to insert 
    //axios.post('/createEvent', testData);
    async createEvent(state) {
        let d = DateTime.local();
        var obj = { ...state, start: this.props.time.start, end: this.props.time.end, timezone: d.zoneName, attendees: this.state.friends };
        const response = await axios.post('/api/addNewEvent', obj);
        const entry = response.data;
        var startdate = new Date(entry.start);
        var enddate = new Date(entry.end);
        // if its today, let's update
        // check if it works for just today
        if (startdate === DateTime.Today) {
            var start = startdate.getHours() + startdate.getMinutes() / 60;
            var end = enddate.getHours() + enddate.getMinutes() / 60;
            const data = {
                startTime: start,
                endTime: end,
                title: entry.summary || 'no summary',
                ...entry
            }
            await this.props.addDailyEvent(data);
        }
        this.setState({ displayCreatedEvent: 2, data: this.state.data.filter((event) => event.start !== this.props.time.start && event.end !== this.props.time.end) })
    }
    // when the user presses schedule. This should be changed to displayCreatedEvent 1
    async onOpenInput(data) {
        console.log(data);
        await this.props.updateSuggestedDate(data);
        this.setState({ displayCreatedEvent: 1 });
        //this.setState({ displayCreatedEvent: 2, currentEventDateData: data });

    }


    // method called on "find time"
    async handleFindTimes(rawNamesList, friendsMap) {
        console.log("finding times, submitted");

        // for now hardcoded but should be fetched
        var range = 'week'

        var apiString = '/api/getAvailableTimes?range=' + range;
        let emailList = Array.from(rawNamesList);
        // get a list of emails 
        emailList = emailList.map((name) => { return friendsMap[name] });

        // get a list of friends we've selected and rerender teh events
        let updatedFriends = Array.from(rawNamesList).map((name) => { return { email: friendsMap[name], name: name } });
        var response = await axios.post(apiString, { email: emailList });
        var data = response.data;
        console.log(data);
        // data comes in as string representation of a date object. so lets convert it
        this.setState({
            data: data.map((event) => {
                return { start: new Date(event[0]), end: new Date(event[1]) };
            }),
            friends: updatedFriends
        });
    }

    render() {
        return (
            <div>
                <div className="schedule-page-selectors">
                    <SchedulingFilters handleSubmit={this.handleFindTimes} />
                </div>
                <div className="schedule-page-holder">
                    <h5> Suggested Times </h5>
                    {this.renderSuggestedEvents()}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        time: state.currentSuggestedEvent
    }
}
const mapDispatchToProps = {
    updateSuggestedDate,
    addDailyEvent
}
export default connect(mapStateToProps, mapDispatchToProps)(SchedulingPage);