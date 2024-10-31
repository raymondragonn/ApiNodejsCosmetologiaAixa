const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

// router
//     .route('/top-5-productos')
//     .get(serviceController.aliasTopServices, serviceController.getAllServices);


router
    .route('/')
    .get(serviceController.getAllServices)
    .post(serviceController.createService);

router
    .route('/:id')
    .get(serviceController.getService)
    .patch(serviceController.updateService)
    .delete(serviceController.deleteService);


module.exports = router;

