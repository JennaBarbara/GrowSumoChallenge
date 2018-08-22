const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function remove( i ) {
  //  Emit remove todo instruction to the server
    server.emit('remove', {
        id : i
    });

}


function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    const removeItemButton = document.createElement('button');
    const buttonText = document.createTextNode("remove");
    listItem.setAttribute("id" , todo.id );
    removeItemButton.setAttribute("onclick" , "remove("+todo.id+")" );
    listItem.appendChild(listItemText);
    removeItemButton.appendChild(buttonText);
    listItem.append(removeItemButton);
    list.append(listItem);
}


function unrender(id) {
    var removeTodo = document.getElementById(id);
    removeTodo.parentNode.removeChild(removeTodo);
    console.log("removed");
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
var loadFlag = 0;
server.on('load', (todos) => {
  if(loadFlag === 0){
      todos.forEach((todo) => render(todo));
      loadFlag = 1;
  }
});

server.on('new', (todo) => {
     render(todo);
});

server.on('removeTodo', (id) => {
     console.log("remove todo");
     unrender(id);
});
