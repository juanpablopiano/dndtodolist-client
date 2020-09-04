import React from "react";

// Pages
import { Home } from "./pages/home-page/home.component";
import BoardPage from "./pages/board-page/board-page.component";

import { Route, Switch /* Redirect */ } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/board/:id" component={BoardPage} />
			</Switch>
		</div>
	);
}

export default App;
