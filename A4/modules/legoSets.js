const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize(){
    return new Promise((resolve, reject) => {
        setData.forEach(setDataElement => {
            const findTheme = themeData.find(themeDataElement => themeDataElement.id == setDataElement.theme_id);

            if(findTheme){
                const setDataTheme = {
                    ...setDataElement,
                    theme: findTheme.name
                };
                sets.push(setDataTheme)
            }
        });
        resolve();
    });
}

function getAllSets(){
    return new Promise((resolve, reject) => {
        resolve(sets); 
    });
}

function getSetsByNum(setNum){
    return new Promise((resolve, reject) => {
        const setByNum = sets.find(setElement => setElement.set_num == setNum);

        if (setByNum) {
            resolve(setByNum); 
        } else {
            reject("Unable to find requested set(s)."); 
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const setByTheme = sets.filter(setElement => setElement.theme.toLowerCase().includes(theme.toLowerCase()));

        if (setByTheme.length > 0) {
            resolve(setByTheme);
        } else {
            reject("Unable to find requested set(s)."); 
        }
    });
}

module.exports = { initialize, getAllSets, getSetsByNum, getSetsByTheme }