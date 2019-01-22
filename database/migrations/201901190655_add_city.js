module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cities', {
      slug: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
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
      paranoid: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('cities');
  }
};
