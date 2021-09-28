import React, { Component } from 'react'
import RichTextEditor from './../Calendar/Popup/RichTextEditor'
import MaterialIcon from 'material-icons-react';
import Tags from './../Calendar/Popup/Tags';

class SchedulingInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            tag: '',
            permission: '',
            textEditorValue: '',
        }
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    handleTagChange(e) {
        this.setState({tag: e.target.innerText.toLowerCase()})
    }

    handleDescriptionChange(model) {
        this.setState({textEditorValue: model});
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value})
    }
    render () {
        return (
            <div>
                <MaterialIcon icon="edit" />
                <input className="titleInput" value={this.state.title} onChange={this.handleTitleChange} />


                <div className="textEditor">
                    <MaterialIcon icon=" notes" />
                    <RichTextEditor sendResults={this.handleDescriptionChange} description={'default'} /></div>


                <div className="tags" style = {{width: "100%"}}>
                    <MaterialIcon icon="emoji_flags" />
                    <Tags handleTagClicked = {this.handleTagChange} />
                </div>

                <button type="button" className="btn btn-primary" onClick={() => {this.props.handleCreate(this.state)}}> Create </button>
                <button type="button" className="btn btn-primary" onClick={this.props.handleBack}> Back</button>
            </div>
        )
    }
}
export default SchedulingInput;