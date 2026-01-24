import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const inputTodo = useRef(null);

  // Load todos from localStorage
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to localStorage
  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // Add new todo
  const addTodo = () => {
    const text = inputTodo.current.value.trim();
    if (!text) return;
    const newTodo = { id: Date.now(), text, completed: false };
    saveTodos([...todos, newTodo]);
    inputTodo.current.value = "";
  };

  // Delete todo
  const deleteTodo = (id) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle complete
  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  // Edit todo
  const editTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    const newText = prompt("Edit your task:", todo.text);
    if (newText !== null && newText.trim() !== "") {
      const updatedTodos = todos.map((t) =>
        t.id === id ? { ...t, text: newText } : t
      );
      saveTodos(updatedTodos);
    }
  };

  // Clear completed todos
  const clearCompleted = () => {
    saveTodos(todos.filter((todo) => !todo.completed));
  };

  // Filter todos based on status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // all
  });

  return (
    <div className="container">
      <h1 className="heading">My Modern Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          ref={inputTodo}
          placeholder="Add your task..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active-filter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span
              className={todo.completed ? "completed" : ""}
              onClick={() => toggleComplete(todo.id)}
            >
              {todo.text}
            </span>
            <div className="todo-actions">
              <button className="edit-btn" onClick={() => editTodo(todo.id)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;