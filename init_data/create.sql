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
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ethan', '$2b$10$4KoZfQeiD9MDlI5YRzMZtuBIJbXgjz.QqsZRmDG4NCfsXPSW4APWm', 1, 188, 'Greetings! I am a carbon-reducing machine, and I am always up for a challenge. I love finding creative ways to reduce my carbon footprint and help the environment. From composting and gardening to biking and using eco-friendly products, I am always on the lookout for new ways to live sustainably. I am not just doing this for me, but for future generations. So, if you want to compete with me, be ready to bring your A-game because I am not going down without a fight!');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Dayn', '$2b$10$yPeUvrbER1W.Y/NGiffn8usAZFmltMhFB1BFo15jaBUX2dBcKzK76', 1, 720, 'Hello, fellow eco-warriors! I am an environmental champion, and I am always looking for new ways to reduce my carbon emissions. I am not just reducing my carbon footprint, but I am also advocating for environmental policies and encouraging others to join the cause. From hosting community cleanups to organizing environmental workshops, I am a force to be reckoned with. If you want to compete with me, you better have a strong commitment to the environment because I am in it to win it!');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ian', '$2b$10$SpdLRI.7Eb7qF94c44nI4eMWqTf75mHGqGTYb8X3FEZR0yAX/fp/6', 1, 678, 'Hey there! I am a competitive nature lover, and I am always up for a challenge that involves the environment. I am always looking for ways to get closer to nature while also reducing my carbon footprint. From exploring local parks and hiking trails to upcycling and using sustainable transportation, I am always finding new ways to live in harmony with nature. So, if you think you can outdo me in the challenge to save the planet, you better bring your best because I am ready to crush it!');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Ben', '$2b$10$B/TOx/39o5Q4RQHoXLffnu2oNXSjWv2x2FgvAN0nqr6i2xx1XGFU6', 1, 560, 'Hello! I am a highly competitive person, and I thrive on challenges. When it comes to reducing carbon emissions and helping the environment, I am not afraid to go head to head with anyone. I am always looking for new and innovative ways to reduce my carbon footprint, and I am constantly researching the latest trends and techniques. I am passionate about the environment, and I am committed to doing everything I can to make a difference. If you think you have what it takes to compete with me in the challenge to save the planet, bring it on!');
INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ('Joe', '$2b$10$ULB.uMWy8sxen7V251doo.aycXw5hwsiZvBNjydgHm5rEhW5GonQy', 1, 775, 'Hey there! I am a fierce competitor, and I love a good challenge. When it comes to reducing my carbon emissions and helping the environment, I am second to none. I am always on the lookout for ways to reduce my carbon footprint, and I am constantly pushing myself to do better. Whether its by using public transportation, eating a plant-based diet, or reducing my energy usage at home, I am always finding new ways to be environmentally friendly. I am determined to do my part to save the planet, and I am confident that I can outdo anyone who thinks they can beat me.');


-- -----------------------------------------------------
-- test data for leaderboard
-- -----------------------------------------------------

INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 5, 0, '2023-04-01', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('biking', 30, 0, '2023-04-03', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 6, 0, '2023-04-05', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 10, 0, '2023-04-09', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('biking', 50, 0, '2023-04-10', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 7, 0, '2023-04-13', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('walking', 3, 0, '2023-04-022', 1);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 16, 5.27, '2023-04-01', 2);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('car', 40, 13.143, '2023-04-01', 3);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('bus', 20, 1.137, '2023-04-01', 4);
INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ('biking', 10, 0, '2023-04-01', 5);


INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (0.00, 0.00, 150.00, 81.142, '2023-04-01', 1);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (0.00, 0.00, 100.00, 81.142, '2023-04-20', 1);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (20.00, 7.50, 15.00, 81.142, '2023-05-01', 1);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (35.00, 0.00, 30.00, 129.9, '2023-05-01', 2);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (80.00, 15.00, 15.00, 281.46, '2023-05-01', 3);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (42.00, 0.00, 15.00, 142.902, '2023-05-01', 4);
INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES (33.00, 7.50, 15.00, 122.504, '2023-05-01', 5);


INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (20, .3, 10, '2023-04-01', 1);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (75, .7, 32, '2023-04-01', 2);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (35, 1, 16, '2023-04-01', 3);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (45, .4, 20, '2023-04-01', 4);
INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES (80, .45, 37.5, '2023-04-01', 5);


