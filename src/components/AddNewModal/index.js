import React from "react";
import "./style.scss";
function AddNewModal(props) {
  const {
    selectedColumn,
    handleChangeSelectedColumn,
    taskContent,
    handleAddNewTask,
    handleChangeTaskContent,
    handleToggleModal,
  } = props;
  return (
    <div className="addNewModal">
      <div className="addNewModal__backdrop"></div>
      <div className="addNewModal__content">
        <h4 className="addNewModal__title">CREATE NEW TASK</h4>
        <div className="addNewModal__task-status">
          <span className="addNewModal__radio">
            <input
              className="addNewModal__radio__input"
              type="radio"
              checked={selectedColumn === "td"}
              onChange={() => handleChangeSelectedColumn("td")}
            />
            <span>TODO</span>
          </span>
          <span className="addNewModal__radio">
            <input
              className="addNewModal__radio__input"
              type="radio"
              checked={selectedColumn === "ip"}
              onChange={() => handleChangeSelectedColumn("ip")}
            />
            <span>IN PROGRESS</span>
          </span>
          <span className="addNewModal__radio">
            <input
              className="addNewModal__radio__input"
              type="radio"
              checked={selectedColumn === "de"}
              onChange={() => handleChangeSelectedColumn("de")}
            />
            <span>DONE</span>
          </span>
        </div>
        <div className="addNewModal__task">
          <input
            className="addNewModal__input"
            type="text"
            placeholder="Enter your task..."
            value={taskContent}
            onChange={handleChangeTaskContent}
          />
        </div>
        <div className="addNewModal__action">
          <button
            className="addNewModal__btn addNewModal__btn--confirm"
            onClick={handleAddNewTask}
          >
            Save
          </button>
          <button
            className="addNewModal__btn addNewModal__btn--cancel"
            onClick={handleToggleModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewModal;
