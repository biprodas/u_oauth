const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');


// router.use(protect);
// router.use(authorize(['admin']));

router
  .route('/')
  .get(getUsers)
  .post(authorize(['Admin']), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize(['Admin']), deleteUser);

module.exports = router;
