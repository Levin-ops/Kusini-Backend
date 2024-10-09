const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  let check = await Admin.findOne({ phone: req.body.phone });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "Existing user found with similar number",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    name: req.body.name,
    phone: req.body.phone,
    password: hashedPassword,
  });

  await admin.save();

  const data = {
    admin: {
      id: admin.id,
    },
  };
  const token = jwt.sign(data, "secret-kusini");
  res.json({ success: true, token });
};

const login = async (req, res) => {
  let admin = await Admin.findOne({ phone: req.body.phone });
  if (admin) {
    const passCompare = await bcrypt.compare(req.body.password, admin.password); // Compare hashed password
    if (passCompare) {
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const token = jwt.sign(data, "secret-kusini");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.json({ success: false, error: "Wrong Phone Number" });
  }
};

module.exports = { signup, login };
