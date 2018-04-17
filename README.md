# MOP Questionnaire

This is an application that provides the main functions you'd expect from a questionnaire, such as creating them, give users the ability to answer them etc.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Postgresql database 
- .env file 

You can create .env file in project root and add this configuration:
```
DB_HOST='localhost'
DB_USER='postgres'
DB_PASSWORD='sa'
DB_NAME='questionnaire'

TOKEN_SECRET='edbef839113ce19a733dd39986a8db461904c22834e27126e15fcf37d8cf4e39'
```
Make sure to have a database named same as in configuration file.

### Installation


```
npm install
npm run build
npm start
```

## Demo

Check live version on https://mop-questionnaire1.herokuapp.com/


## Built With

* [React](https://reactjs.org/)
* [Nodejs](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Postgresql](https://www.postgresql.org/)


## Acknowledgments

* [Megaboilerplate](http://megaboilerplate.com/)