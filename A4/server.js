/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Jerus Allen Dorotan Student ID: 110225216 Date: 11-09-2023
*
* Published URL: https://legoa4-jadorotan.cyclic.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path'); 
const app = express(); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
const HTTP_PORT = process.env.PORT || 8080;

legoData.initialize();

app.use((req,res,next)=>{
    app.locals.currentRoute = req.path;
    next();
});

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.get('/lego/sets', async (req, res) => {
    try {
        const theme = req.query.theme;

        if (theme) {
            const setsByTheme = await legoData.getSetsByTheme(theme);
            res.render("sets", {sets: setsByTheme});
        } else {
            const allSets = await legoData.getAllSets();
            res.render("sets", {sets: allSets});
        }
    } catch (error) {
        console.error('Error in /lego/sets:', error);
        res.status(404).render("404", {message: "No Sets found for a matching theme."});
    }
});

app.get('/lego/sets/:setNum', async (req, res) => {
    const setNumParam = req.params.setNum;

    try {
        const legoSet = await legoData.getSetsByNum(setNumParam);

        if (legoSet) {
            res.render("set", {set: legoSet});
        } else {
            res.status(404).render('Server: Lego set not found.');
        }
    } catch (error) {
        console.log('Error in getSetsByNum():', error);
        res.status(404).render("404", {message: "No Sets found for a specific set num."});
    }
});

app.use((req, res, next) => {
    res.status(404).render("404", {message: "No view matched for a specific route"});
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
