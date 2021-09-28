import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './PersonalFilters.css';
import Tags from '../Calendar/Popup/Tags';
class PersonalFilters extends Component {
    constructor(props) {
        super(props);
        this.handleTagClicked = this.handleTagClicked.bind(this);
        this.state = {
            tag: '',
            textInput: ''
        }
    }
    handleTagClicked(e) {
        this.setState({tag: e.target.innerText});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.tag !== nextState.tag || this.state.textInput !== nextState.textInput) {
             return false
        }
        return true
   }
    render() {
        console.log("rendering filter");
        return (
            <div>
                <h1> Filters </h1>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    var searchKeyWord = this.state.textInput;
                    console.log(searchKeyWord);
                    var tag = this.state.tag;
                    this.props.search(searchKeyWord, tag);
                    this.setState({tag: ''})
                }}>
                    <Form.Group className = "form-group">
                        <Form.Label>Keyword Search</Form.Label>
                        <Form.Control onChange = {(e) => {this.setState({textInput: e.target.value})}} placeholder="Search by keywords" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <div>
                    <Tags handleTagClicked = {this.handleTagClicked}/>
                    </div>
                    <Button className = "submit" variant="primary" type="submit">
                        Submit
                    </Button>
                   
                </Form>
            </div>
        )
    }
}

export default PersonalFilters;