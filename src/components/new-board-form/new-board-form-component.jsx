import React, { useState } from "react";
import axios from "axios";

const NewBoardForm = () => {
	const [name, setName] = useState("");
	const [author, setAuthor] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = async e => {
		e.preventDefault();
		if (!name || !author || !description) return;

		const data = {
			name,
			author,
			description,
		};

		await axios.post(
			`${process.env.REACT_APP_API_URL}/api/board/new`,
			data
		);

		setName("");
		setAuthor("");
		setDescription("");
	};

	return (
		<div>
			<form>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					value={name}
					onChange={event => setName(event.target.value)}
					required
				></input>

				<label htmlFor="author">Author:</label>
				<input
					type="text"
					value={author}
					onChange={event => setAuthor(event.target.value)}
					required
				></input>
				<label htmlFor="description">Description:</label>
				<input
					type="text"
					value={description}
					onChange={event => setDescription(event.target.value)}
					required
				></input>
				<input type="submit" onClick={handleSubmit} />
			</form>
		</div>
	);
};

export default NewBoardForm;
