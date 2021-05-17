import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

// API to load list of users from data.js
userRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        // await User.deleteMany({});
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    })
);

// API to check if entered user details are correct for sign in.
userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
            }
        }
        res.status(401).send({ message: 'Invalid email or password' });
    })
);

export default userRouter;