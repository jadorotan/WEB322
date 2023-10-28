/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Jerus Allen Dorotan Student ID: 110225216 Date: 10-27-2023
*
* Published URL: https://lego-a3-jadorotan.cyclic.app
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path'); 
const app = express(); 
app.use(express.static('public'));
const HTTP_PORT = process.env.PORT || 8080;

legoData.initialize();

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'home.html');
    res.sendFile(filePath);
});

app.get('/about', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'about.html');
    res.sendFile(filePath);
});

app.get('/lego/sets', async (req, res) => {
    try {
        const theme = req.query.theme;

        if (theme) {
            const setsByTheme = await legoData.getSetsByTheme(theme);
            res.send(setsByTheme);
        } else {
            const allSets = await legoData.getAllSets();
            res.send(allSets);
        }
    } catch (error) {
        console.error('Error in /lego/sets:', error);
        res.status(404).send('Server: Unable to process the request.');
    }
});

app.get('/lego/sets/:setNum', async (req, res) => {
    const setNumParam = req.params.setNum;

    try {
        const set = await legoData.getSetsByNum(setNumParam);

        if (set) {
            res.send(set);
        } else {
            res.status(404).send('Server: Lego set not found.');
        }
    } catch (error) {
        console.log('Error in getSetsByNum():', error);
        res.status(404).send('Server: Unable to find requested set(s).');
    }
});

app.use((req, res, next) => {
    res.status(404);
    const filePath = path.join(__dirname, 'views', '404.html');
    res.sendFile(filePath);;
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
