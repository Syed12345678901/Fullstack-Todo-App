import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await API.get("/todos/");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/todos/", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo");
    }
  };

  const handleToggle = async (todo) => {
    try {
      await API.put(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Create Todo</h2>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <h2>Your Todos</h2>
      {todos.map((todo) => (
        <div key={todo.id}>
          <h3
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </h3>
          <p>{todo.description}</p>

          <button onClick={() => handleToggle(todo)}>
            {todo.completed ? "Undo" : "Complete"}
          </button>

          <button onClick={() => handleDelete(todo.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}