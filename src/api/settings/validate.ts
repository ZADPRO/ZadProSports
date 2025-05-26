import * as Joi from "joi";

export default {
  addSportCategory: {
    payload: Joi.object({
      refSportsCategoryName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateSportCategory: {
    payload: Joi.object({
      refSportsCategoryId: Joi.number().integer().required(),
      refSportsCategoryName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteSportCategory: {
    payload: Joi.object({
      refSportsCategoryId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addFeatures: {
    payload: Joi.object({
      refFeaturesName: Joi.array()
        .items(Joi.object({ refFeaturesName: Joi.string().required() }))
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateFeatures: {
    payload: Joi.object({
      refFeaturesId: Joi.number().integer().required(),
      refFeaturesName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteFeatures: {
    payload: Joi.object({
      refFeaturesId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addUserGuidelines: {
    payload: Joi.object({
      refUserGuidelinesName: Joi.array()
        .items(Joi.object({ refUserGuidelinesName: Joi.string().required() }))
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateUserGuidelines: {
    payload: Joi.object({
      refUserGuidelinesId: Joi.number().integer().required(),
      refUserGuidelinesName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteUserGuidelines: {
    payload: Joi.object({
      refUserGuidelinesId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addFacilities: {
    payload: Joi.object({
      refFacilitiesName: Joi.array()
        .items(Joi.object({ refFacilitiesName: Joi.string().required() }))
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateFacilities: {
    payload: Joi.object({
      refFacilitiesId: Joi.number().integer().required(),
      refFacilitiesName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteFacilities: {
    payload: Joi.object({
      refFacilitiesId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addAdditionalTips: {
    payload: Joi.object({
      refAdditionalTipsName: Joi.array()
        .items(Joi.object({ refAdditionalTipsName: Joi.string().required() }))
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateAdditionalTips: {
    payload: Joi.object({
      refAdditionalTipsId: Joi.number().integer().required(),
      refAdditionalTipsName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteAdditionalTips: {
    payload: Joi.object({
      refAdditionalTipsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  // -------------------------------
  addFoodAndSnacks: {
    payload: Joi.object({
      refFoodCategory: Joi.number().integer().required(),
      refFoodName: Joi.string().required(),
      refPrice: Joi.string().required(),
      refQuantity: Joi.string().required(),
      refFoodImage: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateFoodAndSnacks: {
    payload: Joi.object({
      refFoodAndSnacksId: Joi.number().integer().required(),
      refFoodName: Joi.string().required(),
      refPrice: Joi.string().required(),
      refQuantity: Joi.string().required(),
      refFoodImage: Joi.string().required(),
      refFoodCategory: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteFoodAndSnacks: {
    payload: Joi.object({
      refFoodAndSnacksId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addFoodCombo: {
    payload: Joi.object({
      refGroundId: Joi.array().items(Joi.number().integer()).required(),
      breakfast: Joi.array().items(Joi.string()).required(),
      breakfastTime: Joi.string().required(),
      breakfastPrice: Joi.string().required(),
      lunch: Joi.array().items(Joi.string()).required(),
      lunchTime: Joi.string().required(),
      lunchPrice: Joi.string().required(),
      dinner: Joi.array().items(Joi.string()).required(),
      dinnerTime: Joi.string().required(),
      dinnerPrice: Joi.string().required(),
      snacks1: Joi.array().items(Joi.string()).required(),
      snacks1Time: Joi.string().required(),
      snacks1Price: Joi.string().required(),
      snacks2: Joi.array().items(Joi.string()).required(),
      snacks2Time: Joi.string().required(),
      snacks2Price: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateFoodCombo: {
    payload: Joi.object({
      refComboId: Joi.number().integer().required(),
      refGroundId: Joi.array().items(Joi.number().integer()).required(),
      breakfast: Joi.array().items(Joi.string()).required(),
      breakfastTime: Joi.string().required(),
      breakfastPrice: Joi.string().required(),
      lunch: Joi.array().items(Joi.string()).required(),
      lunchTime: Joi.string().required(),
      lunchPrice: Joi.string().required(),
      dinner: Joi.array().items(Joi.string()).required(),
      dinnerTime: Joi.string().required(),
      dinnerPrice: Joi.string().required(),
      snacks1: Joi.array().items(Joi.string()).required(),
      snacks1Time: Joi.string().required(),
      snacks1Price: Joi.string().required(),
      snacks2: Joi.array().items(Joi.string()).required(),
      snacks2Time: Joi.string().required(),
      snacks2Price: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteFoodCombo: {
    payload: Joi.object({
      refComboId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
