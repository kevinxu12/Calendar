import React, { Component } from 'react'
import './Event.css'
class Event extends Component {
    render() {
        // these should all be props;
        const props = this.props.data;
        const title = props.title;
        const startTime = props.startTime;
        const endTime = props.endTime;

        var startTimeString = 'am';
        if (startTime > 12) {
            startTimeString = 'pm';
            startTimeString = (startTime - 12) + startTimeString;
            console.log(startTimeString);
        } else {
            if (startTime < 1) {
                startTimeString = 12 + startTime + startTimeString;
            } else {
                startTimeString = startTime + startTimeString;
            }
        }
        var endTimeString = 'am';
        if (endTime > 12) {
            endTimeString = 'pm';
            endTimeString = (endTime - 12) + endTimeString;
            console.log(endTimeString);
        } else {
            if (endTime < 1) {
                endTimeString = 12 + endTime + endTimeString;
            } else {
                endTimeString = endTime + endTimeString;
            }
        }



        const baseLineStart = 135;
        const top = baseLineStart + 50 * (startTime);
        const topString = top + "px";
        const height = 45 + 50 * (endTime - startTime - 1);
        const heightString = height + "px"
        const width = (85 / this.props.data.numColumns);
        const widthString = width + "%";
        const leftBaseLineStart = 9
        const left = leftBaseLineStart + (this.props.data.columnNum - 1) * width;
        const leftString = left + "%";
        var backgroundColor = "";
        switch (this.props.data.columnNum) {
            case 1:
                backgroundColor = "#039BE5"
                break;
            case 2:
                backgroundColor = "#7CB342"
                break;
            default:
                backgroundColor = "#EF6C00"
        }


        return (
            <div className="event" style={{ top: topString, height: heightString, left: leftString, width: widthString, backgroundColor: backgroundColor }}>
                {title}
                <div className="time"> {startTimeString} - {endTimeString}</div>
            </div>
        )
    }
}

export default Event;