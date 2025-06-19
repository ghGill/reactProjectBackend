const { DataTypes } = require('sequelize');
const seqClient = require('../servises/sequelizeClient');

if (!seqClient)
    return;

const Pot = seqClient.define(
    'Pot',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      target: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      saved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
);

module.exports = Pot;
