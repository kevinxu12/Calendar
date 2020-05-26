
import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import Badge from 'react-bootstrap/Badge';
import './SchedulingFilters.css'
import { testFriends } from './../test/eventData'
class SchedulingFilters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friends: new Set(),
            friendsOptions: [],
            friendsMap: {}
        }
        this.addFriend = this.addFriend.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
    }
    // this should all be changed with actual code
    componentDidMount() {
        var obj = {};
        var friendsOptions = [];
        testFriends.forEach((friend) => {
            obj[friend.name] = friend.email;
            friendsOptions.push({label: friend.name, name: friend.name}
        )});
        this.setState({friendsMap: obj, friendsOptions: friendsOptions}, () => {
            console.log(this.state);
        })
    }
    addFriend(e) {
        console.log("adding new friend");
        this.setState({ friends: this.state.friends.add(e.label) });
    }

    deleteFriend(e) {
        console.log("removing selected friend");
        this.state.friends.delete(e);
        this.setState({friends: this.state.friends});
    }

    renderSelectedFriends() {
        return Array.from(this.state.friends).map((friend) => {
            return (
                <Badge variant="secondary" className="select-tag" key = {friend} onClick = {() => {this.deleteFriend(friend)}}><i className="fa fa-times close" id="close"></i>{friend}</Badge>
            )
        })
    }
    render() {
        var defaultOption = this.state.friendsOptions[0];
        return (
            <div>
                <h5>Pick Friends</h5>
                <Dropdown options={this.state.friendsOptions} onChange={this.addFriend} value={defaultOption} placeholder="Select an option" />
                <div className = "selected-container"> 
                    {this.renderSelectedFriends()}
                </div>
                <div>
                <button type="button" id="submit" className="btn btn-primary" style = {{width: "50%"}}onClick ={() => {this.props.handleSubmit(this.state.friends, this.state.friendsMap)}}> Find Times</button>
                </div>   
            </div>
        )
    }
}

export default SchedulingFilters;

