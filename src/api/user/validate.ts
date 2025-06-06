import * as Joi from "joi";

export default {
  login: {
    payload: Joi.object({
      login: Joi.string().required(),
      password: Joi.string().required(),
      roleID:Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  userGroundBooking: {
    payload: Joi.object({
      refGroundId: Joi.number().integer().required(),
      isFoodNeeded: Joi.boolean().required(),
      refComboId: Joi.alternatives().conditional("isFoodNeeded", {
        is: true,
        then: Joi.number().integer().required(),
        otherwise: Joi.allow(null, ""),
      }),
      refComboCount: Joi.alternatives().conditional("isFoodNeeded", {
        is: true,
        then: Joi.number().integer().required(),
        otherwise: Joi.allow(null, ""),
      }),
      refBookingTypeId: Joi.number().integer().required(),
      refBookingEndDate: Joi.alternatives().conditional("refBookingTypeId", {
        is: 1,
        then: Joi.string().required(),
        otherwise: Joi.allow(null, ""),
      }),
      isRoomNeeded: Joi.boolean().required(),
      refBookingStartDate: Joi.string().required(),
      refStartTime: Joi.string().required(),
      refEndTime: Joi.string().required(),
      additionalNotes: Joi.string().allow("", null).optional(),
    }),
  },
  listFilteredGrounds: {
    payload: Joi.object({
      refSportsCategoryId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateProfileData: {
    payload: Joi.object({
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refUserEmail: Joi.string().email().required(),
      refMoblile: Joi.string().required(),
    }),
  },
  forgotPassword: {
    payload: Joi.object({
      emailId: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  resetPassword: {
    payload: Joi.object({
      emailId: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
