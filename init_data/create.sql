-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  user_password VARCHAR(300) NOT NULL,
  user_weightfactor FLOAT NOT NULL,
  user_carbonscore FLOAT NOT NULL,
  user_description TEXT,
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
/* DROP TABLE IF EXISTS freight CASCADE;
CREATE TABLE freight(
  freight_id SERIAL PRIMARY KEY,
  freight_mode VARCHAR(45) NOT NULL,
  freight_weight INT NOT NULL,
  freight_distance INT NOT NULL,
  emissions INT NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
); */

-- -----------------------------------------------------
-- Table electricity
-- -----------------------------------------------------
/* DROP TABLE IF EXISTS electricity CASCADE;
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
); */

-- -----------------------------------------------------
-- initialize test users: currently only here for login/registration
-- -----------------------------------------------------

-- unhashed passwords (respectively)
-- pass1
-- pass2
-- pass3
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user1', '$2b$10$4KoZfQeiD9MDlI5YRzMZtuBIJbXgjz.QqsZRmDG4NCfsXPSW4APWm', 1, 50, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula augue sed nunc feugiat porta. Donec ut urna diam. Sed dapibus, tortor a lacinia eleifend, est sapien pellentesque ligula, sed ornare nisl est sodales ante. Mauris volutpat consequat diam et feugiat. Curabitur ac velit nisl. Morbi leo ante, ornare ac hendrerit suscipit, aliquam venenatis neque. Proin bibendum posuere metus, eu lacinia lorem vestibulum in. In fringilla urna neque, nec tristique diam vehicula eu. Fusce ultrices tortor viverra, vehicula arcu eget, condimentum arcu. Etiam eget dolor consequat, scelerisque tellus in, scelerisque tellus. Donec dapibus sit amet nibh a vulputate. Sed dapibus, leo ac accumsan semper, lorem elit efficitur tellus, id condimentum eros neque eu est. ');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user2', '$2b$10$yPeUvrbER1W.Y/NGiffn8usAZFmltMhFB1BFo15jaBUX2dBcKzK76', 1, 27, 'my name is user2 and i am allergic to bees but only some of them');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user3', '$2b$10$SpdLRI.7Eb7qF94c44nI4eMWqTf75mHGqGTYb8X3FEZR0yAX/fp/6', 1, 16.8, '');

-- -----------------------------------------------------
-- test data for leaderboard
-- -----------------------------------------------------

INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 20, '2023-04-01', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 10, '2023-04-01', 2);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 5, '2023-04-01', 3);

/* INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 30, '2023-04-01', 1);
INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 15, '2023-04-01', 2);
INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 7, '2023-04-01', 3);

INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 10, '2023-04-01', 1);
INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 5, '2023-04-01', 2);
INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 2, '2023-04-01', 3); */