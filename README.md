# GreenChallenge

### Description

GreenChallenge is a web-based application that allows users to log and track their carbon emissions from vehicular travel, household electricity and water use, and food purchases. Several vehicle types are supported. The user need only enter the type of vehicle they travelled in and the distance covered to receive an estimate of the carbon emissions that activity produced. Likewise, they can enter the dollar totals from their food purchases from three different categories to receive an estimate of the carbon emissions created from cultivating and delivering that food to the point of sale. The user can enter some basic information of their electricity and water use in their household to receive an estimate of the carbon emissions created by utilizing those ultilities. The carbon emissions are estimated using the [climatiq](https://climatiq.io) API.

Users who register an account with GreenChallenge can track their carbon emitting activities and associated carbon emissions from their profile on the GreenChallenge application. They can search for their friends if they know their username and see their profiles as well. GreenChallenge maintains a leaderboard that ranks users based on who is able to maintain the lowest carbon score, a proprietary score that goes up and down depending on how well the user is able to engage in carbon-reducing activities across the dimensions of travel, household utility use, and food purchasing. In this way, GreenChallenge game-ifies the process of changing your behavior to be more sustainable and encourages users to create less carbon emissions in their day-to-day activities by giving them real data on the emissions they produce and adding an element of competition as users strive to lower their carbon score and climb the ranks on the leaderboard. GreenChallenge gives users a way to see how their activities and resulting emissions have changed overtime and make better, more sustainable choices in the future.

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

[GreenChallenge](http://recitation-15-team-05.eastus.cloudapp.azure.com:3000/home)