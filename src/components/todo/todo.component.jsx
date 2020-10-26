import React from "react";
import { Draggable } from "react-beautiful-dnd";

import "./todo.styles.scss";

const Todo = props => (
	<Draggable key={props.id} draggableId={props.id} index={props.index}>
		{provided => (
			<div
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				id={props.id}
				className="todo"
			>
				<div>{props.description}</div>
				<div className="buttons">
					<button onClick={() => props.handleDelete(props.id)}>✖</button>
				</div>
			</div>
		)}
	</Draggable>
);

export default Todo;
