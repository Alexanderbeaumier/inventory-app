const { Sequelize, DataTypes, Model } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false,
});

// Intentionally Vulnerable Query Function
async function findItemsBySearch(query) {
  // Vulnerable raw query: directly concatenates user input
  const sql = `SELECT * FROM Items WHERE name LIKE '%${query}%'`;
  console.log("Executing SQL:", sql); // For debugging
  return await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
}

module.exports = { sequelize, findItemsBySearch };
