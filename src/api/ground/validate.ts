import * as Joi from "joi";

export default {
  addGround: {
    payload: Joi.object({
      refGroundName: Joi.string().required(),
      isRoomAvailable: Joi.boolean().required(),
      refRoomImage: Joi.string().required(),
      refFeaturesId: Joi.array().items(Joi.string()).required(),
      refUserGuidelinesId: Joi.array().items(Joi.string()).required(),
      refFacilitiesId: Joi.array().items(Joi.string()).required(),
      refAdditionalTipsId: Joi.array().items(Joi.string()).required(),
      refSportsCategoryId: Joi.array().items(Joi.string()).required(),
      refGroundPrice: Joi.array().items(Joi.string()).required(),
      refGroundImage: Joi.string().required(),
      refGroundLocation: Joi.string().required(),
      refGroundPincode: Joi.string().required(),
      refGroundState: Joi.string().required(),
      refDescription: Joi.string().required(),
      refStatus: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateGround: {
    payload: Joi.object({
      refGroundId: Joi.number().integer().required(),
      refGroundName: Joi.string().required(),
      isRoomAvailable: Joi.boolean().required(),
      refRoomImage: Joi.string().required(),
      refFeaturesId: Joi.array().items(Joi.string()).required(),
      refUserGuidelinesId: Joi.array().items(Joi.string()).required(),
      refFacilitiesId: Joi.array().items(Joi.string()).required(),
      refAdditionalTipsId: Joi.array().items(Joi.string()).required(),
      refSportsCategoryId: Joi.array().items(Joi.string()).required(),
      refGroundPrice: Joi.array().items(Joi.string()).required(),
      refGroundImage: Joi.string().required(),
      refGroundLocation: Joi.string().required(),
      refGroundPincode: Joi.string().required(),
      refGroundState: Joi.string().required(),
      refDescription: Joi.string().required(),
      refStatus: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteGround: {
    payload: Joi.object({
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  getGround: {
    payload: Joi.object({
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  listBookedDates: {
    payload: Joi.object({
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addAddons: {
    payload: Joi.object({
      addOns: Joi.string().required(),
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateAddons: {
    payload: Joi.object({
      refAddOnsId: Joi.number().integer().required(),
      addOns: Joi.string().required(),
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteAddons: {
    payload: Joi.object({
      refAddOnsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addAddonAvailability: {
    payload: Joi.object({
      unAvailabilityDate: Joi.string().required(),
      refAddOnsId: Joi.number().integer().required(),
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateAddonAvailability: {
    payload: Joi.object({
      addOnsAvailabilityId: Joi.number().integer().required(),
      addOnsUnAvailabilityId: Joi.string().required(),
      refAddOnsId: Joi.number().integer().required(),
      refGroundId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteAddonAvailability: {
    payload: Joi.object({
      addOnsAvailabilityId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
