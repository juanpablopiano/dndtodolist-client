import React, { useState } from "react";
import axios from "axios";

const NewContainerForm = props => {
	const [name, setName] = useState("");

	const handleSubmit = async e => {
		e.preventDefault();
		if (!name) return;

		const data = {
			name,
			position: props.position,
			board: props.board,
		};
		await axios.post(
			`${process.env.REACT_APP_API_URL}/api/container/new`,
			data
		);

		setName("");
	};

	return (
		<div>
			<form>
				<label htmlFor="name">New container:</label>
				<input
					type="text"
					value={name}
					onChange={event => setName(event.target.value)}
					required
				></input>
				<input type="submit" value="Create" onClick={handleSubmit} />
			</form>
		</div>
	);
};

export default NewContainerForm;
