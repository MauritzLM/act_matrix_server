
const auth = require("../middlewares/authJWT");
const db = require("../db");
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// get matrix
exports.getMatrix = [
    auth,
    async function (req, res, next) {
        try {
            // get instance id from request
            const { id } = req.body;

            // get matrix using title
            const text = 'SELECT * FROM matrices WHERE instance_id = $1';
            const values = [id];

            const result = await db.query(text, values);

            const matrix = result.rows[0];

            // respond with result
            res.json(matrix);

        }
        catch (error) {
            return next(error)
        }
    }
];

// get all matrix
exports.getAllMatrix = [
    auth,
    async function (req, res, next) {
        try {
            // get user id from request
            const { user_id } = req.body;

            // query db
            const text = 'SELECT * FROM matrices WHERE user_profile = $1';
            const values = [user_id];

            const result = await db.query(text, values);

            // return result
            const user_matrix_instances = result.rows;

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
    body('title', 'please enter a title')
        .trim()
        .isLength({ min: 4, max: 20 })
        .escape(),
    async function (req, res, next) {
        try {

            // validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.json({ errors: errors.array() });
                return;
            }

            // get title and user id from request
            const { title, user_id } = req.body;

            // create new matrix instance
            const text = 'INSERT INTO matrices (user_profile, title) VALUES ($1, $2) RETURNING instance_id';
            const values = [user_id, title];

            const result = await db.query(text, values);

            // get created instance id
            const { instance_id } = result.rows[0];

            if (!result.rows[0]) {
                return res.json("something went wrong")
            };

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
            // validate and sanitize
            // get id and quadrant content from request
            const { instance_id, quadrant_content, quadrant_number } = req.body;

            let text;

            // sanitize html content
            const quadrant_sanitized = sanitizeHtml(quadrant_content);

            // text of db query based on which quadrant
            switch (quadrant_number) {
                case 1:
                    text = 'UPDATE matrices SET quadrant_1 = $1 WHERE instance_id = $2';
                    break;
                case 2:
                    text = 'UPDATE matrices SET quadrant_2 = $1 WHERE instance_id = $2';
                    break;
                case 3:
                    text = 'UPDATE matrices SET quadrant_3 = $1 WHERE instance_id = $2';
                    break;
                case 4:
                    text = 'UPDATE matrices SET quadrant_4 = $1 WHERE instance_id = $2';
            }

            // query db
            const values = [quadrant_sanitized, instance_id];

            const result = await db.query(text, values);

            // success message
            res.json("save successful");

        }
        catch (error) {
            return next(error);
        }
    }
];

// update matrix title
exports.updateTitle = [
    auth,
    body('newTitle', 'please enter a title')
        .trim()
        .isLength({ min: 4, max: 20 })
        .escape(),
    async function (req, res, next) {
        try {
            // validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.json({ errors: errors.array() });
                return;
            }

            // get instance id and new title from request
            const { instance_id, newTitle } = req.body;


            const text = 'UPDATE matrices SET title = $1 WHERE instance_id = $2';
            const values = [newTitle, instance_id];

            const result = await db.query(text, values);

            // success message
            res.json(result);
        }
        catch (error) {
            return next(error)
        }
    }
];

// delete matrix
exports.deleteMatrix = [
    auth,
    body('title', 'please enter a valid title')
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

            // get instance id from request
            const { instance_id, user_id, title } = req.body;

            // remove row from table using id
            const text = 'DELETE FROM matrices WHERE instance_id = $1 AND user_profile = $2 AND title = $3';
            const values = [instance_id, user_id, title];

            const result = await db.query(text, values);

            // incorrect title
            if (!result.rowCount) {
                res.json({ errors: [{ msg: 'please enter the correct title' }] });
                return;
            }

            // success
            res.json("delete successful");
        }
        catch (error) {
            return next(error)
        }
    }
];