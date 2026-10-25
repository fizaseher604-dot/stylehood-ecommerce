
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const resend = new Resend(process.env.RESEND_API_KEY);

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: email?.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.log("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await userModel.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.log("Registration Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Forgot Password - Resend
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    // Same response whether account exists or not
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists for this email, reset instructions will be sent.",
      });
    }

    if (!process.env.FRONTEND_URL || !process.env.RESEND_API_KEY) {
      throw new Error("FRONTEND_URL or RESEND_API_KEY is missing");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL.replace(/\/+$/, "");
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      const { data, error } = await resend.emails.send({
        from: "Stylehood <onboarding@resend.dev>",
        to: user.email,
        subject: "Stylehood Password Reset",
        text: `You requested a password reset for your Stylehood account.

Open this link to set a new password:
${resetLink}

This link expires in 15 minutes. If you did not request this, ignore this email.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px">
            <h2 style="color:#0F172A">Reset Your Password</h2>
            <p>We received a request to reset your Stylehood account password.</p>
            <a href="${resetLink}"
              style="display:inline-block;background:#F97316;color:white;padding:12px 22px;text-decoration:none;border-radius:8px">
              Reset Password
            </a>
            <p>This link expires in 15 minutes.</p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Password reset email sent:", data?.id);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw emailError;
    }

    return res.json({
      success: true,
      message:
        "If an account exists for this email, reset instructions will be sent.",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send reset email. Please try again later.",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (
      typeof token !== "string" ||
      !token ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Record password change so older user JWTs can be rejected
    user.passwordChangedAt = new Date();

    // Make the reset link one-time use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    console.log("Reset Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      console.error("Admin login environment variables are missing");

      return res.status(500).json({
        success: false,
        message: "Admin login is not configured",
      });
    }

    if (
      email?.toLowerCase().trim() ===
        process.env.ADMIN_EMAIL.toLowerCase().trim() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET
      );

      return res.json({
        success: true,
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  } catch (error) {
    console.log("Admin Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword,
};
