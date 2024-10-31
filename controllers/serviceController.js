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
  

exports.createService = catchAsync( async (req, res,next) => {
    
  const newService = await Service.create(req.body);
  res.status(201).json({
    // 201 means created
    status: 'success',
    data: {
      service: newService
    }
  });
    // res.send('Done'); no se puede enviar dos veces una respuesta
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