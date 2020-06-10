import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";
import store  from "./redux/store/index";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import Inicio from './Inicio';
import Dashboard from './Dashboard';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
	<div className="container">
		<Dashboard />
	</div>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
