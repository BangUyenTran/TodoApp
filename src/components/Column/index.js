import React from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Column(props) {
  const { column, handleAddNewTask, children } = props;
  return (
    <div className="column col-xl-3 col-md-5 col-9">
      <div className="column__header">
        <div className="column__title">
          <div className="column__item-count">{column.get("tasks").size}</div>
          <div className="column__text">{column.get("title")}</div>
        </div>
        <div
          className="column__btn"
          onClick={() => handleAddNewTask(column.get("id"))}
        >
          <div>
            <FontAwesomeIcon icon="plus-square" />
          </div>
          <div>New task</div>
        </div>
      </div>
      <div className="column__content">{children}</div>
    </div>
  );
}

export default Column;
