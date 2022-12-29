import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

const Register = asyncHandler(async (req, res) => {
  const { phone, password, roles } = req.body;

  // Confirm data
  if (!phone || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  // Check for duplicate phone
  const duplicate = await User.findOne({ phone }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Số điện thoại đã tồn tại." });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { phone, password: hashedPwd, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `Tài khoản ${phone} đã được tạo.` });
  } else {
    res.status(400).json({ message: "Có lỗi xảy ra." });
  }
});

export default {
  Register,
};
