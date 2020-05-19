import React, { Component } from 'react'
import './Event.css'
import EventPopup from './EventPopup'
class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderPopup: false
        }
        this.onClick = this.onClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    onClick() {
        console.log("called onclick")
        this.setState({
            renderPopup: true
        })
    }

    handleClose(e) {
        console.log("called close of popup")
        e.stopPropagation();
        this.setState({
            renderPopup: false
        })
    }
    renderPopup(topString, info) {
        if (this.state.renderPopup) {
            return <EventPopup top = {topString} info = {info} handleClose = {this.handleClose}/>
        }
    }
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
        var obj = { top: topString, height: heightString, left: leftString, width: widthString, backgroundColor: backgroundColor }

        return (
            <div onClick={this.onClick}>
                <div
                    className="event" style={obj}>
                    {title}
                    <div className="time"> {startTimeString} - {endTimeString}</div>
                </div>
                {this.renderPopup(top/2 + "px", this.props.data)}
            </div>
        )
    }
}

export default Event;