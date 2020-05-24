import React, { Component } from 'react'

class TempHomePage extends Component {
    render() {
        return (
            <div>
                <a href='/auth/google'>Test Google Calendar Sync </a>
                <a href='/auth/google/nosync'>Test Google Calendar Without Sync </a>
            </div>
        )
    }
}

export default TempHomePage;