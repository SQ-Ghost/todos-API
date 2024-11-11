const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false },  //originally added priority field  but felt it was redundant with the change to get todo
  { id: 2, task: "Build a REST API", completed: false }
];

// GET /todos - Retrieve all to-do items
app.get('/todos', (req, res) => {
    const { completed } = req.query;

    let todosWithPriorpty = todos.map(todo => ({
    ...todo,
    priority: todo.priority || "medium"
  }));

  // filter by completed status (if provided)
  if (completed !== undefined) {
    const isCompleted = completed === "true";
    todosWithPriorpty = todosWithPriorpty.filter(todo => todo.completed === isCompleted);
  }
    res.json(todosWithPriorpty);
});


/* 
Q.3"
GET /todos - Retrieve all to-do items or filter by completed status.
after completing this part, you need to comment out the GET end point 
already implemented here to test this new GET endpoint! 
*/



// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: req.body.completed !== undefined ? req.body.completed : false,   //needed to change this to account for optional completed field
    priority: req.body.priority || "medium" // default priority is medium
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update an existing to-do item
// ***complete all endpoint*** due to routing errors could not find a way to create two separate 
// put endpoints for the same route. The complete-all emdpoint would be bypassed (I assume) so I added 
// a complete-all endpoint within the put endpoint for the id of all. It works as intended.
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;

  if(id === "all"){
    todos.forEach(todo => {
      todo.completed = true;
    });
    return res.status(200).json({message: "All todos are marked complete"});
  }
  const numericId = parseInt(id);
  const todo = todos.find(t => t.id === numericId);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  res.json(todo);
});


/*
Question 2: Implement a "Complete All" Endpoint
example usage: 
curl -X PUT http://localhost:3000/todos/complete-all
***Impelmented within the PUT endpoint for the id of all, complete-all endpoint would be bypassed.***
*/


// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
