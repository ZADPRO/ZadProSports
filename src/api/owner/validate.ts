import * as Joi from "joi";

export default {
  addOwners: {
    payload: Joi.object({
      refOwnerFname: Joi.string().required(),
      refOwnerLname: Joi.string().required(),
      refEmailId: Joi.string().email().required(),
      refMobileId: Joi.string()
        .pattern(/^\d{10}$/)
        .required(),
      refCustPassword: Joi.string().min(8).required(),
      refAadharId: Joi.string().length(12).required(),
      refPANId: Joi.string().length(10).required(),
      refGSTnumber: Joi.string().length(15).required(),
      isOwnGround: Joi.boolean().required(),
      refGroundImage: Joi.string().required(),
      refGroundDescription: Joi.string().required(),
      refBankName: Joi.string().required(),
      refBankBranch: Joi.string().required(),
      refAcHolderName: Joi.string().required(),
      refAccountNumber: Joi.string().min(8).required(),
      refIFSCcode: Joi.string().length(11).required(),
      refDocument1Path: Joi.string().required(),
      refDocument2Path: Joi.string().required(),
      isDefaultAddress: Joi.boolean().required(),

      // groundAddress is required only if isDefaultAddress is true
      groundAddress: Joi.alternatives().conditional("isDefaultAddress", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),

      refGroundSports: Joi.array()
        .items(
          Joi.object({
            id: Joi.number().required(),

            // if isDefaultAddress is false, then groundAddress is required for each sport,
            // if true, groundAddress is forbidden here because common address is used
            groundAddress: Joi.alternatives().conditional(
              Joi.ref("/isDefaultAddress"),
              {
                is: false,
                then: Joi.string().required(),
                otherwise: Joi.forbidden(),
              }
            ),
          })
        )
        .min(1)
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
 updateOwners: {
  payload: Joi.object({
    refOwnerFname: Joi.string().required(),
    refOwnerLname: Joi.string().required(),
    refEmailId: Joi.string().email().required(),
    refMobileId: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    refCustPassword: Joi.string().min(8).required(),
    refAadharId: Joi.string().length(12).required(),
    refPANId: Joi.string().length(10).required(),
    refGSTnumber: Joi.string().length(15).required(),
    isOwnGround: Joi.boolean().required(),
    refGroundImage: Joi.string().required(),
    refGroundDescription: Joi.string().required(),
    refBankName: Joi.string().required(),
    refBankBranch: Joi.string().required(),
    refAcHolderName: Joi.string().required(),
    refAccountNumber: Joi.string().min(8).required(),
    refIFSCcode: Joi.string().length(11).required(),
    refDocument1Path: Joi.string().required(),
    refDocument2Path: Joi.string().required(),

    // Optional root groundAddress used when isDefaultAddress is true
    groundAddress: Joi.string().optional(),

    // Array of sport objects with required id,
    // and optional groundAddress (used if isDefaultAddress is false)
    refGroundSports: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          groundAddress: Joi.string().optional(),
        })
      )
      .min(1)
      .required(),

    // Flag to indicate if root groundAddress applies to all sports
    isDefaultAddress: Joi.boolean().required(),
  }),

  headers: Joi.object({
    authorization: Joi.string().optional(),
  }).unknown(),
},

  getOwners: {
    payload: Joi.object({
      refOwnerId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteOwners: {
    payload: Joi.object({
      refOwnerId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  approveOwners: {
    payload: Joi.object({
      refUserId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
