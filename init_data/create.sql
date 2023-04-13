-- TEST DATABASE 
CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    password CHAR(60) NOT NULL
);

-- unhashed pass: pass1
INSERT INTO users (username, password) VALUES ('testuser1', '$2b$10$kqkm5sPQur4SJAR2Nxwvcup21ImbIjtKR8vnL13Z.xzSFyByZ//Kq');
-- unhashed pass: pass2
INSERT INTO users (username, password) VALUES ('testuser2', '$2b$10$sQQylW6wyYeJ417vdOS0ku2nOflF32EshBvcp/20fd5FGJGPxvRCy');
-- unhasehd pass: pass3
INSERT INTO users (username, password) VALUES ('testuser2', '$2b$10$j03pTSgxQ9YqCTCkY4upDO.UhFI6rhjsXxvqiFVx8A/ZSepqbjsQq');

-- ACTUAL GREENCHALLENGE STUFF
-- -- -----------------------------------------------------
-- -- Table `GreenChallenge`.`user`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `GreenChallenge`.`user` (
--   `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `userName` VARCHAR(45) NOT NULL,
--   `userPassword` VARCHAR(45) NOT NULL,
--   PRIMARY KEY (`userID`),
--   UNIQUE INDEX `UserName_UNIQUE` (`userName` ASC) VISIBLE);


-- -- -----------------------------------------------------
-- -- Table `GreenChallenge`.`travel`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `GreenChallenge`.`travel` (
--   `travelID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `travelMode` VARCHAR(45) NOT NULL,
--   `travelDistance` INT UNSIGNED NOT NULL,
--   `emissions` INT UNSIGNED NOT NULL,
--   `date` DATE NOT NULL,
--   `userID` INT UNSIGNED NOT NULL,
--   PRIMARY KEY (`travelID`),
--   INDEX `userID_idx` (`userID` ASC) VISIBLE,
--   CONSTRAINT `userID`
--     FOREIGN KEY (`userID`)
--     REFERENCES `GreenChallenge`.`user` (`userID`)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE);


-- -- -----------------------------------------------------
-- -- Table `GreenChallenge`.`freight`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `GreenChallenge`.`freight` (
--   `freightID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `freightMode` VARCHAR(45) NOT NULL,
--   `freightWeight` INT UNSIGNED NOT NULL,
--   `freightDistance` INT UNSIGNED NOT NULL,
--   `emissions` VARCHAR(45) NOT NULL,
--   `date` DATE NOT NULL,
--   `userID` INT UNSIGNED NOT NULL,
--   PRIMARY KEY (`freightID`),
--   INDEX `userID_idx` (`userID` ASC) VISIBLE,
--   CONSTRAINT `userID`
--     FOREIGN KEY (`userID`)
--     REFERENCES `GreenChallenge`.`user` (`userID`)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE);


-- -- -----------------------------------------------------
-- -- Table `GreenChallenge`.`electricity`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `GreenChallenge`.`electricity` (
--   `electricityID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `electricityMode` VARCHAR(45) NOT NULL,
--   `electricityUsed` INT UNSIGNED NOT NULL,
--   `emissions` INT UNSIGNED NOT NULL,
--   `date` DATE NOT NULL,
--   `userID` INT UNSIGNED NOT NULL,
--   INDEX `userID_idx` (`userID` ASC) VISIBLE,
--   CONSTRAINT `userID`
--     FOREIGN KEY (`userID`)
--     REFERENCES `GreenChallenge`.`user` (`userID`)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE);