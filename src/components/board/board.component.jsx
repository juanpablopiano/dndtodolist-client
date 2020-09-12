import React from "react";
import { Link } from "react-router-dom";

// styles
import "./board.styles.scss";

const Board = (props) => (
	<div className="board">
		<Link as="div" to={`/board/${props.id}`}>
			<div>
				<h1>{props.title}</h1>
				<p>{props.author}</p>
			</div>
		</Link>
		<button onClick={() => props.handleDelete()}>x</button>
	</div>
);

export default Board;
