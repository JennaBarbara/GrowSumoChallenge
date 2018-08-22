const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');


var IDtracker = 0;

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
// FIXME: DB is reloading on client refresh. It should be persistent on new client
// connections from the last time the server was run...
const DB = firstTodos.map((t) => {
    // Form new Todo objects
    return new Todo(title=t.title, id=IDtracker++ );
});




server.on('connection', (client) => {



    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }
    const addTodo = (t) => {
        server.emit('new', t);
    }
    const removeTodo = (t) => {
        server.emit('delete', t);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title, id=IDtracker++);
      
        // Push this newly created todo to our database
        DB.push(newTodo);
        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        addTodo(newTodo);
    });

    // Send the DB downstream on connect
    reloadTodos();
});





console.log('Waiting for clients to connect');
server.listen(3003);
