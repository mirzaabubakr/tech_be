module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "File",
    {
      filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      tags: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },

      shareable: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      views: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        default: 0,
      },
      link: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  File.associate = function (models) {
    File.belongsTo(models.User, { foreignKey: "UserId", allowNull: false });
  };

  return File;
};
