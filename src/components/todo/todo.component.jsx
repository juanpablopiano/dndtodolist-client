import React from "react";

import "./todo.styles.scss";

const handleDrag = e => {
	e.target.classList.add("dragging")
}
const handleDragEnd = e => {
	e.target.classList.remove("dragging")
}

const Todo = (props) => (
	<div className="todo" draggable onDrag={handleDrag} onDragEnd={handleDragEnd}>
		<div>{props.description}</div>
		<div className="buttons">
			<button onClick={() => props.handleDelete(props.id)}>✖</button>
		</div>
	</div>
);

export default Todo;
