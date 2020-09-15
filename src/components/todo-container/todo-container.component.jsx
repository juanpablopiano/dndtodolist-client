import React from "react";
import axios from "axios";
import { socket } from "../../App";

import "./todo-container.styles.scss";

// Components
import Todo from "../todo/todo.component";
import NewTodoForm from "../new-todo-form/new-todo-form.component";

class TodoContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			todos: [],
			creatingNew: false,
		};
	}

	async componentDidMount() {
		const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/todo/all/${this.props.id}`);
		this.setState({ todos: data });

		socket.on("new todo", (data) => {
			if (this.props.id !== data.container) return;
			const todos = [...this.state.todos];
			todos.push(data);
			this.setState({ todos: todos });
		});
	}

	handleDelete = async (id) => {
		const deletedTodoId = await axios.delete(`${process.env.REACT_APP_API_URL}/api/todo/${id}`);
		const updatedTodos = [...this.state.todos].filter((todo) => todo._id !== deletedTodoId.data);

		await axios.put(`${process.env.REACT_APP_API_URL}/api/container/${this.props.id}`, { todos: updatedTodos });

		this.setState({ todos: updatedTodos });
	};

	handleDragOver = (e) => {
		// const draggable = document.querySelector(".dragging")
		// e.target.appendChild(draggable)
	};

	render() {
		return (
			<div className="main-container">
				<div className="container-header">
					<h1>{this.props.title}</h1>
					<div className="buttons">
						<div className="add" onClick={() => this.setState({ creatingNew: !this.state.creatingNew })}>
							+
						</div>
						<div className="delete" onClick={() => this.props.handleDelete(this.props.id)}>
							✖
						</div>
					</div>
				</div>
				{this.state.creatingNew ? (
					<div>
						<NewTodoForm
							container={this.props.id}
							board={this.props.board}
							hideForm={() => this.setState({ creatingNew: false })}
						/>
					</div>
				) : null}
				<div className="todo-container" onDragOver={this.handleDragOver}>
					{this.state.todos.map((todo) => (
						<Todo key={todo._id} id={todo._id} description={todo.description} handleDelete={this.handleDelete} />
					))}
				</div>
			</div>
		);
	}
}

export default TodoContainer;
