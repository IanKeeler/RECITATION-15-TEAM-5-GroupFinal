-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
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
  travel_distance FLOAT NOT NULL,
  emissions FLOAT NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

-- -----------------------------------------------------
-- Table food
-- -----------------------------------------------------
DROP TABLE IF EXISTS food CASCADE;
CREATE TABLE food(
  food_id SERIAL PRIMARY KEY,
  beef_bought FLOAT NOT NULL,
  dairy_bought FLOAT NOT NULL,
  fruits_bought FLOAT NOT NULL,
  emissions FLOAT NOT NULL,
  date DATE NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
); 

-- -----------------------------------------------------
-- Table household
-- -----------------------------------------------------
DROP TABLE IF EXISTS household CASCADE;
CREATE TABLE household(
  household_id SERIAL PRIMARY KEY,
  electricity_used FLOAT NOT NULL, -- in kWH
  water_used FLOAT NOT NULL, -- in $
  emissions FLOAT NOT NULL, -- in kg of CO2
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
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user1', '$2b$10$4KoZfQeiD9MDlI5YRzMZtuBIJbXgjz.QqsZRmDG4NCfsXPSW4APWm', 1, 50, 'Dromaeosauridae (/ˌdrɒmi.əˈsɔːrɪdiː/) is a family of feathered theropod dinosaurs. They were generally small to medium-sized feathered carnivores that flourished in the Cretaceous Period. The name Dromaeosauridae means ''running lizards'', from Greek δρομαῖος (dromaîos), meaning ''running at full speed, swift'', and σαῦρος (saûros), meaning ''lizard''. In informal usage, they are often called raptors (after Velociraptor), a term popularized by the film Jurassic Park; several genera include the term "raptor" directly in their name, and popular culture has come to emphasize their bird-like appearance and speculated bird-like behavior.');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user2', '$2b$10$yPeUvrbER1W.Y/NGiffn8usAZFmltMhFB1BFo15jaBUX2dBcKzK76', 1, 27, 'Crocodylomorpha is a group of pseudosuchian archosaurs that includes the crocodilians and their extinct relatives. They were the only members of Pseudosuchia to survive the end-Triassic extinction. During Mesozoic and early Cenozoic times, crocodylomorphs were far more diverse than at Present. Triassic forms were small, lightly built, active terrestrial animals. During the Jurassic, Crocodylomorphs morphologically diversified into numerous niches, with the subgroups Neosuchia (which includes modern crocodilians) and the extinct Thalattosuchia adapting to aquatic life.');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('user3', '$2b$10$SpdLRI.7Eb7qF94c44nI4eMWqTf75mHGqGTYb8X3FEZR0yAX/fp/6', 1, 16.8, '');

-- -----------------------------------------------------
-- test data for leaderboard
-- -----------------------------------------------------

INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 20, '2023-04-01', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 10, 10, '2023-04-01', 2);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 26, 5, '2023-04-01', 3);

/* INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 30, '2023-04-01', 1);
INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 15, '2023-04-01', 2);
INSERT INTO freight (freight_mode, freight_weight, freight_distance, emissions, date, user_id) VALUES ('road', 15, 25, 7, '2023-04-01', 3);

INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 10, '2023-04-01', 1);
INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 5, '2023-04-01', 2);
INSERT INTO electricity (electricity_mode, electricity_used, emissions, date, user_id) VALUES ('charge device', 25, 2, '2023-04-01', 3); */