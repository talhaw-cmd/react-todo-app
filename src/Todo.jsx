import React, { useState, useEffect } from "react";
import "./index.css";

const TodoApp = () => {
  // Initial state: Local storage se data uthao, agar nahi hai toh empty array []
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("my_premium_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("All");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Jab bhi 'todos' change honge, automatically local storage mein save ho jayenge
  useEffect(() => {
    localStorage.setItem("my_premium_tasks", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = { 
        id: Date.now(), 
        text: inputValue, 
        completed: false 
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue("");
    setShowInput(false);
  };

  const toggleStatus = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    setTodos(todos.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t => {
    if (filter === "Completed") return t.completed;
    if (filter === "Pending") return !t.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="date-label">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1>My Tasks</h1>
        <div className="stats">{todos.filter(t => !t.completed).length} items remaining</div>
      </header>

      <nav className="filter-nav">
        {["All", "Pending", "Completed"].map(f => (
          <button 
            key={f} 
            className={`nav-item ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </nav>

      <main className="todo-feed">
        {filtered.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? "is-done" : ""}`} onClick={() => toggleStatus(todo.id)}>
            <div className="todo-content">
              <div className="custom-check">
                {todo.completed && <span className="check-mark">✓</span>}
              </div>
              <span className="text">{todo.text}</span>
            </div>
            <button className="del-btn" onClick={(e) => deleteTodo(todo.id, e)}>
              Remove
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>Your list is clear. ✨</p>
          </div>
        )}
      </main>

      <button className="fab-btn" onClick={() => setShowInput(true)}>+</button>

      {showInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowInput(false)}>✕ Close</button>
            <form onSubmit={handleAdd}>
              <input 
                autoFocus 
                type="text" 
                placeholder="What's your next goal?" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="hint">Press <strong>Enter</strong> to save task</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;