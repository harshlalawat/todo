const express = require("express");

const app = express();

let todos = [];

app.use(express.json());

app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
})

app.get("/", function(req, res){
    res.sendFile(__dirname +"/public/index.html");
});

app.get("/css/styles.css",function(req, res){
    res.sendFile(__dirname +"/public/css/styles.css");
})

app.get("/todo.js",function(req, res){
    res.sendFile(__dirname +"/public/todo.js");
})

app.post("/", function(req, res){
    todos.push(req.body);
    res.status(200);
    res.send();
})

app.get("/todos", function(req, res){
    res.json(todos);
})

app.post("/checkbox", function(req, res){
    todos = todos.map(function(element){
        if(element.todo === req.body.todo){
            element.isCompleted = req.body.isCompleted;
        }
        return element;
    });
    res.status(200);
    res.send();
})

app.post("/delete", function(req, res){
    todos = todos.filter(function(element){
        return element.todo !== req.body.todo;
    });
    res.status(200);
    res.send();
})

app.get("*", function(req, res){
    res.sendFile(__dirname+ "/public/error.html");
})


app.listen("3000", function(){
    console.log("server is running on port 3000");
})
