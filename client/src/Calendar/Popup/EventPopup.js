import React, { Component } from 'react'
import './EventPopup.css'
import RichTextEditor from './RichTextEditor'
import MaterialIcon from 'material-icons-react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Tags from './Tags';
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
            permissions: this.props.info.permissions,
            tag: this.props.info.tag
        }
        this.handleDescriptionChange= this.handleDescriptionChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
    }
    // handle the text edit box
    handleDescriptionChange(model) {
        textEditorValue = model;
    }
    // stops propagation on calendar 
    handleOnClick(e) {
        e.stopPropagation();
    }

    // handles selection of the drop
    handlePermissionsChange(e)  {
        this.setState({permissions: e.label});
    }

    handleTagChange(e) {
        this.setState({tag: e.target.innerText})
    }

    // handles the save or submit button
    async handleSave(e) {
        e.preventDefault();
        e.stopPropagation();
        var updateObject = {};
        var calendarId = this.props.info.id;

        // get the title
        if (this.state.title !== this.props.info.title) {
            console.log('different title');
            updateObject.title = this.state.title;
        }
        // check if text editor is different
        if (textEditorValue && textEditorValue !== this.props.info.description) {
            console.log("different description");
            updateObject.description = textEditorValue;
        }

        if(this.state.permissions !== this.props.info.permissions) {
            console.log("different permissions")
            updateObject.permissions = this.state.permissions
        }
        if(this.state.tag !== this.props.info.tag) {
            console.log("different tags")
            updateObject.tag = this.state.tag
        }
        await this.props.updateEvent(updateObject);
        if(Object.keys(updateObject).length !== 0) {
            //console.log(this.props.info);
            await axios.post('/api/updateEvent', { calendarId: calendarId, updateObject: updateObject, 
            startdate: this.props.info.currentDay})
            
            //console.log(response);
        }
        
    }
    render() {
        return (
            <div className="popup" onClick={this.handleOnClick} ref={this.myRef}>
                <MaterialIcon icon="edit" />
                <input className="titleInput" value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} />


                <div className="textEditor">
                    <MaterialIcon icon=" notes" />
                    <RichTextEditor sendResults={this.handleDescriptionChange} description={this.props.info.description} /></div>


                <div className="permissions">
                    <MaterialIcon icon="security" />
                    <Dropdown options={options} onChange={this.handlePermissionsChange} value={defaultOption} placeholder="Select an option" />
                </div>


                <div className="tags">
                    <MaterialIcon icon="emoji_flags" />
                    <Tags handleTagClicked = {this.handleTagChange} />
                </div>

                <button type="button" id="submit" className="btn btn-primary" onClick={(e) => { this.handleSave(e) }}> Save </button>
                <button onClick={this.props.handleClose} type="button" className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>

            </div>
        )
    }
}

export default EventPopup;