const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();


// authentication endpoint*
// app.get("/auth-endpoint", auth, (request, response) => {
//     response.json({ message: "You are authorized to access me" });
//   });


// SIGN UP
exports.signup = [
    // 1. validate and sanitize
    body('username', 'please enter a valid name')
        .trim()
        .isLength({ min: 4, max: 20 })
        .escape(),
    body('password', 'please enter a valid password')
        .trim()
        .isLength({ min: 8, max: 20 })
        .escape(),

    async function (req, res, next) {
        try {
            // validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.json({ errors: errors.array() });
                return;
            }

            // error handling when user already exists*

            // get username and password from req body 
            const { username, password } = req.body;

            // 2. hash password with bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. create new user and save in db
            const text = 'INSERT INTO user_profiles (username, password) VALUES($1, $2)';
            const values = [username, hashedPassword];

            // query db
            const result = await db.query(text, values);

            res.json(
                {
                    "message": "user created"
                }
            );
        }
        catch (error) {
            // send error message to client
            res.send(error);
        }
    }
];

// LOGIN
exports.login = [
    // validate and sanitize
    body('username', 'please enter a username')
        .trim()
        .notEmpty()
        .escape(),
    body('password', 'please enter a password')
        .trim()
        .notEmpty()
        .escape(),

    async function (req, res, next) {
        try {
            // validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.json({ errors: errors.array() });
                return;
            }

            const { username, password } = req.body;

            // find user
            const text = 'SELECT * FROM user_profiles WHERE username = $1';
            const values = [username];

            // query db
            const result = await db.query(text, values);

            const user = result.rows[0];

            // if user not found
            if (!user) {
                return res.json({ errors: [{ msg: "user not found" }] });
            };

            // if user found get password from query and compare
            const passwordCompare = await bcrypt.compare(password, user.password);

            // if passwords dont match
            if (!passwordCompare) {
                return res.json({ errors: [{ msg: "passwords don't match" }] });
            }

            // if passwords match create / sign JWT
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    username: user.username
                },
                process.env.PRIVATE_KEY,
                { expiresIn: "24h" }
            );

            // get user matrix instances using user_id
            const user_text = 'SELECT * FROM matrix_instances WHERE user_profile = $1';
            const user_values = [user.user_id];

            const result_2 = await db.query(user_text, user_values);

            const user_matrix_instances = result_2.rows;

            // send success response (token, userid)
            res.status(200).json({
                message: "Login Successful",
                token,
                user_matrix_instances
            });
        }
        catch (error) {
            res.send(error)
        }
    }
];

// LOGOUT
exports.logout = async function (req, res, next) {
    res.send("logout not yet implemented")
}

// REMOVE ACCOUNT
exports.delete = async function (req, res, next) {
    res.send("remove account route not yet implemented")
}