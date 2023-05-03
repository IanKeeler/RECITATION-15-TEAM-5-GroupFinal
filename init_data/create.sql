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
-- pass4
-- pass5
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ethan', '$2b$10$4KoZfQeiD9MDlI5YRzMZtuBIJbXgjz.QqsZRmDG4NCfsXPSW4APWm', 1, 519.5, 'Dromaeosauridae (/ˌdrɒmi.əˈsɔːrɪdiː/) is a family of feathered theropod dinosaurs. They were generally small to medium-sized feathered carnivores that flourished in the Cretaceous Period. The name Dromaeosauridae means ''running lizards'', from Greek δρομαῖος (dromaîos), meaning ''running at full speed, swift'', and σαῦρος (saûros), meaning ''lizard''. In informal usage, they are often called raptors (after Velociraptor), a term popularized by the film Jurassic Park; several genera include the term "raptor" directly in their name, and popular culture has come to emphasize their bird-like appearance and speculated bird-like behavior.');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Dayn', '$2b$10$yPeUvrbER1W.Y/NGiffn8usAZFmltMhFB1BFo15jaBUX2dBcKzK76', 1, 552.6, 'Crocodylomorpha is a group of pseudosuchian archosaurs that includes the crocodilians and their extinct relatives. They were the only members of Pseudosuchia to survive the end-Triassic extinction. During Mesozoic and early Cenozoic times, crocodylomorphs were far more diverse than at Present. Triassic forms were small, lightly built, active terrestrial animals. During the Jurassic, Crocodylomorphs morphologically diversified into numerous niches, with the subgroups Neosuchia (which includes modern crocodilians) and the extinct Thalattosuchia adapting to aquatic life.');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ian', '$2b$10$SpdLRI.7Eb7qF94c44nI4eMWqTf75mHGqGTYb8X3FEZR0yAX/fp/6', 1, 678, 'The griffin is a fantastical creature steeped in myth and legend. It boasts the head, wings, and talons of an eagle, and the body of a lion. This magnificent beast is renowned for its fierce loyalty, protective nature, and regal presence. With its keen sense of sight and sharp claws, the griffin is a symbol of strength, courage, and vigilance. Its eagle-like head is adorned with a sharp beak, large eyes, and pointed ears, while its feathered wings are capable of flight. The griffins muscular body is covered in fur, and its four powerful legs end in razor-sharp talons. Often associated with royalty, the griffin is said to guard treasures and important locations such as castles and temples.');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ben', '$2b$10$B/TOx/39o5Q4RQHoXLffnu2oNXSjWv2x2FgvAN0nqr6i2xx1XGFU6', 1, 533.8, '');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Joe', '$2b$10$ULB.uMWy8sxen7V251doo.aycXw5hwsiZvBNjydgHm5rEhW5GonQy', 1, 527.7, '');


-- -----------------------------------------------------
-- test data for leaderboard
-- -----------------------------------------------------

INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 5, 0, '2023-04-01', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 5.27, '2023-04-01', 2);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 40, 13.143, '2023-04-01', 3);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('bus', 20, 1.137, '2023-04-01', 4);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('biking', 10, 0, '2023-04-01', 5);


INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (20.00, 7.50, 15.00, 81.142, '2023-05-01', 1);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (35.00, 0.00, 30.00, 129.9, '2023-05-01', 2);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (80.00, 15.00, 15.00, 281.46, '2023-05-01', 3);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (42.00, 0.00, 15.00, 142.902, '2023-05-01', 4);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (33.00, 7.50, 15.00, 122.504, '2023-05-01', 5);


INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (20, 20, 100, '2023-04-01', 1);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (10, 10, 50, '2023-04-01', 2);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (30, 10, 89, '2023-04-01', 3);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (10, 30, 100, '2023-04-01', 4);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (10, 5, 37.5, '2023-04-01', 5);


