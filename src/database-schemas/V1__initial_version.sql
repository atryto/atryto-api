CREATE DATABASE IF NOT EXISTS exchange;
  
CREATE TABLE IF NOT EXISTS exchange.users (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `email` varchar(255)  NOT NULL UNIQUE, 
  `username` varchar(63)  NOT NULL UNIQUE, 
  `password` varchar(255)  NOT NULL, 
  `profilepictureurl` text,
  `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedat` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

CREATE TABLE IF NOT EXISTS exchange.brokers (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userid` INTEGER NOT NULL, 
  `website` varchar(255)  NOT NULL, 
  `createdat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `user-id-brokers-key` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

CREATE TABLE IF NOT EXISTS exchange.cities (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `slug` varchar(255)  NOT NULL UNIQUE,
  `name` varchar(255)  NOT NULL, 
  `country` varchar(255)  NOT NULL, 
  `createdat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

CREATE TABLE IF NOT EXISTS exchange.coins (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `type` varchar(255)  NOT NULL, -- fiat, crypto
  `name` varchar(255)  NOT NULL UNIQUE, 
  `symbol` varchar(255)  NOT NULL UNIQUE, 
  `logourl` text,
  `createdat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;


CREATE TABLE IF NOT EXISTS exchange.offers (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userid` INTEGER NOT NULL, 
  `type` varchar(255)  NOT NULL, -- BUY, SELL, EXCHANGE
  `cityslug` varchar(255) NOT NULL, 
  `sourcecoinsymbol` varchar(255) NOT NULL,
  `destcoinsymbol` varchar(255) NOT NULL, 
  `minamount` INTEGER, 
  `amount` INTEGER NOT NULL, 
  `wantedpriceperunit` DECIMAL(10,2), 
  `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedat` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `user-id-offer-key` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

CREATE TABLE IF NOT EXISTS exchange.offerlookups (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `type` varchar(255)  NOT NULL, 
  `cityslug` varchar(255) NOT NULL, 
  `sourcecoinsymbol` varchar(255) NOT NULL, 
  `destcoinsymbol` varchar(255) NOT NULL,
  `createdat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

CREATE TABLE IF NOT EXISTS exchange.userrates (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userid` INTEGER NOT NULL,
  -- `offerid` INTEGER NOT NULL,
  `rateruserid` INTEGER NOT NULL, 
  `grade` INTEGER NOT NULL,  
  `createdat` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) ,
  -- CONSTRAINT `offer-id-rates-key` FOREIGN KEY (`offerid`) REFERENCES `offers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user-id-rates-key` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `rater-user-id-rates-key` FOREIGN KEY (`rateruserid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=default;

