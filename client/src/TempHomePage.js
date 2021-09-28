import React, { Component } from 'react'

class TempHomePage extends Component {
    render() {
        return (
            <div>
                
                <a href='/auth/google'>Test Google Calendar Sync </a>
                <a href='/auth/google/nosync'>Test Google Calendar Without Sync </a>
                <h2>Notes</h2>
                <li>Note. When signing up, we will sync with your calendar. We will not sync all events in your calendar, only those that will happen after today</li>
                <li>We will not update entries for items that are more than 6 months removed</li>
            </div>
        )
    }
}

export default TempHomePage;