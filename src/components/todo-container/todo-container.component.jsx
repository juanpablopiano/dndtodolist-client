import React from "react";
import axios from "axios";
import { socket } from "../../App";
import { Droppable } from "react-beautiful-dnd";

import "./todo-container.styles.scss";

// Components
import Todo from "../todo/todo.component";
import NewTodoForm from "../new-todo-form/new-todo-form.component";

class TodoContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			todos: [this.props.todos],
			creatingNew: false,
		};
	}

	async componentDidMount() {
		// const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/todo/all/${this.props.id}`);
		// this.setState({ todos: data });

		socket.on("new todo", data => {
			if (this.props.id !== data.container) return;
			const todos = [...this.state.todos];
			todos.push(data);
			this.setState({ todos: todos });
		});

		socket.on("deleted todo", async data => {
			const updatedTodos = [...this.state.todos].filter(todo => todo._id !== data);
			await axios.put(`${process.env.REACT_APP_API_URL}/api/container/${this.props.id}`, { todos: updatedTodos });
			this.setState({ todos: updatedTodos });
		});
	}

	handleDelete = async id => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/api/todo/${id}`);
	};

	render() {
		return (
			<div className="main-container">
				<div className="container-header">
					<h1>{this.props.title}</h1>
					<div className="buttons">
						<div className="add" onClick={() => this.setState({ creatingNew: !this.state.creatingNew })}>
							<span role="img" aria-label="plus-sign">
								➕
							</span>
						</div>
						<div className="delete" onClick={() => this.props.handleDelete(this.props.id)}>
							<span role="img" aria-label="x-sign">
								✖
							</span>
						</div>
					</div>
				</div>
				<Droppable key={this.props.id} droppableId={this.props.id}>
					{provided => {
						return (
							<div className="todo-container" {...provided.props} ref={provided.innerRef}>
								{this.props.todos.map((todo, index) => (
									<Todo
										key={todo._id}
										id={todo._id}
										index={index}
										description={todo.description}
										handleDelete={this.handleDelete}
									/>
								))}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
				<div>
					<NewTodoForm
						container={this.props.id}
						board={this.props.board}
						hideForm={() => this.setState({ creatingNew: false })}
					/>
				</div>
			</div>
		);
	}
}

export default TodoContainer;
