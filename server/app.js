const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const schema = require('./schema');

const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 100, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
mongoose.connect('mongodb://anji:anji407@ds361085.mlab.com:61085/graphql', options).then(
    () => {
        console.log("connected to mongoDB")
    },
    (err) => {
        console.log("err", err);
    });
// mongoose.connection.once('open', () => {
//     console.log('Connected to database');
// });
 
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log("App is running at port number", port);
});