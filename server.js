const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
    input MessageInput{
        content: String
        author: String
    }

    type Message {
        id: ID!
        content:String
        author: String
    }

    type Query {
        getMessage(id: ID!): Message
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updatedMessage(id: ID!, input: MessageInput): Message
    }
`);

//This class implements the RandomDie GraphQL type

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// Maps username to content
const fakeDatabase = {};

const root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return new Message(id, fakeDatabase[id]);
  },

  createMessage: ({ input }) => {
    // Create a random id for our "database".
    const id = require("crypto")
      .randomBytes(10)
      .toString("hex");
    fakeDatabase[id] = input;
    return new Message(id, input);
  },

  updatedMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }

    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  }
};

// sample query
// mutation {
//     createMessage(input: {
//       author: "andy",
//       content: "hope is a good thing",
//     }) {
//       id
//     }
//   }

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000);
