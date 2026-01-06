import React, { useEffect, useState, useRef } from 'react';
import './index.css';

const Todo = () => {
  const [Todos, setTodos] = useState([]);
  const inputTodo = useRef(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedItems);
  }, []);

  const addData = () => {
    if (!inputTodo.current.value.trim()) return; // prevent empty todos
    const newTodo = {
      id: Date.now(),
      text: inputTodo.current.value,
    };
    const updatedTodo = [...Todos, newTodo];
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
    inputTodo.current.value = ""; // clear input
  };

  const Delete = (id) => {
    const update = Todos.filter((todo) => todo.id !== id);
    setTodos(update);
    localStorage.setItem("todos", JSON.stringify(update));
  };

  return (
    <div className="container">
      <h1 className="heading">My Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          ref={inputTodo}
          placeholder="Add your task..."
        />
        <button className="add-btn" onClick={addData}>Add</button>
      </div>

      <ul className="todo-list">
        {Todos.map((t) => (
          <li key={t.id} className="todo-item">
            <span>{t.text}</span>
            <button className="delete-btn" onClick={() => Delete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
