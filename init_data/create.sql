
-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(45) NOT NULL,
  user_password VARCHAR(45) NOT NULL,
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
  date DATE NOT NULL

  -- FOREIGN KEY (user_id) REFERENCES users(user_id)

  -- CONSTRAINT "fk_user_id"
  --   FOREIGN KEY (user_id)
  --   REFERENCES users(user_id)
  --   ON DELETE CASCADE
  --   ON UPDATE CASCADE
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
  user_id INT NOT NULL

  -- FOREIGN KEY (user_id) REFERENCES users(user_id)

  -- CONSTRAINT "fk_user_id"
  --   FOREIGN KEY (user_id)
  --   REFERENCES users(user_id)
  --   ON DELETE CASCADE
  --   ON UPDATE CASCADE
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
  user_id INT NOT NULL


  -- FOREIGN KEY (user_id) REFERENCES users(user_id)

  -- CONSTRAINT "fk_user_id"
  --   FOREIGN KEY (user_id)
  --   REFERENCES users(user_id)
  --   ON DELETE CASCADE
  --   ON UPDATE CASCADE
);