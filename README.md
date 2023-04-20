# GreenChallenge

### Description

GreenChallenge is a web-based application that allows users to log and track their carbon emissions from vehicular travel. Several vehicle types are supported. The user need only enter the type of vehicle they travelled in and the distance covered to receive an estimate of the carbon emissions that activity produced. The carbon emissions are estimated using the [climatiq](https://climatiq.io) API.

Users who register an account with GreenChallenge can track their travel activities and associated carbon emissions from their profile on the GreenChallenge application. They can search for their friends if they know their username and see their profiles as well. GreenChallenge maintains a leaderboard that ranks users based on who is able to maintain the lowest carbon score.

### Contributors

**The SustainaBuddies:**

Ben Gardner - [5pointr](https://github.com/5pointr)

Ian Keeler - [IanKeeler](https://github.com/IanKeeler)

Ethan Nguyen - [enguy3n](https://github.com/enguy3n)

Joe Powers Dechar - [JoePowers5](https://github.com/JoePowers5)

Dayn Reoh - [daynreoh](https://github.com/daynreoh)

### Technology Stack

**GreenChallenge uses the following technologies:**

* Docker
* PostgreSQL
* Node.js
  * Express framework
  * pg-promise interface
  * Axios HTTP client
  * bcrypt library
* Climatiq API
* HTML
* CSS
  * Bootstrap library
* JavaScript

### Prerequisites to run GreenChallenge

* A modern browser such as Google Chrome or Mozilla Firefox must be installed on your device
* Docker Desktop

### How to run GreenChallenge locally

1. Ensure you have the Docker daemon running on your machine by opening the Docker Desktop client
2. Using your preferred CLI, navigate to the directory where you have GreenChallenge stored
3. Run the following command: `docker compose up -d`
4. Open your preferred browser application
5. In the address bar type 'http://localhost:3000' and press 'enter'
6. Wait for the login page to render and enter your GreenChallenge account credentials or register a new account
7. You are now ready to use GreenChallenge

### How to run the test suite

1. Navigate to the directory containing the GreenChallenge application
2. From the root directory, navigate to the directory named project_code_and_components
3. Open the file named docker-compose.yaml with your preferred text editor
4. Under `web:`, comment out `command: 'npm start'`
5. Directly below, uncomment `command: 'npm run testandrun'`
6. Save the changes and follow the instructions under "How to run GreenChallenge locally"

### Link to the deployed version of GreenChallenge

TODO