require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// Create a pool connection to MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

// Get all todos
app.get("/tasks", (req, res) => {
  db.execute("SELECT * FROM tasks")
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });
});

// Create a new todo
app.post("/tasks", (req, res) => {
  const task = req.body;

  db.execute(
    `INSERT INTO tasks (title, completed) 
    VALUES (?, ?)`,
    [task.title, task.completed]
  )
    .then(([result]) => {
      // result.insertId contains the ID of the newly inserted row
      const newTask = {
        id: result.insertId,
        title: task.title,
        description: task.description, // if you want to include a description
        completed: task.completed,
      };
      res.status(201).json(newTask);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving a task");
    });
});

// Update a todo
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  db.execute(
    `UPDATE tasks SET  
    title = ?,
    completed = ?
    WHERE id = ?`,
    [title, completed, id]
  )
    .then(() => {
      res.status(200).send("Task updated");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating a task");
    });
});

// Delete a todo
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.execute("DELETE FROM tasks WHERE id = ?", [id])
    .then(() => {
      res.status(200).send("Task deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a task");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
