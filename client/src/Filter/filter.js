import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Filter.css';
class filter extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }
    render() {
        return (
            <div>
                <h1> Filters </h1>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    var searchKeyWord = this.textInput.current.value;
                    this.props.search(searchKeyWord);
                }}>
                    <Form.Group className = "form-group">
                        <Form.Label>Keyword Search</Form.Label>
                        <Form.Control ref={this.textInput}  placeholder="Search by keywords" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Button className = "submit" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default filter;