const express = require("express");
const spicedPg = require("spiced-pg");
const app = express();
const path = require("path");
const cookieSession = require("cookie-session");

// connecting other files
const db = require("./db");
const crypt = require("./bcrypt.js")


// Handlebars Setup
const { engine } = require("express-handlebars");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { nextTick } = require("process");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(express.static("./views"));
app.use(express.static("./"));
app.use(express.urlencoded({extended: false}));
// app.use(cookieSession({
//     secret: `music will be the answer`,
//     maxAge: 1000 * 60 * 60 * 24 * 14
// }));

app.get("/petition", (req, res) => {
    res.render("petition", {
        text: true
    });
});

app.get("/", (req, res) => {
    res.redirect("/petition")
});

app.get("/register", (req, res) => {
    res.render("petition", {
        register: true
    });
});

app.get("/login", (req, res) => {
    res.render("petition", {
        login: true
    });
});

app.get("/profile", (req,res) => {
    res.render("petition", {
        profile: true
    });
});

app.get("/sign", (req, res) => {
    res.render("petition", {
        sign: true
    });
});

app.post("/register", (req, res) => {
    // console.log(req.body)
    //  Hash the password before saving to the Database
    crypt.hash(req.body.password)
    .then (hashedPsw => {
        console.log(hashedPsw)
        return db.addUser(req.body.firstname, req.body.lastname, req.body.email, hashedPsw)
    })
    .then(data => { 
        console.log("data.rows", data.rows)
        // TODO: Save cookies and redirect to Signature Page
        res.redirect("/profile")
    })
    .catch(err => {
        console.log("error appeared for post req register:", err);
        res.redirect("/register")
        
        
        // , {     TODO:
        // //     ops: visible
        // })
    })  
});

app.post("/login", (req, res) => {
    // First check by the email if the user exists in your Database
    db.checkEmail()
    for (let i=0; i<email.length; i++) {
        if (req.body.email === email[i]) {
            crypt.hash(req.body.password)
        }
    } 
    .then(hashedPsw => {
        if (crypt.compare(hashedPsw, email)) {

        }
        .then
        
    
    // If he/she exists then compare if the password matches
    // Go to the Signatures Table to see if this user already signed
    // If the user has signed already redirect to Thanks Page
    // Otherwise redirect to Signature Page
    });
});

app.post("/profile", (req, res) => {
    // save the data in the table profile
    db.addProfile(req.body.city, req.body.age, req.body.homepage)
    .then(data => {
        console.log(data)
        res.redirect("/sign")
    })  
    .catch(err => {
        console.log("error appeared for post req profile:", err);
        res.redirect("/profile") 
    });
});

app.get("/thanks", (req, res) => {
    db.getAllSignatures()
    .then(data => {
        // console.log(data)
        res.render("petition", {
            thanks: true,
            firme: data.rows.length
        });
    })
    .catch(err => {
        console.log('error appeared for query select getAllSig: ', err);
    })  
});

app.get("/signers", (req, res) => {
    db.getAllSignatures()
    .then(data => {
        res.render("petition", {
            signers: true,
            nomi: data.rows.firstname,
            cognomi: data.rows.lastname
        });
    })
    .catch(err => {
        console.log('error appeared for query select getAllSig: ', err);
    })  
}); 


app.listen(8080, console.log("running at 8080"));