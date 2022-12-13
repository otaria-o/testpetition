const express = require("express");
const spicedPg = require('spiced-pg');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');


// app.use(cookieSession({
//     secret: `music will be the answer`,
//     maxAge: 1000 * 60 * 60 * 24 * 14
// }));

const db = require('./db');


// Handlebars Setup
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(express.static("./views"));
app.use(express.static("./"));
app.use(express.urlencoded({extended: false}));


app.get("/petition", (req, res) => {
    res.render("petition", {
        text: true
    });
});

app.get("/", (req, res) => {
    res.redirect("/petition")
});

app.post("/petition", (req, res) => {
    // console.log(req.body)
    // if (req.body === null) {
    //     res.redirect("/petition" , {
    //         text: true,
    //         p.style.display=visible;????
    //     })
    // } 
        db.addSignatures(req.body.firstname, req.body.lastname)
        .then(data => {
            console.log("print data", data.rows); // in rows property is the actual data
            res.redirect("/thanks")
        })
        .catch(err => {
        console.log('error appeared for query select addSig: ', err);
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