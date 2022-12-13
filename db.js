require('dotenv').config();

const { SQL_USER, SQL_PASSWORD } = process.env;
const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/petition`);



// getAllSignatures - use db.query to get all signatures from table signatures
exports.getAllSignatures = function()  {
    return db.query(`SELECT * FROM signature;`)
}
    
// addSignature - use db.query to insert a signature to table signatures
exports.addSignatures = function(firstname, lastname)  {
    return db.query(`INSERT INTO signature (firstname, lastname) VALUES ($1, $2) RETURNING *;`, [firstname, lastname])
}
   
