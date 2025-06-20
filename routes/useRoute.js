const express = require('express');
const router = express.Router();
const {
  register,
  login,
  saveFund,
  getSavedFunds
} = require('../controllers/useController');


router.post('/register', register);
router.post('/login', login);


router.post('/save', saveFund);
router.get('/myfunds', getSavedFunds);

module.exports = router;
