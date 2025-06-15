const { DataTypes } = require('sequelize');
const seqClient = require('../servises/sequelizeClient');

if (!seqClient)
    return;

const Category = seqClient.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
);

module.exports = Category;
