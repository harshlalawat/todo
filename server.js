const express = require("express");
const fs = require("fs"); 
const multer = require("multer");
const db = require('./database/db');
const todoModel = require("./database/User");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());

app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
})

app.use(express.static("public"))
app.use(express.urlencoded({extended : true}));
const upload = multer({ dest: 'public/' });
app.use(upload.single("imgURL"));


app.get("/", function(req, res){
    res.sendFile(__dirname +"/public/html/index.html");
});

app.post("/", function(req, res){
    if(req.file){
        const todo = req.body;
        console.log(JSON.stringify(todo));
        if(req.body.todoItem !== ""){
            const imgURL = req.file.filename;
            const toDo = {
                todo: todo.todoItem,
                isCompleted: false,
                imgURL: imgURL
            }
            const newtodo = new todoModel(toDo);
            newtodo.save().then();   
            res.redirect("/");
        }else{
            fs.rm("public/"+req.file.filename, function(err){
                console.log(err);
        })
    }}else{
        res.redirect("/");
    }
})

app.get("/todos", function(req, res){
    todoModel.find().then(function(todos){
        if(todos){
            res.status(200);
            res.json(todos);
        }
    })
})

app.post("/checkbox", function(req, res){
    todoModel.updateMany({todo: req.body.todo}, {isCompleted: req.body.isCompleted}).then();
    res.send();
})

app.post("/delete", function(req, res){
    todoModel.find({todo: req.body.todo}).then(function(todo){
        if(todo){
            todo.forEach((element)=>{
                fs.rm("public/"+element.imgURL, function(err){
                    if(err){
                        console.log(err);
                    }})
                })
            todoModel.deleteMany({todo: req.body.todo}).then();
            res.send();
        }})
})

app.get("*", function(req, res){
    res.sendFile(__dirname+ "/public/html/error.html");
})

db.init().then(function(){
    app.listen("3000", function(){
        console.log("server is running on port 3000");

})
})
