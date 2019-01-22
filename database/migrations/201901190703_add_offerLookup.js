module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offerLookups', {
      citySlug: {
        type: Sequelize.STRING,
        references: { key: 'slug', model: 'cities' },
        onUpdate: 'CASCADE',
      },
      sourceCoinSymbol: {
        type: Sequelize.STRING,
        references: { key: 'symbol', model: 'coins' },
        onUpdate: 'CASCADE',
      },
      destCoinSymbol: {
        type: Sequelize.STRING,
        references: { key: 'symbol', model: 'coins' },
        onUpdate: 'CASCADE',
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
    return queryInterface.dropTable('offerLookups');
  }
};
