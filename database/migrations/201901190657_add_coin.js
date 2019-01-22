module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('coins', {
      symbol: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logoUrl: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      deletedAt: {
        type: Sequelize.DATE
      },
    }, {
      timestamps: true,
      paranoid: true
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('coins');
  }
};
