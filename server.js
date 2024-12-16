const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => {//Listener para errores no caputados //esto se pone antes de cualquier coas para aescuchar por los errores uncaugtExceptions
  console.log('UNCAUGHT EXCEPTION! shuting down');
  console.log(err.name, err.message);
  process.exit(1);
})



dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
   process.env.DATABASE_PASSWORD
);


dbConnect().catch(err => console.log(err));

async function dbConnect(){
  await mongoose.connect(DB, {
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


process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION shuting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
});

