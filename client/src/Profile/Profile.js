import React, { Component } from 'react'
import Charts from './Charts'
import FrequencyTable from './FrequencyTable';
class Profile extends Component {
    render() {
        return (
            <div>
                <div className="left-col" style={{ float: "left", width: "35%", backgroundColor: "white", padding: "10px" }}>
                    <div style={{ marginTop: "40px", marginLeft: "10px" }}>
                        <h4> Update Busy Times </h4>
                        <div className="forms" style={{ width: "100%"}}>
                            <form>
                                <div>Start Time: <input className="startTime" style = {{display: "table" }} pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]" />
                                </div>
                                <div  style = {{marginTop: "10px"}} >End Time: <input className="endTime" style = {{display: "table"}}/></div>
                                
                                <button type="primary" className="btn btn-primary"> Submit </button>
                            </form>

                        </div>

                    </div>

                </div>
                <div className="right-col" style={{ float: "left", width: "64%", overflowY: "auto", height: "200%", backgroundColor: "white", padding: "20px", marginLeft: "10px" }}>
                    <Charts />
                    <FrequencyTable style = {{marginTop: "10px"}}/>
                </div>

            </div>
        )
    }
}

export default Profile;