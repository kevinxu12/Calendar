import React, { Component } from 'react'
import './EventPopup.css'
import RichTextEditor from './RichTextEditor'
import MaterialIcon, { colorPalette } from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown';
class EventPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.info.title
        }
        this.handleTextEditor = this.handleTextEditor.bind(this);
    }

    handleTextEditor(model) {
        console.log(model);
    }
    handleOnClick(e) {
        e.stopPropagation();
    }
    render() {
        return (
            <div className="popup" onClick={this.handleOnClick}>
                <div className="row">
                    <div className="col" id="col1">
                        <MaterialIcon icon="edit" />
                        <input className="titleInput" value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} />
                        <div className="textEditor">
                            <MaterialIcon icon=" notes" />
                            <RichTextEditor sendResults={this.handleTextEditor} description={this.props.info.description} /></div>
                        <div className="permissions">
                            <MaterialIcon icon="security" />
                            <Dropdown>
                                <Dropdown.Toggle style = {{backgroundColor: "#dadce0", color: "black", borderColor: "black"}} variant="success" id="dropdown-basic">
                                    Security Setting
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item>Private</Dropdown.Item>
                                    <Dropdown.Item>Public</Dropdown.Item>
                                    <Dropdown.Item>Restricted</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="col-md" id="col2">
                        <button type="button" className="btn btn-primary"> Save </button>
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