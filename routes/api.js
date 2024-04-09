const express = require('express');
const apiController = require('../controllers/api')

const router = express.Router();

router.post('/updateOrdertoPickup', apiController.updateOrdertoPickup );
router.post('/updateOrdertoDone', apiController.updateOrdertoDone );
router.post('/updateReservationtoConfirmed', apiController.updateReservationtoConfirmed);
router.post('/declineReservation', apiController.declineReservation);
// router.post('/updateReservationStatustoConfirmed', apiController.updateReservationStatustoConfirmed);


module.exports = router; //for export these router that we created and that we are giving in here for ourpages