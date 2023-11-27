/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Jerus Allen Dorotan Student ID: 110225216 Date: 11-27-2023
*
* Published URL: https://baby-blue-deer-toga.cyclic.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path'); 
const app = express(); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

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

app.get("/lego/addSet", async (req,res) =>{ 
    try {

      let themeData = await legoData.getAllThemes();
      res.render("addSet", { themes: themeData });

    } catch(error) {
        res.status(404).render("404", {message: "Unable to add set."});
    }
});

app.post("/lego/addSet", async (req, res) => {
    try {

      await legoData.addSet(req.body)
      res.redirect('/lego/sets')

    } catch (error) {
        res.status(500).render("500", { message: "Duplicate Data Insertion. Adding Set Failed." });
    }
});
    

app.get("/lego/editSet/:num", async (req,res) => {
    try {
      const setNum = req.params.num;
      const setData = await legoData.getSetsByNum(setNum);
      const themeData = await legoData.getAllThemes();
      res.render("editSet", { themes: themeData, set: setData });

    } catch (error) {
      res.status(404).render("404", {message: "No Sets found for a specific set num OR obtaining the themes from the DB failed."});
    }
});

app.post("/lego/editSet", async (req, res) => {
    try {
      await legoData.editSet(req.body)
      res.redirect('/lego/sets')

    } catch (err) {
      res.status(500).render("500", { message: "Updating of Set Failed." });
    }
});

app.get("/lego/deleteSet/:num", async (req,res)=>{
    try {
      const setNum = req.params.num;
      const setData = await legoData.deleteSet(setNum);
      res.redirect('/lego/sets')
    } catch (err) {
        res.status(500).render("500", { message: "Deletion of Set Failed." });
    }
});
  
app.use((req, res, next) => {
    res.status(404).render("404", {message: "No view matched for a specific route"});
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
