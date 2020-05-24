import React from 'react';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';

import Home from './TempHomePage';
import Header from './Header';
import Dashboard from './Dashboard'
// claudia's home page
import HomePage from './HomePage'
import Scheduling from './Scheduling/SchedulingHome'
import {homeRoute, dashboardRoute, schedulingRoute} from './Constant/routes';
function App() {
  return (
    <BrowserRouter>
      <div>
          <Header/>
          <Route exact path={homeRoute} component={Home} />
          <Route exact path={dashboardRoute} component={Dashboard} />
          <Route path = "/homepage" component = {HomePage}/>
          <Route path = {schedulingRoute} component = {Scheduling}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
