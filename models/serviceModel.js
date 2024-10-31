//importaciones que he hecho con npm install
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


const serviceSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],//True lo activa y el mensaje es el que se muestra
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']//Valida que solo sean letras //el problema es que no acepta los espacios
    },
    slug: String,
    // duration: {
    //   type: Number,
    //   require: [true, 'A tour mus have a duration']
    // },
    // maxGroupSize: {
    //   type: Number,
    //   require: [true, 'A tour must have a group size']
    // },
    // difficulty: {
    //   type: String,
    //   require: [true, 'A tour must have a difficulty'],
    //   enum: {//solo se puede con strings
    //     values: ['easy', 'medium', 'difficult'],
    //     message: 'Difficulty is either: easy, medium, difficult'
    //   }
    // },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],//min y max tambien funciona para fechas
      max: [5, 'Rating must be below 5.0']
    },
    // ratingsQuantity: {
    //   type: Number,
    //   default: 0
    // },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount:{
      type: Number,
      validate: {
        validator: function(val){//Crear tus propias validaciones
          return val < this.price;//si el discount es menor que el precio te regresa un true sino un false //esta validacion solo valida para cuando creas un nuevo documento
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
      
    }, 
    summary: {
      type: String,
      trim: true, //remove the white space at the beginning and the end
      trim: [true, 'A tour must have a description']

    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    // startDates: [Date],
    // secretTour: {
    //   type: Boolean,
    //   dafalut: false
    // }

  },{
    toJSON: {virtuals: true},//Cuando se convierte a json se incluyen los virtuals
    toObject: {virtuals: true}
  });

// tourSchema.virtual('durationWeeks').get(function(){//aqui usar function porque necesitamos el this y esto solo se permite en las funciones normales no arrow functions
//   return this.duration / 7;//Esto es un virtual field que no se guarda en la base de datos
// })
//Esto va a correr antes de que se termine de guardar el documento
//Document middleware: runs before .save() and .create() //no va a correr para findBy and update methods
serviceSchema.pre('save', function(next){
  // console.log(this);//current processed document
  this.slug = slugify(this.name, { lower: true });
  next();//Si hay mas pre middleware y no le pones alguno next() se trabara ahi y no continuara
});

// tourSchema.pre('save', function(next){
//   console.log('Will save document..');
//   next();
// })

// tourSchema.post('save', function(doc,next){//after the document is saved
//   console.log(this);
//   next();
// })

//Query middleware
// tourSchema.pre('find', function(next){
//   tourSchema.pre(/^find/, function(next){//regular expression que dice que se ejecutara para todos los que empiezen con find
//   this.find({secretTour: {$ne: true}});

//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function(docs,next){
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   // console.log(docs);
//   next();
// });


// tourSchema.pre('aggregate', function(next){
//   this.pipeline().unshift({$match: { secretTour: {$ne: true}}});//unshift para agregar al principio del array todos los que no sean secretTour
//   next();
// });
  
const Service = mongoose.model('Service', serviceSchema);  

module.exports = Service;

//types of middleware in mongoose document query aggregate and model

