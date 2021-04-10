const { Neo4jGraphQL } = require('@neo4j/graphql')
const Neo4j = require('neo4j-driver')
const { ApolloServer } = require('apollo-server')

const driver = Neo4j.driver(
    'bolt://34.200.223.121:7687',
    Neo4j.auth.basic('neo4j', 'fixture-elbow-purposes')
)



const typeDefs = `
type Post {
    id:ID! @id
    content: String!
    createdAt:DateTime! @timestamp
    creator:User! @relationship(type:"POSTED", direction:IN)
    liked:[User] @relationship(type:"LIKES", direction:IN)
    comments:[Comment] @relationship(type:"ON", direction:IN)
}
type User{
    id:ID!@id
    name:String!
    posts:[Post] @relationship(type:"POSTED", direction:OUT)
    likes:[Post] @relationship(type:"LIKES", direction:OUT)
    follows:[User] @relationship(type:"FOLLOWS", direction:OUT)
    comment:[Comment] @relationship(type:"COMMENTED",direction:OUT)
}
type Comment{
    id:ID! @id
    message:String!
    createdAt:DateTime! @timestamp
    creator:User! @relationship(type:"COMMENTED",direction:IN)
    post:Post! @relationship(type:"ON", direction:OUT)
}
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver })


const server = new ApolloServer({
    schema: neoSchema.schema,
    context: ({ req }) => ({ req }),
});

server.listen(4000).then(() => console.log('Online'));