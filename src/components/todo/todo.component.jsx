import React from "react";

import "./todo.styles.scss";

const dragStart = (e) => {
	const target = e.target;
	e.dataTransfer.setData("todoId", target.id);
	target.className += " dragging";

	setTimeout(() => {
		target.style.visibility = "hidden";
	}, 0);
};
const dragEnd = (e) => {
	const target = e.target;

	target.className = target.className.replace(" dragging", "");

	setTimeout(() => {
		target.style.visibility = "visible";
	}, 0);
};
const dragOver = (e) => {
	e.stopPropagation();
};

const Todo = (props) => (
	<div id={props.id} className="todo" draggable onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragEnd}>
		<div>{props.description}</div>
		<div className="buttons">
			<button onClick={() => props.handleDelete(props.id)}>✖</button>
		</div>
	</div>
);

export default Todo;
