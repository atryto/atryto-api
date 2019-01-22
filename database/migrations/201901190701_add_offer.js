module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { key: 'id', model: 'users' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      citySlug: {
        type: Sequelize.STRING,
        references: { key: 'slug', model: 'cities' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      sourceCoinSymbol: {
        type: Sequelize.STRING,
        references: { key: 'symbol', model: 'coins' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      destCoinSymbol: {
        type: Sequelize.STRING,
        references: { key: 'symbol', model: 'coins' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      wantedPricePerUnit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      minAmount: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.INTEGER,
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
      }
    }, {
      timestamps: true,
      paranoid: true
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('offers');
  }
};
