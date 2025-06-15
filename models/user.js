const { DataTypes } = require('sequelize');
const seqClient = require('../servises/sequelizeClient');

if (!seqClient)
    return;

const User = seqClient.define(
    'User',
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "default.jpg"
      },
    },
    {
      // Other model options go here
    },
);

module.exports = User;
