const express = require('express');
const app = express();
const port = 6900;
  
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const mongoose = require('mongoose');

// Replace with your connection string
const uri = "mongodb+srv://l06433930:udZJLw1fKHcABDZg@my-web-project.a2x7q.mongodb.net/?retryWrites=true&w=majority&appName=my-web-project";

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User"); // Import User model (create a new file 'models/User.js')

// Middleware
app.use(cors()); // Allows frontend to make API requests
app.use(bodyParser.json()); // Parses JSON request bodies

// Connect to MongoDB Atlas
//const uri = "mongodb+srv://l06433930:udZJLw1fKHcABDZg@my-web-project.a2x7q.mongodb.net/?retryWrites=true&w=majority&appName=my-web-project";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// ** User Registration Route **
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile, address, state, district } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ name, email, password: hashedPassword, mobile, address, state, district });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// ** User Login Route **
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

