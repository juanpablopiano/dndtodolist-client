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

const onDragEnd = (result, containers, setContainers) => {
	if (!result.destination) return;

	const { source, destination } = result;
	const [sourceContainer] = containers.filter(c => c._id === source.droppableId);
	const sourceTodos = [...sourceContainer.todos];
	const [removed] = sourceTodos.splice(source.index, 1);
	sourceContainer.todos = sourceTodos;

	if (source.droppableId !== destination.droppableId) {
		const [destinationContainer] = containers.filter(c => c._id === destination.droppableId);
		const destTodos = [...destinationContainer.todos];
		destTodos.splice(destination.index, 0, removed);
		destinationContainer.todos = destTodos;
	} else {
		sourceTodos.splice(destination.index, 0, removed);
	}
	const containersCopy = [...containers];
	setContainers({ containers: containersCopy });
};

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

		const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/board/get/${id}`);
		if (!data) {
			this.setState({ board: false, fetching: false });
		}
		this.setState({ board: data, fetching: false });

		const containersData = await axios.get(`${process.env.REACT_APP_API_URL}/api/container/all/${id}`);
		this.setState({ containers: containersData.data });

		socket.on("new container", data => {
			const containers = [...this.state.containers];
			containers.push(data);
			this.setState({ containers: containers });
		});

		socket.on("deleted container", async data => {
			const updatedContainers = [...this.state.containers].filter(c => c._id !== data);
			await axios.put(`${process.env.REACT_APP_API_URL}/api/board/${this.props.match.params.id}`, {
				containers: updatedContainers,
			});

			this.setState({ containers: updatedContainers });
		});
	}

	handleDelete = async id => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/api/container/${id}`);
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
							<DragDropContext
								onDragEnd={result => onDragEnd(result, this.state.containers, this.setState.bind(this))}
							>
								{this.state.containers.map(c => (
									<TodoContainer
										board={this.props.match.params.id}
										key={c._id}
										title={c.name}
										handleDelete={this.handleDelete}
										id={c._id}
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
