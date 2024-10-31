const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
   process.env.DATABASE_PASSWORD
);


dbConnect().catch(err => console.log(err));

async function dbConnect(){
  await mongoose.connect(DB, {
    // .connect(process.env.DATABASE_LOCAL)//La manera local
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then( con => {
    // console.log(con.connections);
    
    console.log('DB connection successful!');
  }, err => {
    console.log(err);
  });
}


// console.log(app.get('env'));//Para saber en que ambiente estoy

// console.log(process.env);

//4) Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

