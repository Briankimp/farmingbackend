const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const register = async (req, res) => {
  try{
    const {name, email, password, role} = req.body;

    //check if user exists
    let user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "User already exists"});
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    user = await User.create({name, email, password: hashedPassword, role});
    await user.save();

    //generate token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

    //send response
    res.status(201).json({token, user: {name, email, role}, message:"User registered successfully"});
  } catch (error) {
    res.status(500).json({error: "Error Registering User"});
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    //send response
    res.status(200).json({ token, user: { name, email, role }, message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error Logging In User" });
  }
};