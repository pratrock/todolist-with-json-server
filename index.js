//console.log("hello world")

/* 
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)


*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

const APIs = (() => {
  const createTodo = (newTodo) => {
    return fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  const deleteTodo = (id) => {
    return fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const completeTodo = (todo, id, status) => {
    return fetch("http://localhost:3000/todos/" + id, {
      method: "PUT",
      body: JSON.stringify({ content: todo.content, completed: status }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  const getTodos = () => {
    return fetch("http://localhost:3000/todos").then((res) => res.json());
  };

  return { createTodo, deleteTodo, getTodos, completeTodo };
})();

//IIFE
//todos
/* 
    hashMap: faster to search
    array: easier to iterate, has order


*/

const Model = (() => {
  class State {
    #todos; //private field
    #onChange; //function, will be called when setter function todos is called
    constructor() {
      this.#todos = [];
    }
    get todos() {
      return this.#todos;
    }
    set todos(newTodos) {
      // reassign value
      console.log("setter function");
      this.#todos = newTodos;
      this.#onChange?.(); // rendering
    }

    subscribe(callback) {
      //subscribe to the change of the state todos
      this.#onChange = callback;
    }
  }
  const { getTodos, createTodo, deleteTodo, completeTodo } = APIs;
  return {
    State,
    getTodos,
    createTodo,
    deleteTodo,
    completeTodo,
  };
})();
/* 
    todos = [
        {
            id:1,
            content:"eat lunch"
        },
        {
            id:2,
            content:"eat breakfast"
        }
    ]

*/
const View = (() => {
  const todolistEl = document.querySelector(".todo-list");
  const submitBtnEl = document.querySelector(".submit-btn");
  const inputEl = document.querySelector(".input");
  const completedList = document.querySelector(".completed-list");
  const renderTodos = (todos) => {
    if (todos.length === 0) {
      todolistEl.innerHTML = "<h4>no task to display!</h4>";
    }
    let todosTemplate = "";
    let completedTemplate = "";
    todos.forEach((todo) => {
      if (todo.completed === true) {
        const liTemplate = `
       
        <li listid=${todo.id}>
        <button class="move-left-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg></button>
        <span class="todo-text">${todo.content}</span>
        <button class="edit-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
        <button class="delete-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
   
        </li>`;
        completedTemplate += liTemplate;
      } else {
        const liTemplate = `<li listid=${todo.id}><span class="todo-text">${todo.content}</span>
        <button class="edit-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
        <button class="delete-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
        <button class="move-right-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg></button>
        </li>`;
        todosTemplate += liTemplate;
      }
    });

    if (!todosTemplate) {
      todosTemplate = "<h4>No pending Tasks</h4>";
    }
    if (!completedTemplate) {
      completedTemplate = "<h4></h4>";
    }

    todolistEl.innerHTML = todosTemplate;
    completedList.innerHTML = completedTemplate;
  };

  const clearInput = () => {
    inputEl.value = "";
  };

  return {
    renderTodos,
    submitBtnEl,
    inputEl,
    clearInput,
    todolistEl,
    completedList,
  };
})();

const Controller = ((view, model) => {
  const state = new model.State();
  const init = () => {
    model.getTodos().then((todos) => {
      todos.reverse();
      state.todos = todos;
    });
  };

  const handleSubmit = () => {
    view.submitBtnEl.addEventListener("click", (event) => {
      /* 
                1. read the value from input
                2. post request
                3. update view
            */
      const inputValue = view.inputEl.value;
      console.log(inputValue);
      model
        .createTodo({ content: inputValue, completed: false })
        .then((data) => {
          state.todos = [data, ...state.todos];
          view.clearInput();
        });
    });
  };

  const handleDelete = () => {
    //event bubbling
    /* 
            1. get id
            2. make delete request
            3. update view, remove
        */

    console.log("work");
    view.todolistEl.addEventListener("click", (event) => {
      if (event.target.className === "delete-btn") {
        const id = event.target.id;
        console.log("id", typeof id);
        model.deleteTodo(+id).then((data) => {
          state.todos = state.todos.filter((todo) => todo.id !== +id);
        });
      }
    });
    view.completedList.addEventListener("click", (event) => {
      if (event.target.className === "delete-btn") {
        const id = event.target.id;
        console.log("id", typeof id);
        model.deleteTodo(+id).then((data) => {
          state.todos = state.todos.filter((todo) => todo.id !== +id);
        });
      }
    });
  };

  const handleRight = () => {
    view.todolistEl.addEventListener("click", (event) => {
      // Check if the clicked element is move right button
      if (event.target.className === "move-right-btn") {
        // Get the corresponding todo item's id
        let id = event.target.parentNode.getAttribute("listid");
        //get the particular content that you want to move to the right
        const [content] = state.todos.filter((todo) => todo.id === +id);
        //call the model function
        model.completeTodo(content, +id, true);
      }
    });
  };

  const handleLeft = () => {
    view.completedList.addEventListener("click", (event) => {
      // Check if the clicked element is move left button
      if (event.target.className === "move-left-btn") {
        // Get the corresponding todo item's id
        let id = event.target.parentNode.getAttribute("listid");
        //get the particular content that you want to move to the left
        const [content] = state.todos.filter((todo) => todo.id === +id);
        //call the model function
        model.completeTodo(content, +id, false);
      }
    });
  };

  const handleEdit = () => {
    view.todolistEl.addEventListener("click", (event) => {
      // Check if the clicked element is an edit button
      if (event.target.className === "edit-btn") {
        // Get the corresponding todo item's id
        const id = event.target.parentNode.getAttribute("listid");

        // Get the corresponding todo text element
        const todoTextElement =
          event.target.parentNode.querySelector(".todo-text");

        // Convert the todo text span to editable form
        todoTextElement.contentEditable = true;
        todoTextElement.focus();

        // Add a click event listener to a save button
        const editButton = event.target.parentNode.querySelector(".edit-btn");
        editButton.addEventListener("click", (event) => {
          // Get the edited todo text
          let editedTodoText = todoTextElement.textContent;

          // Call the model function to complete the todo with edited text
          model.completeTodo({ content: editedTodoText }, +id, false);

          // Set the todo text element back to non-editable form
          todoTextElement.contentEditable = false;
        });
      }
    });
  };

  const handleCompletedEdit = () => {
    // Add a single event listener to the parent element
    view.completedList.addEventListener("click", (event) => {
      // Check if the clicked element is an edit button
      if (event.target.className === "edit-btn") {
        // Get the corresponding todo item's id
        const id = event.target.parentNode.getAttribute("listid");

        // Get the corresponding todo text element
        const todoTextElement =
          event.target.parentNode.querySelector(".todo-text");

        // Convert the todo text span to editable form
        todoTextElement.contentEditable = true;
        todoTextElement.focus();

        // Add a click event listener to a save button
        const editButton = event.target.parentNode.querySelector(".edit-btn");
        editButton.addEventListener("click", (event) => {
          // Get the edited todo text
          let editedTodoText = todoTextElement.textContent;

          // Call the model function to complete the todo with edited text
          model.completeTodo({ content: editedTodoText }, +id, true);

          // Set the todo text element back to non-editable form
          todoTextElement.contentEditable = false;
        });
      }
    });
  };

  const bootstrap = () => {
    init();
    handleSubmit();
    handleDelete();
    handleRight();
    handleLeft();
    handleEdit();
    handleCompletedEdit();
    state.subscribe(() => {
      view.renderTodos(state.todos);
    });
  };
  return {
    bootstrap,
  };
})(View, Model); //ViewModel

Controller.bootstrap();
