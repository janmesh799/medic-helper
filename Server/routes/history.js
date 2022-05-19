const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/Fetchuser");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const History = require("../Models/history");

//ROUTE 1: Add a new histry using POST : "/api/auth/addhistory"
router.post(
  "/addhistory",
  fetchuser,
  [
    body("problem", "Enter a valid problem").isLength({ min: 1 }),
    body("description", "description must be of min 3 letters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      console.log("reached /addhistory");
      const errors = validationResult(req);
      const {
        problem,
        description,
        duration,
        treatment,
        medicines_given,
        patient_id,
      } = req.body;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const history = new History({
        patient_id,
        problem,
        description,
        duration,
        treatment,
        medicines_given: medicines_given.split(","),
        user: req.user.id,
      });
      const savedHistory = await history.save();
      res.json(savedHistory);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!!");
    }
  }
);
//ROUTE 2: fetching all histories with paient_id using GET : "/api/history/allhistory/:patient_id"
router.get(
  "/allhistory",
  fetchuser,
  [body("patient_id", "Enter a valid patient id").isLength({ min: 5 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {patient_id} = req.body;
      history = [];
      history = await History.find({ patient_id: patient_id });
      res.json(history);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!!");
    }
  }
);

module.exports = router;
