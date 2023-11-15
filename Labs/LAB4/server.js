/********************************************************************************
* WEB322 – Lab 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Jerus Allen Dorotan Student ID: 110225216 Date: 11-15-2023
*
********************************************************************************/

const express = require('express');
const multer = require('multer');
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render("form");
});

app.post('/submit-multipart', upload.single('fileUploaded'), (req, res) => {
    req.body.terms = req.body.terms ? true : false;
    console.log("Data Submitted Through Form: ", req.body);

    if(req.file){
      console.log("File Uploaded: ", req.file);
      path.join(__dirname, 'uploads', req.file.filename);
    }

    res.render("confirmation");
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(HTTP_PORT, () => { 
    console.log(`server listening on: ${HTTP_PORT}`) 
});