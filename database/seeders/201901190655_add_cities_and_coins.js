module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    INSERT INTO cities (name, slug, country)
    VALUES 
      ('Toronto', 'toronto', 'Canada'),
      ('Ottawa', 'ottawa', 'Canada'),
      ('Vancouver', 'vancouver', 'Canada'),
      ('Markham', 'markham', 'Canada');
    `)
    .then(() => {
      return queryInterface.sequelize.query(`
      INSERT INTO coins (type, name, symbol)
      VALUES
        ('fiat', 'US Dollar', 'USD'),
        ('fiat', 'Canadian Dollar', 'CAD'),
        ('fiat', 'Brazilian Real', 'BRL'),
        ('fiat', 'Euro', 'EUR'),
        ('fiat', 'Australian Dollar', 'AUD'),
        ('fiat', 'Swiss Franc', 'CHF'),
        ('fiat', 'Chilean Peso', 'CLP'),
        ('fiat', 'Chinese Yuan', 'CNY'),
        ('fiat', 'Czech Koruna', 'CZK'),
        ('fiat', 'Danish Krone', 'DKK'),
        ('fiat', 'Pound Sterling', 'GBP'),
        ('fiat', 'Hong Kong Dollar', 'HKD'),
        ('fiat', 'Hungarian Forint', 'HUF'),
        ('fiat', 'Israeli New Shekel', 'ILS'),
        ('fiat', 'Indian Rupee', 'INR'),
        ('fiat', 'Japanese Yen', 'JPY'),
        ('fiat', 'South korean Won', 'KRW'),
        ('crypto', 'Bitcoin', 'BTC'),
        ('crypto', 'Ethereum', 'ETH'),
        ('crypto', 'XRP', 'XRP'),
        ('crypto', 'Bitcoin Cash', 'BCH'),
        ('crypto', 'EOS', 'EOS'),
        ('crypto', 'Stellar', 'XLM'),
        ('crypto', 'Litecoin', 'LTC'),
        ('crypto', 'Cardano', 'ADA'),
        ('crypto', 'IOTA', 'IOTA'),
        ('crypto', 'Monero', 'XMR'),
        ('crypto', 'TRON', 'TRX'),
        ('crypto', 'Dash', 'DASH'),
        ('crypto', 'Ethereum Classic', 'ETC'),
        ('crypto', 'NEO', 'NEO'),
        ('crypto', 'Binance Coin', 'BNB'),
        ('crypto', 'NEM', 'XEM'),
        ('crypto', 'VeChain', 'VET'),
        ('crypto', 'Tezos', 'XTZ'),
        ('crypto', 'Zcash', 'ZEC'),
        ('crypto', 'OmiseGO', 'OMG'),
        ('crypto', 'Lisk', 'LSK'),
        ('crypto', 'Ontology', 'ONT'),
        ('crypto', '0x', 'ZRX'),
        ('crypto', 'Qtum', 'QTUM'),
        ('crypto', 'Nano', 'NANO'),
        ('crypto', 'RChain', 'RHOC'),
        ('crypto', 'Komodo', 'KMD'),
        ('crypto', 'KuCoin Shares', 'KCS'),
        ('crypto', 'TenX', 'PAY'),
        ('crypto', 'Loom Network', 'LOOM'),
        ('crypto', 'Polymath', 'POLY'),
        ('crypto', 'Dragonchain', 'DRGN');
      `);
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DELETE FROM cities; DELETE FROM coins;
    `);
  }
};
