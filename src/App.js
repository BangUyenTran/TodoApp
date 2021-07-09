import { useEffect, useState } from "react";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Column from "./components/Column";
import Task from "./components/Task";
import AddNewModal from "./components/AddNewModal";
import v1 from "uuid/dist/v1";
import "./App.scss";

function App() {
  const [columns, setColumns] = useState(
    fromJS([
      { id: "td", title: "TO DO", tasks: [] },
      { id: "ip", title: "IN PROGRESS", tasks: [] },
      { id: "de", title: "DONE", tasks: [] },
    ])
  );
  const [displayModal, setDisplayModal] = useState(false);
  const [editColumnIndex, setEditColumnIndex] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [editTaskIndex, seteditTaskIndex] = useState(null);
  const [editTaskId, seteditTaskId] = useState(null);
  const [selectedColumn, setselectedColumn] = useState(null);

  useEffect(() => {
    const columns = localStorage.getItem("columns");
    if (columns) {
      setColumns(fromJS(JSON.parse(columns)));
    }
  }, []);

  const handleToggleModal = (choosenColumn = "") => {
    setDisplayModal(!displayModal);
    setEditColumnIndex(choosenColumn);
  };

  const handleChangeTaskContent = (e) => {
    setTaskContent(e.target.value);
  };

  const handleChangeeditingColumnIndex = (editingColumnIndex) =>
    setEditColumnIndex(editingColumnIndex);

  const handleAddNewTask = () => {
    if (taskContent.trim() === "") {
      toastr.warning("Please enter your task", "Notice", { timeOut: 2000 });
    } else {
      const newTask = fromJS({
        id: v1(),
        content: taskContent,
        time: new Date().toLocaleString(),
      });
      const columnIndex = columns.findIndex((column) => {
        return column.get("id") === selectedColumn;
      });
      const updatedColumn = columns.updateIn([columnIndex, "tasks"], (tasks) =>
        tasks.push(newTask)
      );
      setColumns(fromJS(updatedColumn));
      setDisplayModal(false);
      setTaskContent("");
      setEditColumnIndex("");
      setselectedColumn(null);
      localStorage.setItem("columns", JSON.stringify(updatedColumn.toJS()));
    }
  };

  const handleDeleteTask = (columnIndex, taskIndex) => () => {
    const result = window.confirm("Are your sure to delete this task?");
    if (result) {
      const updatedColumn = columns.updateIn([columnIndex, "tasks"], (tasks) =>
        tasks.remove(taskIndex)
      );
      setColumns(fromJS(updatedColumn));
      localStorage.setItem("columns", JSON.stringify(updatedColumn.toJS()));
      toastr.success("Delete task success", "Notice", { timeOut: 2000 });
    }
  };

  const handleChooseEditTask = (columnIndex, taskIndex, taskId) => {
    setEditColumnIndex(columnIndex);
    seteditTaskId(taskId);
    seteditTaskIndex(taskIndex);
  };

  const handleChangeSelectedColumn = (selectedColumn) => {
    setselectedColumn(selectedColumn);
  };
  const handleEdit = () => {
    const updatedColumn = columns.updateIn(
      [editColumnIndex, "tasks"],
      (tasks) => tasks.setIn([editTaskIndex, "content"], taskContent)
    );
    setColumns(fromJS(updatedColumn));
    seteditTaskId(null);
    localStorage.setItem("columns", JSON.stringify(updatedColumn.toJS()));
  };

  const handleCancelEdit = () => {
    seteditTaskId(null);
  };

  const handleCheckbox = (e, targetColumnId, targetTask) => {
    const targetColumnIndex = columns.findIndex(
      (column) => column.get("id") === targetColumnId
    );
    let updateColumnDone = columns.updateIn(
      [targetColumnIndex, "tasks"],
      (task) => task.remove(targetTask)
    );
    const taskDone = columns.getIn([targetColumnIndex, "tasks", targetTask]);
    updateColumnDone = updateColumnDone.updateIn([2, "tasks"], (task) =>
      task.push(taskDone)
    );
    setColumns(updateColumnDone);
    localStorage.setItem("columns", JSON.stringify(updateColumnDone.toJS()));
  };

  const handleSaveDrag = (result) => {
    const { source, destination, reason } = result;
    if (reason === "DROP" && destination) {
      const sourceColumnIndex = columns.findIndex(
        (column) => column.get("id") === source.droppableId
      );
      const task = columns.getIn([sourceColumnIndex, "tasks", source.index]);
      let updatedColumn = columns.updateIn(
        [sourceColumnIndex, "tasks"],
        (tasks) => tasks.remove(source.index)
      );
      const destinationColumnIndex = columns.findIndex(
        (column) => column.get("id") === destination.droppableId
      );
      updatedColumn = updatedColumn.updateIn(
        [destinationColumnIndex, "tasks"],
        (tasks) => tasks.insert(destination.index, task)
      );
      setColumns(fromJS(updatedColumn));
      localStorage.setItem("columns", JSON.stringify(updatedColumn.toJS()));
    }
  };

  return (
    <div className="App">
      <h1 className="App__title">TO DO LIST</h1>
      <DragDropContext onDragEnd={handleSaveDrag}>
        {
          <div className="App__content">
            {columns.map((column, columnIndex) => (
              <Column
                key={column.get("id")}
                column={column}
                handleAddNewTask={handleToggleModal}
              >
                <Droppable droppableId={column.get("id")}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: "300px" }}
                    >
                      {column.get("tasks").map((task, taskIndex) => (
                        <Task
                          key={task.get("id")}
                          index={taskIndex}
                          columnId={column.get("id")}
                          isEditing={task.get("id") === editTaskId}
                          handleChangeTaskContent={handleChangeTaskContent}
                          task={task}
                          handleEdit={handleEdit}
                          handleCancelEdit={handleCancelEdit}
                          handleChooseEditTask={() =>
                            handleChooseEditTask(
                              columnIndex,
                              taskIndex,
                              task.get("id")
                            )
                          }
                          handleDeleteTask={handleDeleteTask(
                            columnIndex,
                            taskIndex
                          )}
                          handleCheckbox={handleCheckbox}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Column>
            ))}
          </div>
        }
      </DragDropContext>
      {displayModal && (
        <AddNewModal
          editingColumnIndex={editColumnIndex}
          taskContent={taskContent}
          handleChangeTaskContent={handleChangeTaskContent}
          handleChangeeditingColumnIndex={handleChangeeditingColumnIndex}
          handleAddNewTask={handleAddNewTask}
          handleToggleModal={handleToggleModal}
          selectedColumn={selectedColumn}
          handleChangeSelectedColumn={handleChangeSelectedColumn}
        />
      )}
    </div>
  );
}

export default App;
