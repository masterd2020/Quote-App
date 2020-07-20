const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Configure
dotenv.config({path: './config.env'});


const app = require('./app');


//Database Connection
const DB = process.env.DATABASE_STRING;
//const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log("DB Connection successful");
  //console.log(con.connections);
}).catch(err => {
  console.log('Error 💥', err);
});


// Listening to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Now listening to port ${port}`));
