const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null)
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': '"rating" must be a number between 1 and 5',
                'number.min': '"rating" must be at least 1',
                'number.max': '"rating" cannot be greater than 5',
                'any.required': '"rating" is required',
            }),
        comment: Joi.string().required(),
    }).required()
});