const server = require('socket.io')();
const firstTodos = require('./data');
const firstCompleted = require('./completed');
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

const completedDB = firstCompleted.map((t) => {
    // Form new Todo objects
    return new Todo(title=t.title, id=IDtracker++ );
});


server.on('connection', (client) => {



    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB, completedDB);
    }
    const addTodo = (t) => {
        server.emit('new', t);
    }
    const completeTodo = (t) => {
        server.emit('completeTodo', t);
    }
    const removeTodo = (i) => {
        server.emit('removeTodo', i);
    }
    const removeAllTD = () => {
        server.emit('removeAllTD');
    }
    const removeAllComp = () => {
        server.emit('removeAllComp');
    }
    const completeAllTD = (C) => {
        server.emit('completeAllTD', C);
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

    client.on('remove', (i) => {
        var remTodo =  DB.map(function(t) { return t.id; }).indexOf(i.id);
        if(remTodo >= 0 ){
           DB.splice(remTodo, 1);
           removeTodo(i.id);
        }

    });

    client.on('removeComplete', (i) => {
        var remTodo =  completedDB.map(function(t) { return t.id; }).indexOf(i.id);
        if(remTodo >= 0 ){
           completedDB.splice(remTodo, 1);
           removeTodo(i.id);
        }

    });

   client.on('complete', (i) => {
     var remTodo =  DB.map(function(t) { return t.id; }).indexOf(i.id);
     if(remTodo >= 0 ){
         completedDB.push(DB[remTodo]);
         completeTodo(DB[remTodo]);
         DB.splice(remTodo, 1);

      }
    });
    client.on('removeAllTodos', () => {
      DB.splice(0, DB.length);
      removeAllTD();
    });
    client.on('removeAllCompleted', () => {
      completedDB.splice(0, completedDB.length);
      removeAllComp();
    });
    client.on('completeAllTodos', () => {
       completedDB.push.apply(DB);
       completeAllTD(DB);
       DB.splice(0, DB.length);
     });

// Send the DB downstream on connect
reloadTodos();
});




console.log('Waiting for clients to connect');
server.listen(3003);
