# alright-bet

Alright Bet is a web application that allows friends to make bets against one
another in a friendly and competitive environment with fake currency, marbles.

## Technologies Used

- [yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org/en/)
  - [React](https://reactjs.org/)
  - [Express.js](https://expressjs.com/)
  - [webpack](https://webpack.js.org/)
  - [Babel](https://babeljs.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Semantic UI (for React)](https://react.semantic-ui.com/)
- [Heroku](https://www.heroku.com/)

## Running locally

1. Install [Node.js](https://nodejs.org/en/), specifically version 13.11.0
    - This can be done with the help of [nvm](https://github.com/nvm-sh/nvm)
2. Install [yarn](https://yarnpkg.com/)
3. Install [PostgreSQL](https://www.postgresql.org/)
4. Install dependencies by running `yarn` in the root directory
5. Create a **.env** file in the root directory and provide the values specified in the **.env.sample** file
6. Start the PostgreSQL database
7. Run `yarn dev:server` in the root directory
8. Open another terminal and run `yarn dev:server` in the root directory of the project
9. Open [http://localhost](http://localhost) in your browser of choice
10. Develop!
    - The server and webpack instances watch for file changes and re-build or restart when changes are detected