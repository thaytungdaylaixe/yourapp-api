const Dshv = require("../models/Dshv");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

import fetch from "node-fetch";

// @desc Get all dshvs
// @route GET /dshvs
// @access Private
const getAllDshvs = asyncHandler(async (req, res) => {
  console.log(process.env.GGS);

  const response = await fetch(process.env.GGS);
  const data = await response.json();

  console.log(data);

  res.json(data);
});

// @desc Create new dshv
// @route POST /dshvs
// @access Private
const createNewDshv = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Dshv.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate dshv title" });
  }

  // Create and store the new user
  const dshv = await Dshv.create({ user, title, text });

  if (dshv) {
    // Created
    return res.status(201).json({ message: "New dshv created" });
  } else {
    return res.status(400).json({ message: "Invalid dshv data received" });
  }
});

// @desc Update a dshv
// @route PATCH /dshvs
// @access Private
const updateDshv = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm dshv exists to update
  const dshv = await Dshv.findById(id).exec();

  if (!dshv) {
    return res.status(400).json({ message: "Dshv not found" });
  }

  // Check for duplicate title
  const duplicate = await Dshv.findOne({ title }).lean().exec();

  // Allow renaming of the original dshv
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate dshv title" });
  }

  dshv.user = user;
  dshv.title = title;
  dshv.text = text;
  dshv.completed = completed;

  const updatedDshv = await dshv.save();

  res.json(`'${updatedDshv.title}' updated`);
});

// @desc Delete a dshv
// @route DELETE /dshvs
// @access Private
const deleteDshv = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Dshv ID required" });
  }

  // Confirm dshv exists to delete
  const dshv = await Dshv.findById(id).exec();

  if (!dshv) {
    return res.status(400).json({ message: "Dshv not found" });
  }

  const result = await dshv.deleteOne();

  const reply = `Dshv '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllDshvs,
  createNewDshv,
  updateDshv,
  deleteDshv,
};
