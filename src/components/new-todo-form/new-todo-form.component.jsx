import React, { useState } from "react";
import axios from "axios";

import "./new-todo-form.styles.scss";

const NewTodoForm = props => {
	const [description, setDescription] = useState("");

	const handleSubmit = async e => {
		e.preventDefault();
		if (!description) return;

		const data = {
			description,
			container: props.container,
			author: "Juan pablo",
			board: props.board,
		};
		await axios.post(`${process.env.REACT_APP_API_URL}/api/todo/new`, data);

		setDescription("");
		props.hideForm();
		document.getElementById(`t-${props.container}`).focus();
	};

	return (
		<form className="todo-form">
			<label htmlFor="description">New todo:</label>
			<input
				id={`t-${props.container}`}
				type="text"
				name="description"
				value={description}
				onChange={event => setDescription(event.target.value)}
				pattern={/[^ñ]*/}
			/>
			<input type="submit" value="Create todo" onClick={handleSubmit} />
		</form>
	);
};

export default NewTodoForm;
