import React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

import "./todo-container.styles.scss";

// Components
import Todo from "../todo/todo.component";
import NewTodoForm from "../new-todo-form/new-todo-form.component";

let socket;
class TodoContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			todos: [],
			creatingNew: false,
		};
		socket = socketIOClient(process.env.REACT_APP_API_URL);
	}

	async componentDidMount() {
		const { data } = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/todo/all/${this.props.id}`
		);
		this.setState({ todos: data });

		socket.on("new todo", (data) => {
			if (this.props.id !== data.container) return;
			const todos = [...this.state.todos];
			todos.push(data);
			this.setState({ todos: todos });
		});
	}
	render() {
		return (
			<div className="main-container">
				<div className="container-header">
					<h1>{this.props.title}</h1>
					<div className="buttons">
						<div
							className="add"
							onClick={() => this.setState({ creatingNew: true })}
						>
							+
						</div>
						<div
							className="delete"
							onClick={() =>
								this.props.handleDelete(this.props.id)
							}
						>
							✖
						</div>
					</div>
				</div>
				{this.state.creatingNew ? (
					<div>
						<NewTodoForm
							container={this.props.id}
							hideForm={() =>
								this.setState({ creatingNew: false })
							}
						/>
					</div>
				) : null}
				<div className="todo-container">
					{this.state.todos.map((todo) => (
						<Todo
							key={todo._id}
							id={todo._id}
							description={todo.description}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default TodoContainer;
