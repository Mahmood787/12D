// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const {ApolloServer, gql} =require('apollo-server-lambda')
const faunadb = require("faunadb")
const q = faunadb.query
require('dotenv').config()
var client = new faunadb.Client({secret:process.env.FAUNAD_SECRET})

const typeDefs = gql`
  type Query{
    bookmarks: [Bookmark!]
  }
  type Mutation{
    addBookmark(url:String!,description:String,title:String!):Bookmark
    deleteBookmark(id:ID!):Bookmark
  }
  type Bookmark{
    id:ID!
    url:String!
    title:String!
    description:String!
  }
`;

const resolvers = {
  Query:{
    bookmarks: async()=>{
      try{
        const results = await client.query(
        q.Map(q.Paginate(q.Documents(q.Collection('links'))),
        q.Lambda(x=> q.Get(x))
        ))
        const data = results.data.map((dt)=>{
          return{
            id:dt.ref.id,
            url:dt.data.url,
            title:dt.data.title,
            description:dt.data.description
          }
        })
        return data
      }catch(error){
        console.log(error)
        return error.toString()
      }
    }
  },
  Mutation:{
    addBookmark: async(_, {url,title,description})=>{
      try{
        const results = client.query(
          q.Create(q.Collection('links'),{data:{url:url, title:title, description:description}})
        )
        return results.data
      }catch(error){
        console.log(error)
        return error.toString()
      }
    },
    deleteBookmark:async(_,{id})=>{
      try{
        const result = client.query(
          q.Delete(q.Ref(q.Collection('links'),id))
        )
        return result.data
      }catch(error){
        console.log(error)
        return error.toString()
      }
    }
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const handler = server.createHandler()
module.exports = { handler }
