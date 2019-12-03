const express = require('express');
const router = express.Router();
const Posts = require('../data/db.js');

router.use(express.json());

// GET REQUESTS BELOW

// 1. Returns an array of all the post objects contained in the database.