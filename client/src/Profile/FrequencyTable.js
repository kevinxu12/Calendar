import React from "react";
import {MDBDataTable} from "mdbreact";
const data  =  {columns:[
    {
      label: 'Name',
      field: 'name',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Position',
      field: 'position',
      sort: 'asc',
      width: 270
    },
  ],
rows: [
    {
      id: 1,
      name: 'Tiger Nixon',
      position: 'System Architect',
    },  {
      id: 2,
      name: 'Tiger Nixon',
      position: 'System Architect',
    }]};
class FrequencyTable extends React.Component {
    render () {
        return (
            <div style = {{marginTop: "10px"}}>
                <h4> Data Table</h4>
                 <MDBDataTable data={data}/>
            </div>
        )
    }
}

export default FrequencyTable;
   