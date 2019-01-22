module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePictureUrl: {
        type: Sequelize.STRING,
      },
      citySlug: {
        type: Sequelize.STRING,
        references: { key: 'slug', model: 'cities' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      allowOnlineTransactions: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    return queryInterface.dropTable('users');
  }
};
