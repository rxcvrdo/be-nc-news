# NC News API
Welcome to the NC News API! This project is a RESTful web API for a news website, built with Node.js, Express, and PostgreSQL.

# Hosted Version
You can access the hosted version of the API here (https://ricardos-news.onrender.com).

#  Project Summary
NC News API provides endpoints to manage and interact with news articles, users, topics, and comments. Users can:

View articles, topics, users, and comments.
Post comments to articles.
Vote on articles.
Delete comments.

# Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
Make sure you have the following installed:

Node.js (minimum version: 14.x)
PostgreSQL (minimum version: 12.x)
Installation
Clone the repository:


Copy code
git clone https://github.com/your-username/be-nc-news.git
cd be-nc-news

# Install dependencies:

bash
Copy code
npm install
Setting Up the Environment
Create two .env files in the root directory of your project:

.env.development
.env.test
Add the following environment variables to each .env file:

# .env.development

bash
makefile
Copy code
PGDATABASE=your_database_name_development
.env.test

makefile
Copy code
PGDATABASE=your_database_name_test
For production, you will need to add a .env.production file with the following:

# .env.production

bash
makefile
Copy code
DATABASE_URL=your_production_database_url
Setting Up the Database
Create the databases:

bash
Copy code
psql -f ./db/setup.sql
Seed the local database:

bash
Copy code
npm run seed
Running Tests
Run the tests:

bash
Copy code
npm test
Scripts
npm start - Start the server.
npm run dev - Start the server with nodemon for development.
npm run seed - Seed the database.
npm test - Run the tests.
Minimum Versions
Node.js: 14.x
PostgreSQL: 12.x
Contributing
If you would like to contribute to this project, please fork the repository and create a new branch for your feature or bugfix. Once you have completed your work, submit a pull request, and we will review your changes.


Acknowledgements
Northcoders for the project specification and guidance.
