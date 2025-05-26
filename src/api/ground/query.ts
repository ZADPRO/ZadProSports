export const updateHistoryQuery = `
INSERT INTO
  public."refTxnHistory" (
    "refTransactionTypeId",
    "refUserId",
    "refTransData",
    "updatedAt",
    "updatedBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *;
`;

export const addGroundQuery = `
INSERT INTO
  public."refGround" (
    "refGroundName",
    "refGroundCustId",
    "isAddOnAvailable",
    "refAddOnsId",
    "refFeaturesId",
    "refUserGuidelinesId",
    "refAdditionalTipsId",
    "refSportsCategoryId",
    "refFacilitiesId",
    "refGroundPrice",
    "refGroundImage",
    "refGroundLocation",
    "refGroundPincode",
    "refGroundState",
    "refDescription",
    "refStatus",
    "createdAt",
    "createdBy"
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18
  )
RETURNING
  *;
`;

export const getLastGroundIdQuery = `
SELECT
  COUNT(*)
FROM
  public."users" u
WHERE
  u."refCustId" LIKE 'CGA-GRD-%';
`;

export const getImageRecordQuery = `
SELECT
  *
FROM
  public."refGround"
WHERE
  "refGroundId" = $1;
`;
export const deleteImageRecordQuery = `
UPDATE
  public."refGround"
SET
  "refRoomImage" = NULL
WHERE
  "refGroundId" = $1
RETURNING
  *;
`;
export const deleteGroundImageRecordQuery = `
UPDATE
  public."refGround"
SET
  "refGroundImage" = NULL
WHERE
  "refGroundId" = $1
RETURNING
  *;
`;

export const updateGroundQuery = `
UPDATE public."refGround"
SET
  "refGroundName" = $2,
  "isAddOnAvailable" = $3,
  "refAddOnsId" = $4,
  "refFeaturesId" = $5,
  "refUserGuidelinesId" = $6,
  "refAdditionalTipsId" = $7,
  "refSportsCategoryId" = $8,
  "refFacilitiesId" = $9,
  "refGroundPrice" = $10,
  "refGroundImage" = $11,
  "refGroundLocation" = $12,
  "refGroundPincode" = $13,
  "refGroundState" = $14,
  "refDescription" = $15,
  "refStatus" = $16,
  "updatedAt" = $17,
  "updatedBy" = $18
WHERE
  "refGroundId" = $1
RETURNING *;

`;

export const listGroundQuery = `
SELECT
  rg.*,
  ao."refAddOn",
  aa."unAvailabilityDate",
  array_agg(DISTINCT f."refFeaturesId") AS "refFeaturesIds",
  array_agg(DISTINCT fe."refFacilitiesId") AS "refFacilitiesIds",
  array_agg(DISTINCT ug."refUserGuidelinesId") AS "refUserGuidelinesIds",
  array_agg(DISTINCT ad."refAdditionalTipsId") AS "refAdditionalTipsIds",
  array_agg(DISTINCT s."refSportsCategoryId") AS "refSportsCategoryIds"
FROM
  public."refGround" rg
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = rg."refAddOnsId"
  LEFT JOIN public."addOnUnAvailability" aa ON CAST(aa."refAddOnsId" AS INTEGER) = rg."refAddOnsId"
  LEFT JOIN public."refFeatures" f ON CAST(f."refFeaturesId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(rg."refFeaturesId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
  LEFT JOIN public."refFacilities" fe ON CAST(fe."refFacilitiesId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(rg."refFacilitiesId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
  LEFT JOIN public."refUserGuidelines" ug ON CAST(ug."refUserGuidelinesId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(rg."refUserGuidelinesId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
  LEFT JOIN public."refAdditionalTips" ad ON CAST(ad."refAdditionalTipsId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(rg."refAdditionalTipsId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
  LEFT JOIN public."refSportsCategory" s ON CAST(s."refSportsCategoryId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
WHERE
  rg."isDelete" IS NOT true
GROUP BY
  rg."refGroundId",
  ao."refAddOn",
  aa."unAvailabilityDate";
  
  `;

export const deleteGroundQuery = `
UPDATE
  public."refGround"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refGroundId" = $1
RETURNING
  *;
`;

export const getGroundQuery = `
SELECT
  rg.*,
  ao."refAddOn",
  aa."unAvailabilityDate",
  array_agg(DISTINCT f."refFeaturesName") AS "refFeaturesName",
  array_agg(DISTINCT fe."refFacilitiesName") AS "refFacilitiesName",
  array_agg(DISTINCT ug."refUserGuidelinesName") AS "refUserGuidelinesName",
  array_agg(DISTINCT ad."refAdditionalTipsName") AS "refAdditionalTipsName",
  array_agg(DISTINCT s."refSportsCategoryName") AS "refSportsCategoryName"
FROM
  public."refGround" rg
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = rg."refAddOnsId"
  LEFT JOIN public."addOnUnAvailability" aa ON CAST(aa."refAddOnsId" AS INTEGER) = aa."refAddOnsId"
  LEFT JOIN public."refFeatures" f ON CAST(f."refFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refFeaturesId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refFacilities" fe ON CAST(fe."refFacilitiesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refFacilitiesId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refUserGuidelines" ug ON CAST(ug."refUserGuidelinesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refUserGuidelinesId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refAdditionalTips" ad ON CAST(ad."refAdditionalTipsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refAdditionalTipsId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refSportsCategory" s ON CAST(s."refSportsCategoryId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  rg."refGroundId" = $1
GROUP BY
  rg."refGroundId",
  ao."refAddOn",
  aa."unAvailabilityDate";
  `;

export const listBookedDatesQuery = `
SELECT
  u."refBookingStartDate",
  u."refBookingEndDate"
FROM
  public."refUserBooking" u
WHERE
  u."isDelete" IS NOT true
  AND u."refBookingStartDate"::Date >= NOW()::date
  OR u."refBookingEndDate"::date >= NOW()::date
`;

export const addAddOnsQuery = `
INSERT INTO
  public."refAddOns" (
    "refAddOn",
    "refGroundId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4)
RETURNING
  *;
`;

export const updateAddOnsQuery = `
UPDATE
  public."refAddOns"
SET
  "refAddOn" = $2,
  "refGroundId" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "refAddOnsId" = $1
RETURNING
  *;
`;

export const deleteAddonsQuery = `
UPDATE
  public."refAddOns"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refAddOnsId" = $1
RETURNING
  *;
`;

export const listAddonesQuery = `
SELECT
  *
FROM
  public."refAddOns"
WHERE
  "isDelete" IS NOT true
`;

export const addAddOnsAvailabilityQuery = `
INSERT INTO
  public."addOnUnAvailability" (
    "unAvailabilityDate",
    "refAddOnsId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4)
RETURNING
  *;
`;

export const updateAddOnsAvailabilityQuery = `
UPDATE
  public."addOnUnAvailability"
SET
  "unAvailabilityDate" = $2,
  "refAddOnsId" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "addOnsAvailabilityId" = $1
RETURNING
  *;
`;

export const deleteAddonsAvailabilityQuery = `
UPDATE
  public."addOnUnAvailability"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "addOnsAvailabilityId" = $1
RETURNING
  *;
`;

export const listAddonesAvailabilityQuery = `
SELECT
  *
FROM
  public."addOnUnAvailability"
WHERE
  "isDelete" IS NOT true
`;