require("dotenv").config();

const { SQL_USER, SQL_PASSWORD } = process.env;
const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/petition`);

// addUser
exports.addUser = function(firstname, lastname, email, password) {
    return db.query(`INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`, [firstname, lastname, email, password])
}

// getAllSignatures - use db.query to get all signatures from table signatures
exports.getAllSignatures = function()  {
    return db.query(`SELECT * FROM signatures;`)
}

// getAllSigners - get all signatures from table signatures
exports.getAllSigners = function() {
    return db.query(`
        SELECT first, last, city, age, homepage
        FROM users
        JOIN signatures
        ON users.id = signatures.user_id
        
        FULL OUTER JOIN profiles
        ON users.id = profiles.user_id
        ;`)
}
    
// addSignature - use db.query to insert a signature to table signatures
exports.addSignatures = function(signature, user_id)  {
    return db.query(`INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING *;`, [signature, user_id])
}

// addProfile
exports.addProfile = function(city, age, homepage, user_id) {
    // if (homepage.startsWith("http://") || homepage.startsWith("https://")) {
    return db.query(`INSERT INTO profiles (city, age, homepage, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [city, age, homepage, user_id])
    // } else {
    //     return db.query(`INSERT INTO profiles (city, age, user_id) VALUES ($1, $2) RETURNING *;`, [city, age, user_id])
    // }
}

// check for email
exports.checkEmail = function(emaillog) {
    return db.query(`SELECT email, password, id FROM users WHERE email = $1;`, [emaillog])
}

// check for signature
exports.checkSig = function(user_id) {
    return db.query(`SELECT from signatures WHERE user_id = $1;`, [user_id])
}

// getSignerbycity from page signers
exports.getSignersbycity = function(city) {
    return db.query(`SELECT first, last from users INNER JOIN profiles ON profiles.user_id = users.id WHERE city = $1;`, [city])
}

// update table profile from the page editprofile after signature
exports.updateProfile = function(firstname, lastname, email, password, city, age, homepage, id) {
    return Promise.all([
        db.query(`UPDATE users SET (first, last, email, password) = ($1, $2, $3, $4) WHERE id = $5 RETURNING *;` [firstname, lastname, email, password, id]),
        db.query(`UPDATE profiles SET (city, age, homepage) = ($1, $2, $3) WHERE user_id = $4 RETURNING *;`[city, age, homepage, id])
    ])
}

// delete signature in case of request
exports.deleteSig = function(user_id) {
    return db.query(`DELETE FROM signatures WHERE user_id = $1;`, [user_id])
}

// get the datas for the editprofile page in order to edit the profile
exports.getProfile = function(user_id) {
    return db.query(`SELECT * from users JOIN profiles ON users.id = $1;`, [user_id])
}

// delete a users in case of request
// exports.deleteUser = function(id) {
//     return db.query(`DELETE FROM users WHERE user_id = $1;`, [user_id])
// }

   
