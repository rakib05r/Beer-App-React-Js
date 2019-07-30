import React from 'react';
import { Switch,Route} from "react-router-dom";
import './App.css';
import FetchData from './components/FetchData'
import Favourite from './components/favourite'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route  path="/favourite" component={Favourite}/>
        <Route  path="/" component={FetchData}/>
        
      </Switch>
    </React.Fragment>
  );
}

export default App;
