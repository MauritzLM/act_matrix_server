const auth = require("../middlewares/authJWT");
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// function to update user profile
exports.updateProfile = [
    auth,
    body('nickname', 'please enter a valid nickname')
        .trim()
        .isLength({ min: 2, max: 20 })
        .escape(),
    async function (req, res, next) {
        try {
            // validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.json({ errors: errors.array() });
                return;
            }

            // get req body
            const { nickname, user_id } = req.body

            // get access token from management API

            const domain = process.env.AUTH0_DOMAIN;

            const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: `${process.env.AUTH0_CLIENTID}`,
                    client_secret: `${process.env.AUTH0_SECRET}`,
                    audience: `https://${domain}/api/v2/`
                })
            });

            const message = await tokenResponse.json()

            // use token to update user_metadata
            const updateResponse = await fetch(`https://${domain}/api/v2/users/${user_id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${message.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname: nickname })
            });

            const updateMessage = await updateResponse.json();

            res.json("Profile updated");

        }
        catch (error) {
            return next(error)
        }
    }
];