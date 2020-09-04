import React from "react";

import "./todo-container.styles.scss";

// Components
import Todo from "../todo/todo.component";

const TodoContainer = props => (
	<div className="main-container">
		<div className="container-header">
			<h1>{props.title}</h1>
			<div className="buttons">
				<div className="add">+</div>
				<div className="delete" onClick={() => props.handleDelete(props.id)}>✖</div>
			</div>
		</div>
		<div className="todo-container">
			<Todo>First Todo</Todo>
			<Todo>First Todo</Todo>
			<Todo>First Todo</Todo>
			<Todo>First Todo</Todo>
			<Todo>First Todo</Todo>
		</div>
	</div>
);

export default TodoContainer;
