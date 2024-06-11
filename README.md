This boilerplate comes with express js framework and Raw SQL queries.
It uses jest for unit testing.
Follow the steps to run the boilerplate. Make sure to create .env file before you run the app.

execute the following commands in order

> npm install
> npm run migrate
> npm run seed
> npm test
> npm start

For collaborators and developers who will work on this repo, 
the folder structure is developed in a way that routes folder will have minimal code to just route the request to appropriate controller.
The controllers can have minimal business logic and are responsible for calling the service functions after some validations if required, and to process the response in a proper format.
Service files are responsible for core business logics and calling the dataAccessLayer files to fetch data from database.