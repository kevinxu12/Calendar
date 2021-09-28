import React, { Component } from 'react'
import './SchedulingEvent.css'
import Badge from 'react-bootstrap/Badge'
class SchedulingEvent extends Component {
    renderBadges() {
        return this.props.friends.map((friend) => { return <Badge key = {friend.name} variant="primary" className="users-badge"> {friend.name} </Badge> });
    }
render() {
    var data = this.props.data;
    var start_options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: 'numeric'
    };
    var end_options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: 'numeric'
    }
    var dateString = data.start.toLocaleString('en', start_options) + " - " + data.end.toLocaleString('en', end_options);
    return (
        <div className="item-container">
            <div>
                <Badge variant="secondary" className="tag">{this.props.tag}</Badge>
                <div className="time-display">
                    <div>{dateString}</div>
                </div>
            </div>
            <div>
                {this.renderBadges()}
            </div>
            <div>
            <Badge variant="primary" className="schedule-btn" onClick = {() => {this.props.createEvent(this.props.data)}}>Schedule</Badge> 
            </div>
          

        </div>
    )
}
}

export default SchedulingEvent;