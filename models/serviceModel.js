//importaciones que he hecho con npm install
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


const serviceSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'nombre de servicio requerido'],//True lo activa y el mensaje es el que se muestra
      unique: true,
      trim: true,
      // maxlength: [40, 'A service name must have less or equal than 40 characters'],
      // minlength: [10, 'A service name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']//Valida que solo sean letras //el problema es que no acepta los espacios
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'El servicio debe tener un precio'],
    },
    images: {
      primary: [String],
      secondary: {
        type : [String],
        default: null
      }
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    category: {
      type: [String],
      category: {
        type: String,
        enum: ['Corporales', 'Faciales', 'Masajes', 'Depilación'],
      }
    },
    information: {
      type: [String]
    },
    slug: String,

  },{
    toJSON: {virtuals: true},//Cuando se convierte a json se incluyen los virtuals
    toObject: {virtuals: true}
  });


serviceSchema.pre('save', function(next){
  // console.log(this);//current processed document
  this.slug = slugify(this.name, { lower: true });
  next();//Si hay mas pre middleware y no le pones alguno next() se trabara ahi y no continuara
});


  
const Service = mongoose.model('Service', serviceSchema);  

module.exports = Service;



