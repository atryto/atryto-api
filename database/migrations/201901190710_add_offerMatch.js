module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offerMatches', {
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
      offerId: {
        type: Sequelize.INTEGER,
        references: { key: 'id', model: 'offers' },
        onDelete: 'SET NULL',
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
    })
    .then( () => {
      queryInterface.addConstraint('offerMatches', ['userId', 'offerId'], {
        type: 'unique',
        name: 'offerMatchses_userId_offerId_constraint'
      });
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('offerMatches');
  }
};
