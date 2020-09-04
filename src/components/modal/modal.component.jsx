import React from "react";

// components
import Backdrop from "../backdrop/backdrop.component";

// Styles
import "./modal.styles.scss";

const Modal = props => (
	<div>
		<Backdrop />
        <div className="modal-container">
			<div className="modal">{props.children}</div>
		</div>
	</div>
);

export default Modal;
