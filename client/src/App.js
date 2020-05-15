import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import Home from './Home';
import Dashboard from './Dashboard';
import Day from './Day';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/day" component = {Day} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
