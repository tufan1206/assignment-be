const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = "GKFUKFGUYKGYGYUGYGYGUYKGHIGH";


const SavedFundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  schemeCode: String,
  schemeName: String,
  fundHouse: String,
  category: String,
  nav: String,
  navDate: String,
});
const SavedFund = mongoose.model("SavedFund", SavedFundSchema);


const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { userId: user._id, userName: user.name, userEmail: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({
    message: "Login successful",
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};


exports.saveFund = [
  verifyToken,
  async (req, res) => {
    const { schemeCode, schemeName, fundHouse, category, nav, navDate } = req.body;

    try {
      const newFund = await SavedFund.create({
        userId: req.user.userId,
        schemeCode,
        schemeName,
        fundHouse,
        category,
        nav,
        navDate,
      });
      res.json(newFund);
    } catch (err) {
      res.status(500).json({ error: "Failed to save fund" });
    }
  }
];


exports.getSavedFunds = [
  verifyToken,
  async (req, res) => {
    try {
      const saved = await SavedFund.find({ userId: req.user.userId });
      res.json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch saved funds" });
    }
  }
];
