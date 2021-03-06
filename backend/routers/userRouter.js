import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';
import pkg from 'log4js';
const { configure, getLogger } = pkg;
configure("./log4js_config.json");
const logger = getLogger();
logger.level = "info";


const userRouter = express.Router();

// API to load list of users from data.js
userRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        logger.info("[api/users/seed] [SUCESS]")
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
            logger.info("[api/users/signin] [SUCCESS]");
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
        logger.info("[api/users/signin] [FAILED]");
        res.status(401).send({ message: 'Invalid email or password' });
    })
);

userRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        const createdUser = await user.save();
        logger.info("[api/users/register] [SUCCESS]");
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        });
    })
);

userRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            logger.info("[api/users/"+ req.params.id + "] [SUCCESS]");
            res.send(user);
        } else {
            logger.info("[api/users/"+ req.params.id + "] [FAILURE]");
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
        });
    }
    })
);

export default userRouter;
