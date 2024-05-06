const express = require('express');
const router = express.Router();
const Controller = require('../controller/card-controller');

router.get('/', Controller.getCards);

router.get('/add-card', Controller.getAddCard);

router.post('/add-card', Controller.addCard)

router.post('/delete-card', Controller.deleteCard);

router.get('/edit', Controller.getEditCard);

router.post('/edit', Controller.editCard);

module.exports = router;