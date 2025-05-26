import * as Joi from "joi";

export default {
  addFeedBack: {
    payload: Joi.object({
      refGroundId: Joi.number().required(),
      refContent: Joi.string().required(),
      refRatings: Joi.number().min(1).max(5).required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  groundFeedBack: {
    payload: Joi.object({
      refGroundId: Joi.number().required(),
      refContent: Joi.string().required(),
      refRatings: Joi.number().min(1).max(5).required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
