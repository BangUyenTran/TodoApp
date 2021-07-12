import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";
function Task(props) {
  const {
    index,
    task,
    isEditing,
    handleChangeTaskContent,
    handleEdit,
    handleCancelEdit,
    handleChooseEditTask,
    handleDeleteTask,
    handleCheckbox,
    columnId,
  } = props;
  const isCheckbox = columnId === "td" || columnId === "ip";
  return (
    <Draggable
      index={index}
      draggableId={task && task.get("id")}
      isDragDisabled={isEditing}
    >
      {(provided) => (
        <div
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {isEditing ? (
            <div className="task__editing">
              <input
                type="text"
                className="task__editor"
                defaultValue={task.get("content")}
                onChange={handleChangeTaskContent}
              />
              <div className="task__editing-action">
                <FontAwesomeIcon
                  className="task__editing-action__icon"
                  icon="check-square"
                  onClick={handleEdit}
                />
                <FontAwesomeIcon
                  className="task__editing-action__icon"
                  icon="ban"
                  onClick={handleCancelEdit}
                />
              </div>
              <div
                className="task__editing-bgr"
                onClick={handleCancelEdit}
              ></div>
            </div>
          ) : (
            <div>
              <div className="task__time">
                <FontAwesomeIcon icon="calendar-alt" /> {task.get("time")}
              </div>
              <div className="task__main">
                {isCheckbox && (
                  <div>
                    {" "}
                    <input
                      className="task__btn__input"
                      type="checkbox"
                      onChange={(e) => handleCheckbox(e, columnId, index)}
                    />
                  </div>
                )}
                <div className="task__content">{task.get("content")}</div>
                <div className="task__action">
                  <div className="task__btn" onClick={handleChooseEditTask}>
                    <FontAwesomeIcon icon="edit" />
                  </div>
                  <div className="task__btn" onClick={handleDeleteTask}>
                    <FontAwesomeIcon icon="trash-alt" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
