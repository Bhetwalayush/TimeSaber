const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require('path');
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1";
const Creadential = require('../model/Users');
const nodemailer = require("nodemailer")
require("dotenv").config();
 const Otp = require('../model/otp'); 
const AuditLog = require('../model/auditLog');

const signUp = async (req, res) => {
    try {
        const { first_name,last_name,phone,address,country,region_state, email, confirm_password, profile_picture, role } = req.body;

        if (!first_name || !email || !confirm_password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(confirm_password, 10);
        const user = new Creadential({ first_name, last_name,phone,address,country,region_state, email, confirm_password: hashedPassword, profile_picture, role });
        

        // Setup Nodemailer Transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email Content
        // const mailOptions = {
        //     from: '"TimeSaber" <process.env.EMAIL_USER>',
        //     to: user.email,
        //     subject: "Account Created Successfully",
        //     html: `
        //         <h1>Welcome to TimeSaber</h1>
        //         <p>Your account has been created successfully.</p>
        //         <p><strong>User ID:</strong> ${user._id}</p>
        //     `
        // };

        // Send Email
        // const info = await transporter.sendMail(mailOptions);
       

        const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

        // Replace the part that sends the welcome email with this:
        const otpCode = generateOtp();
        await Otp.create({ email: user.email, otp: otpCode });

        const mailOptions = {
        from: `"TimeSaber" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your TimeSaber Account",
        html: `
            <h2>OTP Verification</h2>
            <p>Use the following code to verify your account:</p>
            <h1>${otpCode}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        `
        };

        const info =await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "OTP sent to email", email: user.email });
       
        console.log("Email sent:", info.response);
        await user.save();
        // res.status(201).json({ message: "User created successfully", user, emailInfo: info });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error signing up", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Creadential.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found. Please sign up." });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            
            // Log account lock attempt
            const lockAuditEntry = new AuditLog({
                userId: user._id,
                userEmail: user.email,
                userName: `${user.first_name} ${user.last_name}`,
                action: 'ACCOUNT_LOCKED',
                details: {
                    address: user.address,
                    country: user.country,
                    region_state: user.region_state,
                    phone: user.phone,
                    reason: 'Attempted login while account was locked',
                    remainingLockTime: remainingTime
                },
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip,
                userAgent: req.headers['user-agent']
            });
            lockAuditEntry.save().catch(err => console.error('Error saving lock audit log:', err));
            
            return res.status(423).json({ 
                message: `Account is locked. Please try again in ${remainingTime} minutes.`,
                lockedUntil: user.lockUntil
            });
        }

        // Reset lock if lock period has expired
        if (user.lockUntil && user.lockUntil <= Date.now()) {
            user.loginAttempts = 0;
            user.lockUntil = null;
            await user.save();
        }

        const isMatch = await bcrypt.compare(password, user.confirm_password);
        
        if (!isMatch) {
            // Increment failed login attempts
            user.loginAttempts += 1;
            
            // Log failed login attempt
            const failedAuditEntry = new AuditLog({
                userId: user._id,
                userEmail: user.email,
                userName: `${user.first_name} ${user.last_name}`,
                action: 'LOGIN_FAILED',
                details: {
                    address: user.address,
                    country: user.country,
                    region_state: user.region_state,
                    phone: user.phone,
                    attemptNumber: user.loginAttempts,
                    remainingAttempts: 3 - user.loginAttempts
                },
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip,
                userAgent: req.headers['user-agent']
            });
            failedAuditEntry.save().catch(err => console.error('Error saving failed login audit log:', err));
            
            // Check if account should be locked (3 failed attempts)
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 2 * 60 * 1000); // Lock for 2 minutes
                await user.save();
                
                // Log account lock
                const lockAuditEntry = new AuditLog({
                    userId: user._id,
                    userEmail: user.email,
                    userName: `${user.first_name} ${user.last_name}`,
                    action: 'ACCOUNT_LOCKED',
                    details: {
                        address: user.address,
                        country: user.country,
                        region_state: user.region_state,
                        phone: user.phone,
                        reason: 'Too many failed login attempts',
                        lockDuration: '2 minutes',
                        lockUntil: user.lockUntil
                    },
                    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip,
                    userAgent: req.headers['user-agent']
                });
                lockAuditEntry.save().catch(err => console.error('Error saving account lock audit log:', err));
                
                return res.status(423).json({ 
                    message: "Account locked due to too many failed attempts. Please try again in 2 minutes.",
                    lockedUntil: user.lockUntil
                });
            }
            
            await user.save();
            return res.status(401).json({ 
                message: `Invalid email or password. ${3 - user.loginAttempts} attempts remaining.` 
            });
        }

        // Successful login - reset attempts
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, name: user.full_name, image: user.profile_picture },
            SECRET_KEY,
            { expiresIn: "10h" }
        );

        // Add user to request object for audit logging
        req.user = user;

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // The actual logout logic is handled by the frontend (token removal)
        // This endpoint is mainly for audit logging purposes
        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};
// @desc Upload Single Image
// @route POST /api/creds/profile
// @access Private

const uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
        success: true,
        data: req.file.filename,
    });
};

const getuser = async (req, res) => {
    try {
        const user = await Creadential.find();
        res.status(200).json(user);
    }
    catch (e) {
        res.json(e)
    }
}

const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await Creadential.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            address: user.address,
            country: user.country,
            region_state: user.region_state,
            email: user.email,
            profile_picture: user.profile_picture
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// New: Update Profile for Logged-in User
const updateProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const { first_name, last_name, phone, address, country, region_state, email, profile_picture } = req.body;

        const updatedUser = await Creadential.findByIdAndUpdate(
            decoded.userId,
            { first_name, last_name, phone, address, country, region_state, email, profile_picture },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await Creadential.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `https://localhost:5000/resetpassword?token=${resetToken}`;
        const mailOptions = {
            from: '"TimeSaber" <process.env.EMAIL_USER>',
            to: email,
            subject: "Password Reset Request",
            html: `
                <h1>Reset Your Password</h1>
                <p>You requested a password reset for your VitalFlow account.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Reset email sent:", info.response);

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ message: "Error sending reset email", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await Creadential.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.confirm_password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};
 const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid OTP' });
  await Creadential.findOneAndUpdate({ email }, { verified: true });
  await Otp.deleteMany({ email });
  res.status(200).json({ message: 'User verified' });
};
module.exports = {
    signUp,
    login,
    logout,
    uploadImage,
    getuser,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyOtp
    // Export multer for use in routes
};
