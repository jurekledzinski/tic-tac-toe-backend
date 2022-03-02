const express = require('express');
const router = express.Router();

const {
  addPlayer,
  addPlayerMultiplayer,
  addResult,
  getResults,
  addSinglePlayer,
  removePlayerOnline,
  updatePlayerAvailable,
} = require('../controllers/results');

router.route('/').get(getResults).post(addPlayer);
router.route('/:id').patch(addResult);
router.route('/single-player').post(addSinglePlayer);
router.route('/multiplayer').post(addPlayerMultiplayer);
router.route('/multiplayer/remove-player/:id').delete(removePlayerOnline);
router.route('/multiplayer/:id/:available').patch(updatePlayerAvailable);

module.exports = router;
