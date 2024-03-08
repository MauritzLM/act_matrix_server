
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


// authentication endpoint*
// app.get("/auth-endpoint", auth, (request, response) => {
//     response.json({ message: "You are authorized to access me" });
//   });


// SIGN UP
exports.signup = async function (req, res, next) {
    try {
        // 1. validate and sanitize
        let password = 'brandywine'

        // 2. hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. create new user and save in db

        res.send({
            name: 'Mo',
            password: hashedPassword
        });
    }
    catch (error) {
        return next(error)
    }
};

// LOGIN
exports.login = async function (req, res, next) {

    try {
        let user = {
            name: 'mo',
            id: '1',
        }
        // 1. validate and sanitize

        // 2. find user

        // 3. if user exists compare password
        // bcrypt.compare(request.body.password, user.password)

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

// LOGOUT
exports.logout = async function (req, res, next) {
    res.send("logout not yet implemented")
}

// REMOVE ACCOUNT
exports.delete = async function (req, res, next) {
    res.send("remove account route not yet implemented")
}