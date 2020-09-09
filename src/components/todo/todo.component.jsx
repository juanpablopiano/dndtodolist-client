import React from "react";

import "./todo.styles.scss";

const Todo = (props) => (
	<div className="todo">
		<div>{props.description}</div>
		<div className="buttons">
			<button onClick={() => props.handleDelete(props.id)}>✖</button>
		</div>
	</div>
);

export default Todo;
