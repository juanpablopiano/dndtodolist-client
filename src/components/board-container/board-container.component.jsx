import React from "react";
import "./board-container.styles.scss";

const BoardContainer = props => (
	<div className="board-container">{props.children}</div>
);

export default BoardContainer;
