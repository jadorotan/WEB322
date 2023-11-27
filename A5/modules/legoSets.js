require('dotenv').config();
const Sequelize = require('sequelize');

// const setData = require("../data/setData");
// const themeData = require("../data/themeData");
// let sets = [];

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
});
  
const Theme = sequelize.define(
    'Theme',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
      },
      name: Sequelize.STRING,
    },
    {
      createdAt: false, 
      updatedAt: false, 
    }
);

const Set = sequelize.define(
    'Set', 
    {
        set_num: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        year: Sequelize.INTEGER,
        num_parts: Sequelize.INTEGER,
        theme_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
    },
    {
        createdAt: false, 
        updatedAt: false, 
    }
);

Set.belongsTo(Theme, { foreignKey: 'theme_id', as: 'Theme' })

// // Code Snippet to insert existing data from Set / Themes

// sequelize
//   .sync()
//   .then( async () => {
//     try{
//       await Theme.bulkCreate(themeData);
//       await Set.bulkCreate(setData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

//       // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
// });

function initialize(){
    return new Promise(async (resolve, reject) => {
        try {
            await sequelize.sync();
            console.log("Success: Synchronized with Database");
            return Promise.resolve();
        } catch (error) {
            console.error("ERROR: Synchronizing with Database failed", error);
            return Promise.reject(error);
        }
    });
}

function getAllSets(){
    return new Promise(async (resolve, reject) => {
        try {
            const allSets = await Set.findAll({
              include: ['Theme']
            });
      
            resolve(allSets);
          } catch (error) {
            console.error("Error fetching sets:", error);
            reject(error);
        }
    });
}

function getSetsByNum(setNum){
    return new Promise(async (resolve, reject) => {
        try {
            const setByNum = await Set.findAll({
              include: ['Theme'],
              where: {
                set_num: setNum,
              },
            });
      
            if (setByNum.length == 0) {
                reject("Unable to find requested sets");
                return;
              }
        
              resolve(setByNum[0]);
            } catch (error) {
              console.error("Error finding sets by theme", error);
              reject(error);
          }
    });
}

function getSetsByTheme(theme) {
    return new Promise( async (resolve, reject) => {
        try {
            const setsByTheme = await Set.findAll({
              include: ['Theme'], 
              where: {
                '$Theme.name$': {
                  [Sequelize.Op.iLike]: `%${theme}%`
                }
              },
            });
      
            if (setsByTheme.length === 0) {
                reject("Unable to find requested sets");
                return;
            }
      
            resolve(setsByTheme);
          } catch (error) {
            console.error("Error finding sets by theme", error);
            reject(error);
        }
    });
}

function addSet(setData){
    return new Promise(async (resolve, reject) => {
        Set.create({
            set_num: setData.set_num,
            name: setData.name,
            year: setData.year,
            num_parts: setData.num_parts,
            theme_id: setData.theme_id,
            img_url: setData.img_url,
        })
        .then(() => {
            resolve(); 
        })
        .catch((error) => {
            reject(error.message); 
        });
    });
}

function getAllThemes(){
    return new Promise(async (resolve, reject)=> {
      Theme.findAll()
        .then((data)=>{
          resolve(data);
        })
        .catch((error)=>{
          reject(error.message);
        })  
    });
}

function editSet(setData) {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedSet = await Set.update({
                    name: setData.name,
                    year: setData.year,
                    num_parts: setData.num_parts,
                    theme_id: setData.theme_id,
                    img_url: setData.img_url
                },
                {
                    where: { set_num: setData.set_num }
                });

            if (updatedSet[0] === 0) {
                reject(new Error(`Set with set_num ${setData.set_num} not found in the collection for editing`));
                return;
            }

            resolve();
        } catch (err) {
            reject(new Error(`Error updating set with set_num ${setData.set_num}`));
        }
    });
}

function deleteSet(setNum) {
    return new Promise(async (resolve, reject) => {
        try {
            await Set.destroy({
                    where: { set_num: setNum }
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error.message);
                });
        } catch (err) {
            reject(new Error(`Error deleting set with set_num ${setNum}`));
        }
    });
}

module.exports = { initialize, getAllSets, getSetsByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet };
