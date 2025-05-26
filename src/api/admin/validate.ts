import * as Joi from "joi";

export default {
  userLogin: {
    payload: Joi.object({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  userSignUp: {
    payload: Joi.object({
      refPassword: Joi.string().required(),
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refUserEmail: Joi.string().required(),
      refMoblile: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteBookings: {
    payload: Joi.object({
      refUserBookingId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
