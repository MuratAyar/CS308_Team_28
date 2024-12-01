const express = require('express');

const{addAddress,fetchAllAddress,editAddress,deleteAddress} = require('../../controllers/shop/address-controller')

const router = express.Router();

router.post('/add', addAddress)
router.get('/get/:userID', fetchAllAddress)
router.delete('/delete/:userId/:addressdId')
router.put('/update/:userId/:addressId', editAddress)

module.exports = router;