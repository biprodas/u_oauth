const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const {
  getRefreshTokens,
  getRefreshToken,
  createRefreshToken,
  updateRefreshToken,
  deleteRefreshToken
} = require('../controllers/refreshToken');


router.use(protect);
// router.use(authorize(['admin']));

router
  .route('/')
  .get(getRefreshTokens)
  .post(authorize(['Admin']), createRefreshToken);

router
  .route('/:id')
  .get(getRefreshToken)
  .put(updateRefreshToken)
  .delete(authorize(['Admin']), deleteRefreshToken);

module.exports = router;
