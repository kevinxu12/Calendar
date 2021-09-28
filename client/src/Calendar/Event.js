import React, { Component } from 'react'
import './Event.css'
import EventPopup from './Popup/EventPopup'
import { connect } from 'react-redux'; 
import { updateEvent } from '../actions'
class Event extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            renderPopup: false,
            tag: this.props.data.tag,
            title: this.props.data.title
        }
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
    
    }
    // on click opens the popup
    openPopup(e) {
        e.stopPropagation();
        console.log("open popup")
        this.setState({
            renderPopup: true
        })
    }

    // closes the pop up
    closePopup(e) {
        console.log("called close of popup")
        this.setState({
            renderPopup: false
        })
    }

    // updates the event based off of popup changes
    updateEvent(obj) {
        console.log('called update event');
        var newObj = obj;
        if (obj.title) {
            this.setState({ title: obj.title })
        };
        if (obj.tag) {
            this.setState({ tag: obj.tag })
        }
        newObj.id = this.props.data.id;
        this.props.updateEvent(newObj);
        this.closePopup();
    }
    renderPopup(info) {
        if (this.state.renderPopup) {
            return <EventPopup info={{...info, tag: this.state.tag, title: this.state.title}} handleClose={this.closePopup} updateEvent={this.updateEvent} />
        } else {
            return this.renderEvent();
        }
    }
    renderEvent() {
        const props = this.props.data;
        const startTime = props.startTime;
        const endTime = props.endTime;
        const numColumns = props.numColumns;
        const columnNum = props.columnNum;
        var startTimeString = 'am';
        if (startTime >= 12) {
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
        if (endTime >= 12) {
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
        const width = (85 / numColumns);
        const widthString = width + "%";
        const leftBaseLineStart = 9
        const left = leftBaseLineStart + (columnNum - 1) * width;
        const leftString = left + "%";
        var backgroundColor = "";
        switch (this.state.tag) {
            case "work":
                backgroundColor = "#EF6C00"
                break;
            case "leisure":
                backgroundColor = "#9E69AF"
                break;
            default:
                backgroundColor = "#039BE5"

        }
        var obj = { top: topString, height: heightString, left: leftString, width: widthString, backgroundColor: backgroundColor }
        return (
            <div
                className="event" style={obj}>
                {this.state.title}
                <div className="time"> {startTimeString} - {endTimeString}</div>
            </div>
        );
    }
    render() {
        // these should all be props;

        return (
            <div onClick={this.openPopup}>
                {this.renderPopup(this.props.data)}
            </div>
        )
    }
}
const mapDispatchToProps = {
    updateEvent
}
export default connect(null, mapDispatchToProps)(Event);