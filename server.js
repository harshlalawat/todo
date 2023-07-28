const express = require("express");
const fs = require("fs");

const app = express();


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
    const todo = req.body;
    saveTodos(todo, function(err, todos){
        if(err){
            res.status(500);
            res.json({error: err});
        }else{
            res.status(200);
            res.json(req.body);
        }
    })
    // todos.push(req.body);
    // res.status(200);
    // res.send();
})

app.get("/todos", function(req, res){
    getTodos(function(err, todos){
        if(err){
            res.status(500);
            res.json({error: err})
        }else{
            res.status(200);
            res.json(todos);
        }
    })
})

app.post("/checkbox", function(req, res){
    changeTodos(req.body.todo, req.body.isCompleted, function(err){
        if(err){
            res.status(500);
            res.send();
        }else{
            res.status(200);
            res.send();
        }
    })
})

app.post("/delete", function(req, res){
    deleteTodos(req.body.todo, function(err){
        if(err){
            res.status(500);
            res.send();
        }else{
            res.status(200);
            res.send();
        }
    })
    // todos = todos.filter(function(element){
    //     return element.todo !== req.body.todo;
    // });
    // res.status(200);
    // res.send();
})

app.get("*", function(req, res){
    res.sendFile(__dirname+ "/public/error.html");
})


app.listen("3000", function(){
    console.log("server is running on port 3000");
})

function getTodos(callback){
    fs.readFile("./data.txt", "utf-8", function(err, data){
        if(err){
            callback(err);
        }else{
            if(data.length === 0){
                data = "[]";
            }
            try{
                let todos = JSON.parse(data);
                callback(null, todos);
            }
            catch(er){
                callback(null, []);
            }
        }
    })
}

function saveTodos(todo, callback){
    console.log(todo);
    getTodos(function(err, todos){
        if(err){
            callback(err);
        }else{
            todos.push(todo);
            fs.writeFile("./data.txt", JSON.stringify(todos), function(error){
                if(error){
                    callback(error, todos);
                }else{
                    callback(null, todos)
                }
            })
        }
    })
}

function changeTodos(todoText, isCompleted, callback){
    getTodos(function(err, todos){
        if(err){
            callback(err);
        }else{
            todos = todos.filter(function(element){
                if(element.todo === todoText){
                    element.isCompleted = isCompleted;
                }
                return element;
            })
            fs.writeFile("./data.txt", JSON.stringify(todos), function(error){
                if(error){
                    callback(error);
                }
            })
        }
    })
}

function deleteTodos(todoText, callback){
    getTodos(function(err, todos){
        if(err){
            callback(err);
        }else{
            todos = todos.filter(function(element){
                return element.todo !== todoText;
            })
            fs.writeFile("./data.txt", JSON.stringify(todos), function(error){
                if(error){
                    callback(error);
                }
            })
        }
    })
}
