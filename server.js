const express = require("express");
// const { ApolloServer } = require ('@apollo/server');
// const { startStandaloneServer } = require ('@apollo/server/standalone');
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");
const { Console } = require("console");

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  // uploads: false, //set uploads to false
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/frontend/index.html"));
// });

//The 404 Route (ALWAYS Keep this as the last route)
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/frontend/index.html"));
// });

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
  app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer(typeDefs, resolvers);
