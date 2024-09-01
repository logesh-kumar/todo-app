import { useState, useEffect } from "react";
import "./App.css";

// eslint-disable-next-line no-undef
const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = () => {
    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add task");
        }
      })
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error:", error));
  };

  const toggleComplete = (task) => {
    fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((response) => {
        if (response.ok) {
          setTasks(
            tasks.map((t) =>
              t.id === task.id ? { ...t, completed: !t.completed } : t
            )
          );
        } else {
          throw new Error("Failed to update task");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Todo app</h1>
      <div className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="task-button" onClick={addTask}>
          Add Task
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <h2
                className={`task-title ${
                  task.completed ? "task-completed" : ""
                }`}
              >
                {task.title}
              </h2>
            </div>
            <div className="task-actions">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <button
                className="task-delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
