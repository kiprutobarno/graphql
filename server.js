const { graphql, buildSchema} = require("graphql");

/**construct a schema using GraphQL schema language */
const schema = buildSchema(`type Query {hello:String}`);

/**The root provides a resolver function for each API endpoint */
const root = {
  hello: () => {
    return "Hello world";
  }
};

/**Run the graphql query {hello} and print the response*/
graphql(schema, "{hello}", root).then(response => {
  console.log(response);
});
