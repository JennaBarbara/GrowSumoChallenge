const server = io('http://localhost:3003/');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    //TODO add alert if string empty
    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';

    document.getElementById('todo-input').focus();

}

function remove( i ) {
  //  Emit remove todo instruction to the server
    server.emit('remove', {
        id : i
    });

}

function removeComplete( i ) {
  //  Emit remove todo instruction to the server
    server.emit('removeComplete', {
        id : i
    });

}

function complete( i ) {
  //  Emit remove todo instruction to the server
  server.emit('complete', {
      id : i
  });
}

function completeAllTodos() {
  server.emit('completeAllTodos');
}

function removeAllTodos() {
  server.emit('removeAllTodos');
}
function removeAllCompleted() {
  server.emit('removeAllCompleted');
}


function renderTask(todo) {

    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    //create remove button
    const removeItemButton = document.createElement('button');
    const removebuttonText = document.createTextNode("Delete");
    removeItemButton.appendChild(removebuttonText);
    removeItemButton.setAttribute("onclick" , "remove("+todo.id+")" );
    //create complete button
    const completeItemButton = document.createElement('button');
    const completebuttonText = document.createTextNode("Complete");
    completeItemButton.appendChild( completebuttonText );
    completeItemButton.setAttribute("onclick" , "complete("+todo.id+")" );

    listItem.setAttribute("id" , todo.id );
    listItem.appendChild(listItemText);

    listItem.append(removeItemButton);
    listItem.append(completeItemButton);
    todoList.append(listItem);
}



function renderComplete(todo) {
  const listItem = document.createElement('li');
  const listItemText = document.createTextNode(todo.title);
  //create remove button
  const removeItemButton = document.createElement('button');
  const removebuttonText = document.createTextNode("Delete");
  removeItemButton.appendChild(removebuttonText);
  removeItemButton.setAttribute("onclick" , "removeComplete("+todo.id+")" );


  listItem.setAttribute("id" , todo.id );
  listItem.appendChild(listItemText);
  listItem.append(removeItemButton);

  completedList.append(listItem);

}


function unrenderTask(id) {
    var removeTodo = document.getElementById(id);
    removeTodo.parentNode.removeChild(removeTodo);
    console.log("removed");
}

function removeAllTD() {
  while(todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
}

function removeAllComp() {
  while(completedList.firstChild) {
    completedList.removeChild(completedList.firstChild);
  }

}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
var loadFlag = 0;
server.on('load', (todos, completed) => {
  if(loadFlag === 0){
      todos.forEach((todo) => renderTask(todo));
      completed.forEach((complete) => renderComplete(complete));
      loadFlag = 1;
  }
});

server.on('new', (todo) => {
     renderTask(todo);
});

server.on('completeTodo', (complete) => {
     console.log('completeTodo');
     unrenderTask(complete.id);
     renderComplete(complete);
});
server.on('removeTodo', (id) => {
     console.log('removeTodo');
     unrenderTask(id);
});
server.on('removeCompleted', (id) => {
     unrenderTask(id);
});
server.on('removeAllTD', () => {
     removeAllTD();
});
server.on('removeAllComp', () => {
     removeAllComp();
});
server.on('completeAllTD', (completed) => {
   removeAllTD();
   completed.forEach((complete) => renderComplete(complete));
});
