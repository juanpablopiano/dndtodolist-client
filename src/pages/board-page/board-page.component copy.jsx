import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
// import socketIOClient from "socket.io-client";
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
	setContainers(containersCopy);
};

const handleDelete = async id => {
	await axios.delete(`${process.env.REACT_APP_API_URL}/api/container/${id}`);
};

const BoardPage = props => {
	// const [fetching, setFetching] = useState(false);
	const [board, setBoard] = useState({});
	const [containers, setContainers] = useState([]);
	useEffect(() => {
		const { id } = props.match.params;

		const fetchBoard = async () => {
			// setFetching(true);
			const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/board/get/${id}`);
			if (!data) {
				setBoard(false);
			}
			setBoard(data);
		};
		fetchBoard();
		// setFetching(false);

		const fetchContainers = async () => {
			const containersData = await axios.get(`${process.env.REACT_APP_API_URL}/api/container/all/${id}`);
			setContainers(containersData.data);
		};
		fetchContainers();

		socket.on("new container", data => {
			const containersCopy = [...containers];
			containersCopy.push(data);
			setContainers(containersCopy);
		});

		socket.on("deleted container", async data => {
			const updatedContainers = [...containers].filter(c => c._id !== data);
			await axios.put(`${process.env.REACT_APP_API_URL}/api/board/${props.match.params.id}`, {
				containers: updatedContainers,
			});

			setContainers(updatedContainers);
		});
	}, []);

	return (
		<div>
			<Link to="/">Go back</Link>
			{board ? (
				<div>
					<div className="board-header">
						<h1>{board.name}</h1>
						<NewContainerForm position={containers.length} board={props.match.params.id} />
					</div>
					<ContainerContainer>
						<DragDropContext onDragEnd={result => onDragEnd(result, containers, setContainers)}>
							{containers.map(c => (
								<TodoContainer
									board={props.match.params.id}
									key={c._id}
									title={c.name}
									handleDelete={handleDelete}
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
};

export default BoardPage;
