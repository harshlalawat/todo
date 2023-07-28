const newTodo = document.getElementById("newTodo");

showTodo();

newTodo.addEventListener("keypress", function(event){
    const newTodoValue = newTodo.value;
    if(event.key === "Enter"){
        event.preventDefault();
    if(newTodoValue){
        saveTodo(newTodoValue,function(err){
            if(err){
                console.log(err);
            }else{
                addTodoToDOM(newTodoValue, false);
            }
        });
        newTodo.value = "";
    }else{
        alert("Enter the Todo");
    }}
});

function saveTodo(newTodoValue, callback){
    fetch("/", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({todo : newTodoValue, isCompleted: false})})
.then(function(response){
    if(response.status == 200){
        callback();
    }else{
        callback("Something went wrong");
    }
});}

function addTodoToDOM(newTodo, isCompleted){

    const todoList = document.getElementById("todoList");
    const createLi = document.createElement("li");
    createLi.classList.add("list-item");
    todoList.appendChild(createLi);

    const parentDiv = document.createElement("div");
    parentDiv.classList.add("container", "li-parent-div");
    createLi.appendChild(parentDiv);

    const child1Div = document.createElement("div");
    child1Div.classList.add("a");
    child1Div.innerText = newTodo;
    parentDiv.appendChild(child1Div);
    
    const child2Div = document.createElement("div");
    child2Div.classList.add("b");
    parentDiv.appendChild(child2Div);

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("onclick", "handleClick(this)");
    checkbox.checked = isCompleted;
    if(isCompleted){
        child1Div.classList.add("checked-checkbox");
    }
    child2Div.appendChild(checkbox);

    const btn = document.createElement('input');
    btn.type = "button";
    btn.setAttribute("onclick", "handleDelete(this)");
    btn.name = "";
    btn.value = "x";
    child2Div.appendChild(btn);
}

function handleClick(clickedItem){
    const item = clickedItem.parentElement.parentElement.firstChild.innerText; 
    if(clickedItem.checked){
        clickedItem.parentElement.parentElement.firstChild.classList.add("checked-checkbox");

        fetch("/checkbox",
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({todo : item, isCompleted: true})
        })
        .then(function(response){
            if(response.status !== 200){
                console.log("Something went wrong in if of handle click");
            }
        })
    }
    else{
        clickedItem.parentElement.parentElement.firstChild.classList.remove("checked-checkbox");

        fetch("/checkbox",
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({todo : item, isCompleted: false})
        })
        .then(function(response){
            if(response.status !== 200){
                console.log("Something went wrong in else of handle click");
            }
        })
    }
}

function handleDelete(clickedItem){
    const item = clickedItem.parentElement.parentElement.firstChild.innerText;
    clickedItem.parentElement.parentElement.remove();
    fetch("/delete",
        {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({todo : item})
        })
        .then(function(response){
            if(response.status !== 200){
                console.log("Something went wrong in else of handle click");
            }
        })
}

function showTodo(){
    fetch("/todos")
    .then(function(response){
        if(response.status !== 200){
            throw new Error("Something went wrong in show todos");
        }
        return response.json();
    }).then(function(todos){
        todos.forEach(function(element) {
            addTodoToDOM(element.todo, element.isCompleted);
        });
    }).catch(function(err){
        alert(err);
    })

}