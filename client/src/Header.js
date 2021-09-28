import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { homeRoute, dashboardRoute, schedulingRoute, profileRoute } from './Constant/routes';
import { clearState } from './actions';
import { connect } from 'react-redux';
class Header extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    // on log out
    // add react-persist purge
    async handleLogout() {
        console.log("called logout");
        await axios.get('/api/logout');
        // purge state below. Unsure if we want to purge
        this.props.clearState();
        // redirect to home page
        this.props.history.push(homeRoute);
    }
    // to whoever reads this in the future. Please change inline styling to a header.css.
    render() {
        // Feed not implemented yet when implemented change code in header
        // put smoething to the right of the header w <div className="form-inline my-2 my-lg-0">

        if (window.location.pathname === homeRoute) return null;
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#F48989" }} variant="dark">
                    <Navbar.Brand href="home">Calender</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            {/* <Nav.Link href={dashboardRoute} style={{ color: "white" }}>Dashboard</Nav.Link>
                            <Nav.Link href={schedulingRoute} style={{ color: "white" }}>Scheduling</Nav.Link> */}
                            <NavDropdown title="Menu" id="basic-nav-dropdown">
                                <NavDropdown.Item href={schedulingRoute}>Scheduling</NavDropdown.Item>
                                <NavDropdown.Item href={profileRoute}>Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href={dashboardRoute}>Dashboard</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                    <div className="form-inline my-2 my-lg-0">
                        <div onClick={this.handleLogout} style={{ color: "white" }}> Logout </div>
                    </div>
                </Navbar>
            </div>
        )
    }
}

const mapDispatchToProps = {
    clearState
}

export default connect(null, mapDispatchToProps)(withRouter(Header));