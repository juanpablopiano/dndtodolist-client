import React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

// Components
import Board from "../../components/board/board.component";
import BoardContainer from "../../components/board-container/board-container.component";
import NewBoardForm from "../../components/new-board-form/new-board-form-component";

// Styles
import "./home.styles.scss";

let socket;

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			welcome: "Welcome Juan",
			data: [],
		};
		socket = socketIOClient(process.env.REACT_APP_API_URL);
	}

	async componentDidMount() {
		const { data } = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/board/all`
		);
		this.setState({ data: data });

		socket.on("new board", data => {
			const boards = [...this.state.data];
			boards.push(data);
			this.setState({ data: boards });
		});
	}

	handleModal() {
		console.log("turning off modal");
		this.setState({ modal: false });
	}

	render() {
		return (
			<div>
				<div className="header">
					<h1>Welcome Juan</h1>
					<button onClick={() => this.setState({ modal: true })}>
						+ Create new Board
					</button>
				</div>
				<NewBoardForm />
				<BoardContainer>
					{this.state.data.map(d => (
						<Board
							key={d._id}
							title={d.name}
							author={d.author}
							id={d._id}
						></Board>
					))}
				</BoardContainer>
			</div>
		);
	}
}

export { Home, socket };
