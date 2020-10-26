import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { socket } from "../../App";

// styles
import "./board-page.styles.scss";

// Components
import ContainerContainer from "../../components/cont-container/cont-container.component";
import TodoContainer from "../../components/todo-container/todo-container.component";
import NewContainerForm from "../../components/new-container-form/new-container-form-component";

class BoardPage extends React.Component {
	constructor() {
		super();
		this.state = {
			fetching: false,
			board: {},
			containers: [],
		};
	}
	async componentDidMount() {
		this.setState({ fetching: true });
		const { id } = this.props.match.params;

		// Bring the data of the board
		const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/board/get/${id}`);
		if (!data) {
			this.setState({ board: false, fetching: false });
		}
		this.setState({ board: data, fetching: false });

		// Bring the data of the containers pertaining the board
		const containersData = await axios.get(`${process.env.REACT_APP_API_URL}/api/container/all/full/${id}`);

		// bring the data of the todos pertaining this board too
		const todos = await axios.get(`${process.env.REACT_APP_API_URL}/api/todo/all/board/${this.props.match.params.id}`);

		// arrange the data of the todos inside the containers state
		containersData.data.forEach(c => {
			c.todos = todos.data.filter(t => t.container === c._id);
		});
		this.setState({ containers: containersData.data });

		// Socket for when a new container is introduced
		socket.on("new container", data => {
			const containers = [...this.state.containers];
			containers.push(data);
			this.setState({ containers: containers });
		});

		// Socket for when a container is deleted
		socket.on("deleted container", async data => {
			const updatedContainers = [...this.state.containers].filter(c => c._id !== data);
			await axios.put(`${process.env.REACT_APP_API_URL}/api/board/${this.props.match.params.id}`, {
				containers: updatedContainers,
			});

			this.setState({ containers: updatedContainers });
		});

		// Socket for when a todo is created
		socket.on("new todo", data => {
			const containersCopy = [...this.state.containers].map(c => {
				if (c._id !== data.container) return c;
				c.todos.push(data);
				return c;
			});
			this.setState({ containers: containersCopy });
		});

		// Socket for when a todo is deleted
		socket.on("deleted todo", async data => {
			const [container] = [...this.state.containers].filter(c => c._id === data.container);
			const updatedTodos = container.todos.filter(t => t._id !== data._id);

			await axios.put(`${process.env.REACT_APP_API_URL}/api/container/${data.container}`, { todos: updatedTodos });

			const containersCopy = [...this.state.containers].map(c => {
				if (c._id !== data.container) return c;
				c.todos = updatedTodos;
				return c;
			});
			this.setState({ containers: containersCopy });
		});
	}

	handleDelete = async id => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/api/container/${id}`);
	};

	// Function for handling the drop event
	onDragEnd = result => {
		if (!result.destination) return;
		const { source, destination } = result;
		const containersCopy1 = [...this.state.containers];
		const [sourceContainer] = containersCopy1.filter(c => c._id === source.droppableId);
		const sourceTodos = [...sourceContainer.todos];
		const [removed] = sourceTodos.splice(source.index, 1);
		sourceContainer.todos = sourceTodos;

		if (source.droppableId !== destination.droppableId) {
			const [destinationContainer] = containersCopy1.filter(c => c._id === destination.droppableId);
			const destTodos = [...destinationContainer.todos];
			destTodos.splice(destination.index, 0, removed);
			destinationContainer.todos = destTodos;
		} else {
			sourceTodos.splice(destination.index, 0, removed);
		}
		const containersCopy = [...this.state.containers];
		this.setState({ containers: containersCopy });
	};

	render() {
		return (
			<div>
				<Link to="/">Go back</Link>
				{this.state.board ? (
					<div>
						<div className="board-header">
							<h1>{this.state.board.name}</h1>
							<NewContainerForm position={this.state.containers.length} board={this.props.match.params.id} />
						</div>
						<ContainerContainer>
							<DragDropContext onDragEnd={result => this.onDragEnd(result)}>
								{this.state.containers.map(c => (
									<TodoContainer
										board={this.props.match.params.id}
										key={c._id}
										title={c.name}
										handleDelete={this.handleDelete}
										id={c._id}
										todos={c.todos}
									/>
								))}
							</DragDropContext>
						</ContainerContainer>
					</div>
				) : (
					<h1>This board doesn't exist</h1>
				)}
			</div>
		);
	}
}

export default BoardPage;
