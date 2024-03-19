// all AUTH endpoints*
const auth = require("../middlewares/authJWT");
const db = require("../db");
const { body, validationResult } = require('express-validator');

// auth function provides user_id and username - (req.user)*

// get matrix
exports.getMatrix = [auth,
    async function (req, res, next) {
        try {
            // get info from req.user (passed from auth function) / req.body*
            const { id } = req.body;

            // get matrix using title
            const text = 'SELECT * FROM matrix_instances WHERE instance_id = $1';
            const values = [id];

            const result = await db.query(text, values);

            const matrix = result.rows[0];

            res.json(matrix);

        }
        catch (error) {
            return next(error)
        }
    }
];

// get all matrix
exports.getAllMatrix = [auth,
    async function (req, res, next) {
        try {
            // get user id from request
            const { id } = req.body;

            // query db
            const text = 'SELECT * FROM matrix_instances WHERE user_profile = $2';
            const values = [id];

            const result = await db.query(text, values);

            // return result
            const user_matrix_instances = result.rows[0];

            res.json(user_matrix_instances);

        }
        catch (error) {
            return next(error);
        }
    }
];

// create new matrix
exports.createMatrix = [
    auth,
    async function (req, res, next) {
        try {
            // get title and user id
            const { title } = req.body;
            const { user_id } = req.user;

            // create new matrix instance
            const text = 'INSERT INTO matrix_instances (user_profile, title) VALUES ($1, $2) RETURNING instance_id';
            const values = [user_id, title];

            const result = await db.query(text, values);

            // get created instance id
            const { instance_id } = result.rows[0];

            if (!result.rows[0]) {
                return res.json("something went wrong")
            };

            // if successful add instance to user_profile
            const user_text = 'UPDATE user_profiles SET matrix_instances = array_append(matrix_instances, $1) WHERE user_id = $2';
            const user_values = [instance_id, user_id];

            const user_result = await db.query(user_text, user_values);

            // send success message
            res.json({ msg: 'matrix created' });
        }
        catch (error) {
            return next(error);
        }
    }
];


// update matrix
exports.updateMatrix = [
    auth,
    async function (req, res, next) {
        try {
            // get id and values from req.body
            const { instance_id, q1, q2, q3, q4 } = req.body;

            // query db
            const text = 'UPDATE matrix_instances SET quadrant_1 = $1, quadrant_2 = $2, quadrant_3 = $3, quadrant_4 = $4 WHERE instance_id = $5';
            const values = [q1, q2, q3, q4 , instance_id];

            const result = await db.query(text, values);

            res.json("matrix updated");

        }
        catch (error) {
            return next(error);
        }
    }
];

// delete matrix
exports.deleteMatrix = [
    auth,
    async function (req, res, next) {
        try {
            const { instance_id } = req.body;

            // remove row from table using id
        }
        catch (error) {
            return next(error)
        }
    }
];

