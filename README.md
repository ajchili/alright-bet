# alright-bet

Alright Bet is a web application that allows friends to make bets against one
another in a friendly and competitive environment with fake currency, marbles.

You can view and use the website [here](https://alright.bet/).

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
- [Discord OAuth2 & Bot](https://discord.com/developers)

## Running locally

1. Install [Node.js](https://nodejs.org/en/), specifically version **13.11.0**
    - This can be done with the help of [nvm](https://github.com/nvm-sh/nvm)
2. Install [yarn](https://yarnpkg.com/)
3. Install [PostgreSQL](https://www.postgresql.org/)
4. Install dependencies by running `yarn` in the root directory
5. Create a **.env** file in the root directory and provide the values specified in the **.env.sample** file
6. Start the PostgreSQL database
7. Run `yarn dev:server` in the root directory
8. Open another terminal and run `yarn dev:server` in the root directory of the project
9. Open [http://localhost](http://localhost) in your browser of choice
    - Please note that the application runs on port **80**
    - Should you want or need to change the default port, do the following:
        1. Add an environment variable named **PORT** to the **.env** file, setting the value of the variable to be the desired port
        2. Change the **proxy** value in the **package.json** file to reflect the changes to the port
        ```diff
        {
          ...
        -  "proxy": "localhost:80"
        +  "proxy": "localhost:NEW_PORT"
          ...
        }
        ```
10. Develop!
    - The server and webpack instances watch for file changes and re-build or restart when changes are detected