import React, { useState, useEffect } from "react";
import "./index.css";

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("my_clean_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("All");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("my_clean_tasks", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
    setInputValue("");
    setShowInput(false);
  };

  const toggleStatus = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation(); // Yeh line sabse important hai
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
          <div key={todo.id} className={`todo-item ${todo.completed ? "is-done" : ""}`}>
            {/* Clickable area for status toggle */}
            <div className="todo-content" onClick={() => toggleStatus(todo.id)}>
              <div className="custom-check">
                {todo.completed && <span className="check-mark">✓</span>}
              </div>
              <span className="text">{todo.text}</span>
            </div>
            
            {/* Independent button for delete */}
            <button className="del-btn" onClick={(e) => deleteTodo(todo.id, e)}>
              Remove
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No tasks found.</div>}
      </main>

      {!showInput && <button className="fab-btn" onClick={() => setShowInput(true)}>+</button>}

      {showInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowInput(false)}>✕ Close</button>
            <form onSubmit={handleAdd}>
              <input 
                autoFocus 
                type="text" 
                placeholder="What's next?" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="hint">Press Enter to save</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;