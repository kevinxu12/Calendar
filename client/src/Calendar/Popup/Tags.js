// component for classification tags
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import './Tags.css'
class Tags extends Component {
    render() {
        return (
            <div>
                <Button variant ="primary" id="work" onClick = {this.props.handleTagClicked}>Work</Button>
                <Button variant="secondary" id="leisure" onClick = {this.props.handleTagClicked}>Leisure</Button>
                <Button variant="success" id="social" onClick = {this.props.handleTagClicked}>Social </Button>
                <Button variant="warning" id="default" onClick = {this.props.handleTagClicked}>Default </Button>
            </div>
        )
    }
}

export default Tags;