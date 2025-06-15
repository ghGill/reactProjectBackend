const { DataTypes } = require('sequelize');
const seqClient = require('../servises/sequelizeClient');

if (!seqClient)
    return;

const Color = seqClient.define(
    'Color',
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

module.exports = Color;
