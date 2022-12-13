const express = require("express");
const spicedPg = require("spiced-pg");
const app = express();
const path = require("path");
const cookieSession = require("cookie-session");


// app.use(cookieSession({
//     secret: `music will be the answer`,
//     maxAge: 1000 * 60 * 60 * 24 * 14
// }));

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


app.get("/petition", (req, res) => {
    res.render("petition", {
        text: true
    });
});

app.get("/", (req, res) => {
    res.redirect("/petition")
});

// app.post("/petition", (req, res) => {
//         db.addSignatures(req.body.firstname, req.body.lastname)
//         .then(data => {
//             console.log("print data", data.rows); // in rows property is the actual data
//             res.redirect("/thanks")
//         })
//         .catch(err => {
//         console.log('error appeared for query select addSig: ', err);
//         }); 
// });

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

app.get("/sign", (req, res) => {
    res.render("petition", {
        sign: true
    });
});

app.post("/register", (req, res) => {
    // console.log(req.body)
    //  Hash the password before saving to the Database
    // const hashedPsw = 
    crypt.hash(req.body.password)
    .then(data => {
        db.addUser(req.body.firstname, req.body.lastname, req.body.email, crypt.hash(req.body.password))
        console.log("data.rows", data,rows)
        // TODO: Save cookies and redirect to Signature Page
        res.redirect("/sign")
    })
    .catch(err => {
        console.log("error appeared for post req:", err);
        // res.redirect("/register", {
        //     ops: visible
        // })
    })  
});

app.post("/login", (req, res) => {
    // First check by the email if the user exists in your Database
    // If he/she exists then compare if the password matches
    // Go to the Signatures Table to see if this user already signed
    // If the user has signed already redirect to Thanks Page
    // Otherwise redirect to Signature Page
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