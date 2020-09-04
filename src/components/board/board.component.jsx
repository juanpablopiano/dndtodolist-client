import React from "react";
import { Link } from "react-router-dom";

// styles
import "./board.styles.scss";

const Board = props => (
	<Link to={`/board/${props.id}`} className="board">
		<h1>{props.title}</h1>
		<p>{props.author}</p>
	</Link>
);

export default Board;
