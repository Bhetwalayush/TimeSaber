const joi = require('joi');

const userScheme = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required().email(),
    contact_no: joi.number().required()

})

function UserValidations(req, res, next) {
    const { full_name, email, contact_no } = req.body;
    const { error } = userScheme.validate({ full_name, email, contact_no });
    if (error) {
        return res.json("data validation error")

    }
    next();
}

module.exports = UserValidations;