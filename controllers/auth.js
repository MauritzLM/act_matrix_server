const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


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
            // send error message to client*
            return next(error)
        }
    }
];

// LOGIN
exports.login = [
    // 1. validate and sanitize
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
            const { username, password } = req.body;

            // 2. find user
            const text = 'SELECT FROM user_profiles WHERE username = $1';
            const values = [username];

            // query db
            const result = await db.query(text, values);

            // 3. if user exists get password from query and compare

            // bcrypt.compare(password, user.password)

            // 4. if password matches create / sign JWT
            //   create JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    userName: user.name
                },
                "private_key",
                { expiresIn: "24h" }
            );

            // 5. send success response (token, userid)
            res.status(200).send({
                message: "Login Successful",
                token,
            });
        }
        catch (error) {
            return next(error);
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