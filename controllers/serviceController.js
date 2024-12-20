const Service = require('../models/serviceModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllServices = catchAsync( async (req, res,next) => {
   
  const features = new APIFeatures(Service.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const service = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: service.length,
    data: {
      service
    }
  });
});

exports.getService = catchAsync( async (req, res,next) => {
    const service = await Service.findById(req.params.id);
    // Tour.findOne({_id: req.params.id});
    if(!service){
      return next(new AppError('No service found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        service
      }
    })
});
  
exports.createService = catchAsync(async (req, res, next) => {
  // Valida y filtra solo los campos necesarios
  const { name, category, price, description, information } = req.body;

  if (!name || !category || !price || !description || !information) {
    return next(new AppError('Todos los campos son obligatorios.', 400)); // Error 400: Bad Request
  }
  const newService = await Service.create({ name, category, price, description, information });

  res.status(201).json({
    status: 'success',
    data: {
      service: newService,
    },
  });
});

exports.updateService = catchAsync( async (req, res,next) => {

  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true//Para que se corran las validaciones 
  }); 

  if(!service){
    return next(new AppError('No service found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
  
  //with path we can update some fields and put all the fields

  res.status(200).json({
    status: 'success',
    data: {
      service: '<Updated tour here...>'
    }
  });
});

exports.deleteService = catchAsync( async (req, res,next) => {   
  const service = await Service.findByIdAndDelete(req.params.id);

  if(!service){
    return next(new AppError('No service found with that ID', 404))
  }

  res.status(204).json({
    //No content
    status: 'success',
    data: null
  });
});