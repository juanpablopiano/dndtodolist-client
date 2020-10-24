import React from "react";

import "./todo.styles.scss";

const handleDrag = e => {
	console.log(e);
}
const handleDragEnd = e => {
	console.log(e);
}

const Todo = (props) => (
	<div className="todo" draggable onDragStart={handleDrag} onDragEnd={handleDragEnd}>
		<div>{props.description}</div>
		<div className="buttons">
			<button onClick={() => props.handleDelete(props.id)}>✖</button>
		</div>
	</div>
);

export default Todo;
