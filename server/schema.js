const graphql = require('graphql');
const _ = require('lodash');

const Book = require('./models/book');
const Author = require('./models/author');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull 
} = graphql;

// Dummy Data
const books = [
    { name: 'Book 1', id: '1', genre: 'comedy', authorId: "1" },
    { name: 'Book 2', id: '2', genre: 'hurror', authorId: "2" },
    { name: 'Book 3', id: '3', genre: 'comedy', authorId: "3" },
    { name: 'Book 4', id: '4', genre: 'comedy', authorId: "1" },
    { name: 'Book 5', id: '5', genre: 'hurror', authorId: "2" },
    { name: 'Book 6', id: '6', genre: 'comedy', authorId: "3" }
]

const authors = [
    { name: 'Author 1', id: '1', age: 30 },
    { name: 'Author 2', id: '2', age: 45 },
    { name: 'Author 3', id: '3', age: 24 }
]

// Every Graphql Schema has mainly 3 responsibilities 1.define Types(BookType), 2.Relationships between Types and 3.Defining root queries
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type : AuthorType,
            resolve(parent, args){
                // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorId: parent.id})
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const RoorQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args:{
                id: { type: GraphQLID }
            },
            resolve(parent, args){
            //    return _.find(books, {id: args.id});
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args:{
                id: { type: GraphQLID }
            },
            resolve(parent, args){
            //    return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
               //return books;
               return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
               //return authors;
               return Author.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args:{
                name : { type: new GraphQLNonNull(GraphQLString) },
                age : { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args:{
                name : { type: new GraphQLNonNull(GraphQLString) },
                genre : { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save();
            }
        }
    }
})
 
module.exports = new GraphQLSchema({
    query: RoorQuery,
    mutation: Mutation
})