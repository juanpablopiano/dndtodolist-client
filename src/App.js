import React from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

// Pages
import { Home } from "./pages/home-page/home.component";
import BoardPage from "./pages/board-page/board-page.component";

import { Route, Switch /* Redirect */ } from "react-router-dom";

let socket;

class App extends React.Component {
	constructor() {
		super();
		socket = socketIOClient(process.env.REACT_APP_API_URL);
	}
	render() {
		return (
			<div className="App">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/board/:id" component={BoardPage} />
				</Switch>
			</div>
		);
	}
}

export { App, socket };
