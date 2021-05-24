const express = require('express');
const router = express.Router();

const { jwtConfig } = require('../middleware/config');
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  logoutAll,
  getMe,
  refreshToken,
  revokeToken,
  updateDetails,
  updatePassword
} = require('../controllers/auth');


router.use(jwtConfig);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', protect, refreshToken);
router.post('/revoke-token', protect, revokeToken);
router.delete('/logout', protect, logout);
router.delete('/logoutall', protect, logoutAll);
router.get('/me', protect, getMe);
// router.put('/updatedetails', protect, updateDetails);
// router.put('/updatepassword', protect, updatePassword);

module.exports = router;
