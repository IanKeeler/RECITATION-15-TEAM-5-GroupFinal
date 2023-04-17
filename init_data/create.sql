
-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(45) NOT NULL,
  user_password VARCHAR(300) NOT NULL,
  CONSTRAINT "username_unique" UNIQUE ("username")
);

-- -----------------------------------------------------
-- Table travel
-- -----------------------------------------------------
DROP TABLE IF EXISTS travel CASCADE;
CREATE TABLE travel(
  travel_id SERIAL PRIMARY KEY,
  travel_mode VARCHAR(45) NOT NULL,
  travel_distance INT NOT NULL,
  emissions INT NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

-- -----------------------------------------------------
-- Table freight
-- -----------------------------------------------------
DROP TABLE IF EXISTS freight CASCADE;
CREATE TABLE freight(
  freight_id SERIAL PRIMARY KEY,
  freight_mode VARCHAR(45) NOT NULL,
  freight_weight INT NOT NULL,
  freight_distance INT NOT NULL,
  emissions VARCHAR(45) NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

-- -----------------------------------------------------
-- Table electricity
-- -----------------------------------------------------
DROP TABLE IF EXISTS electricity CASCADE;
CREATE TABLE electricity(
  electricity_id SERIAL PRIMARY KEY,
  electricity_mode VARCHAR(45) NOT NULL,
  electricity_used INT NOT NULL,
  emissions INT NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

-- -----------------------------------------------------
-- initialize test users: currently only here for login/registration
-- -----------------------------------------------------

-- unhashed passwords (respectively)
-- pass1
-- pass2
-- pass3
INSERT INTO users (username, user_password) VALUES ('user1', '$2b$10$4KoZfQeiD9MDlI5YRzMZtuBIJbXgjz.QqsZRmDG4NCfsXPSW4APWm');
INSERT INTO users (username, user_password) VALUES ('user2', '$2b$10$yPeUvrbER1W.Y/NGiffn8usAZFmltMhFB1BFo15jaBUX2dBcKzK76');
INSERT INTO users (username, user_password) VALUES ('user3', '$2b$10$SpdLRI.7Eb7qF94c44nI4eMWqTf75mHGqGTYb8X3FEZR0yAX/fp/6');

