const express = require('express');
var fs = require('fs');
const app = express();
const path = require('path');

const model = require("./businessLogic.js");
const gameModel = require("./game.json");
//const requestingUser = model.users["deadman"];
app.use(express.json());

const session = require('express-session')
app.use(session({ secret: 'some secret here' }))
app.use(express.urlencoded({ extended: true }));



app.use("/", function(req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        console.log("Request from user: " + req.session.user.username);
    } else {
        console.log("not logged in");

    }
    /* console.log("Request from user: " + req.session.user ? req.session.user.username : "Not logged in"); */
    next();
});
app.use(express.static("public"))



//Logging in
app.post("/login", function(req, res, next) {
    if (model.login(req.body.username, req.body.password)) {
        //they have logged in successfully
        req.session.user = model.users[req.body.username];
        res.redirect("/users/" + req.body.username);

        //res.status(200).send("logged in");
    } else {
        //they did not log in successfully.
        res.status(401).send("Invalid credentials.");

    }
})


app.get("/logout", function(req, res, next) {
    if (req.session.user) {
        req.session.user = null;
        res.redirect('/');
    } else {
        res.status(200).send("login first");
    }

})




//Creating a new user
app.post("/users", function(req, res, next) {
    console.log(req.body);

    let result = model.createUser(req.body);
    console.log(result);
    if (result) {
        req.session.user = model.login(req.body.username, req.body.password);
        res.status(200); //.send("User added: " + JSON.stringify(result));
        res.redirect("/users/" + req.body.username);

    } else {
        let error = "Username already exists";
        res.status(500)
            //alert("Username already exists, please try another username.");
            //res.render("SignUp", { error });
        res.format({
            html: function() {
                res.render('SignUp', { error });
            },
            json: function() {
                res.send(error);
            }
        });
        //.send("Failed to add user.");
    }
    // console.log(req.body);
    // console.log(result);
})

//Searching for users
app.get("/users", function(req, res, next) {
    console.log("Searching users for: " + req.query.name);

    let result = model.searchUsers(req.session.user, req.query.name);
    //res.status(200).json(result);
    //res.redirect("/search")
    console.log(result);
    //res.render("search", { results: result });
    res.format({
        html: function() {
            res.render('search', { results: result });
        },
        json: function() {
            res.send({ results: result });
        }
    });
})


//Getting a user
app.get("/users/:uid", function(req, res, next) {
    //console.log("Getting user with name: " + req.params.uid);
    let result = model.getOtherUser(req.session.user, req.params.uid);
    if (result == null) {
        res.status(404).send("Unknown user");
    } else {
        res.status(200)
        if (req.session.user.username == req.params.uid) {
            //res.render("userProfile", { result });
            res.format({
                html: function() {
                    res.render('userProfile', { result });
                },
                json: function() {
                    res.send(result);
                }
            });

        } else {
            //res.render("viewProfile", { result });
            res.format({
                html: function() {
                    res.render('viewProfile', { result });
                },
                json: function() {
                    res.send(result);
                }
            });
        }



    }
})

//Sending a friend request
app.post("/users/:uid/requests", function(req, res, next) {

    //console.log("sending friend request from" + requestingUser.username+ "to"+req.params.uid)
    let k = model.requestFriend(model.users[req.session.user.username], model.users[req.params.uid]);
    if (k == -1) {
        res.status(404).send("Requesting friend failed");

    } else {
        res.status(200) //.send("friend request sent. " + JSON.stringify(req.session.user));
        let result = model.users[req.session.user.username];
        req.session.user = result;
        //res.render("userProfile", { result });
        res.format({
            html: function() {
                res.render('userProfile', { result });
            },
            json: function() {
                res.send(result);
            }
        });
    }
})


//Adding a friend
app.post("/users/:uid/friends/:reqid", function(req, res, next) {
    console.log("Adding friends testtttttt!");
    console.log(req.session.user);
    console.log(req.params.reqid);
    let k = model.addFriend(model.users[req.session.user.username], model.users[req.params.reqid]);
    if (k == -1) {
        res.status(404).send("Failed to add friend");

    } else {
        res.status(200) //.send("Friend added");
        console.log("After adding friend!!!!!!!!!!!!!!!!");
        let result = model.users[req.session.user.username];
        req.session.user = result;
        console.log(result);
        //res.redirect("/users");
        //res.render("userProfile", { result });
        res.format({
            html: function() {
                res.render('userProfile', { result });
            },
            json: function() {
                res.send(result);
            }
        });
    }
})

//Rejecting a friend request
app.get("/users/:uid/requests/:reqid", function(req, res, next) {
    let k = model.rejectFriendRequest(model.users[req.session.user.username], model.users[req.params.reqid]);
    console.log(req.params.reqid);
    if (k == -1) {
        res.status(404).send("Failed to reject friend request");

    } else {
        res.status(200) //.send("Friend request rejected");
        let result = model.users[req.session.user.username];
        req.session.user = result;
        console.log(result);
        //res.redirect("/users");
        //res.render("userProfile", { result });
        res.format({
            html: function() {
                res.render('userProfile', { result });
            },
            json: function() {
                res.send(result);
            }
        });
    }
})

//Removing a friend
app.get("/users/:uid/friends/:fid", function(req, res, next) {
    let k = model.removeFriend(model.users[req.session.user.username], model.users[req.params.fid]);
    if (k == -1) {
        res.status(404).send("Failed to remove friend");
    } else {
        res.status(200) //.send("Friend removed!");
        let result = model.users[req.session.user.username];
        req.session.user = result;
        console.log(result);
        //res.redirect("/users");
        //res.render("userProfile", { result });
        res.format({
            html: function() {
                res.render('userProfile', { result });
            },
            json: function() {
                res.send(result);
            }
        });
    }
})

//Creating a game
//app.post("/game/")





app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/gamepieces", express.static(path.join(__dirname, 'gamepieces')));
app.get("/Gameboard.css", (req, res) => {
    fs.readFile('Gameboard.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/Home.css", (req, res) => {
    fs.readFile('Home.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/howToPlay.css", (req, res) => {
    fs.readFile('howToPlay.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/Login.css", (req, res) => {
    fs.readFile('Login.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/SignUp.css", (req, res) => {
    fs.readFile('SignUp.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/userProfile.css", (req, res) => {
    fs.readFile('userProfile.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});

app.get("/viewProfile.css", (req, res) => {
    fs.readFile('viewProfile.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});
/* app.get("/search.css", (req, res) => {
    fs.readFile('search.css', function(err, data) {
        if (err) {
            res.status(500).send("error: no such file!");
        }
        res.status(200).type('.css').send(data);
    })
});
 */


app.get("/", home);
app.get("/Gameboard", gameBoard);
app.get("/SignUp", SignUp);

app.get("/howToPlay", howToPlay);
app.get("/Login", Login);
app.get("/userProfile", userProfile);
app.get("/viewProfile", viewProfile);
app.get("/search", search);

function home(req, res) {
    //res.render("Home", {});
    res.format({
        html: function() {
            res.render('Home', {});
        },
        json: function() {
            res.send();
        }
    });
}

function gameBoard(req, res) {
    //res.render("Gameboard", {});
    res.format({
        html: function() {
            res.render('Gameboard', {});
        },
        json: function() {
            res.send();
        }
    });
}

function howToPlay(req, res) {
    //res.render("howToPlay", {});
    res.format({
        html: function() {
            res.render('howToPlay', {});
        },
        json: function() {
            res.send();
        }
    });
}

function SignUp(req, res) {
    //res.render("SignUp", {});
    res.format({
        html: function() {
            res.render('SignUp', {});
        },
        json: function() {
            res.send();
        }
    });
}

function Login(req, res) {
    //res.render("Login", {});
    res.format({
        html: function() {
            res.render('Login', {});
        },
        json: function() {
            res.send();
        }
    });
}


function userProfile(req, res) {
    //res.render("userProfile", {});
    res.format({
        html: function() {
            res.render('userProfile', {});
        },
        json: function() {
            res.send();
        }
    });

}

function viewProfile(req, res) {
    //res.render("viewProfile", {});
    res.format({
        html: function() {
            res.render('viewProfile', {});
        },
        json: function() {
            res.send();
        }
    });
}

function search(req, res) {
    //res.render("search", {});
    res.format({
        html: function() {
            res.render('search', {});
        },
        json: function() {
            res.send();
        }
    });
}

app.listen(3000);

console.log("Server listening at http://localhost:3000");