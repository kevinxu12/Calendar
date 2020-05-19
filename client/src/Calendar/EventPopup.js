import React, { Component } from 'react'
import './EventPopup.css'
import RichTextEditor from './RichTextEditor'
import MaterialIcon from 'material-icons-react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';
var textEditorValue = '';
 
const options = [
    'public', 'private', 'restricted'
  ];
  const defaultOption = options[0];
class EventPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.info.title,
            permissions: this.props.info.permissions
        }
        this.myRef = React.createRef()
        this.handleTextEditor = this.handleTextEditor.bind(this);
    }

    handleTextEditor(model) {
        textEditorValue = model;
    }
    handleOnClick(e) {
        e.stopPropagation();
    }
    componentDidMount() {
        this.myRef.current.scrollTo(0, 0);
    }
    handleSelect = (e) => {
        console.log(e);
    }
    async handleSave(e) { 
        e.preventDefault();
        e.stopPropagation();
        console.log("called save");
        var updateObject = {};
        var calendarId = this.props.info.id;
        console.log(calendarId);
        if(this.state.title !== this.props.info.title) {
            updateObject.title = this.state.title;
        } 
        if(textEditorValue && textEditorValue !== this.props.info.description) {
            updateObject.description = textEditorValue;
        }
        console.log(this.state.permissions);
        //if(updateObject) {const response = await axios.post('/api/updateEvent', { calendarId: calendarId, updateObject: updateObject})}
        //
    }
    render() {
        return (
            <div className="popup" onClick={this.handleOnClick} ref = {this.myRef}>
                <div className="row">
                    <div className="col" id="col1">
                        <MaterialIcon icon="edit" />
                        <input className="titleInput" value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} />


                        <div className="textEditor">
                            <MaterialIcon icon=" notes" />
                            <RichTextEditor sendResults={this.handleTextEditor} description={this.props.info.description} /></div>


                        <div className="permissions">
                            <MaterialIcon icon="security" />
                            <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
                        </div>
                    </div>
                    <div className="col-md" id="col2">
                        <button type="button" className="btn btn-primary" onClick = {(e) => {this.handleSave(e)}}> Save </button>
                        <button onClick={this.props.handleClose} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

            </div>
        )
    }
}

export default EventPopup;