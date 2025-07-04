const Joi = require("joi");

// User Schema (existing)
module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        fullName: Joi.string().required(),
        birthDate: Joi.date().required(),
        currentResidence: Joi.string().required(),
        localAddress: Joi.string().required(),
        mobileNumber: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.pattern.base": "Mobile number must be 10 digits"
            }),
        documents: Joi.array().items(
            Joi.object({
                type: Joi.string()
                    .valid('Aadhar Card', 'PAN Card', 'Voter ID', 'Passport', 'Driving License')
                    .required(),
                documentNumber: Joi.string(),
            })
        ).min(1),
    }).required()
});

// Event Schema (new - this was missing)
module.exports.eventSchema = Joi.object({
  
        title: Joi.string().required(),
        description: Joi.string().allow(""),
        date: Joi.date().required(),
        time: Joi.string().required(),
        venue: Joi.string().required(),
        ticketPrice: Joi.number().min(0).default(0),
        location: Joi.string().allow(""),
        country: Joi.string().allow(""),
        category: Joi.string()
            .valid('cultural', 'food', 'entertainment', 'sports', 'networking', 'religious')
            .default('cultural'),
        maxAttendees: Joi.number().min(0).default(0),
  
});

