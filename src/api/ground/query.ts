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

// export const addGroundQuery = `
// INSERT INTO
//   public."refGround" (
//     "refGroundName",
//     "refGroundCustId",
//     "isAddOnAvailable",
//     "refAddOnsId",
//     "refFeaturesId",
//     "refUserGuidelinesId",
//     "refAdditionalTipsId",
//     "refSportsCategoryId",
//     "refFacilitiesId",
//     "refGroundPrice",
//     "refGroundImage",
//     "refGroundLocation",
//     "refGroundPincode",
//     "refGroundState",
//     "refDescription",
//     "refStatus",
//     "IframeLink",
//     "createdAt",
//     "createdBy"
//   )
// VALUES
//   (
//     $1,
//     $2,
//     $3,
//     $4,
//     $5,
//     $6,
//     $7,
//     $8,
//     $9,
//     $10,
//     $11,
//     $12,
//     $13,
//     $14,
//     $15,
//     $16,
//     $17,
//     $18,
//     $19
//   )
// RETURNING
//   *;
// `;

export const addGroundQuery = `
INSERT INTO
  public."refGround" (
    "refGroundName",
    "refGroundCustId",
    "isAddOnAvailable",
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
    "IframeLink",
    "refTournamentPrice",
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
    $18,
    $19
  )
RETURNING
  *;
  `;

export const getLastGroundIdQuery = `
SELECT
  COUNT(*)
FROM
  public."refGround" gr
WHERE
  gr."refGroundCustId" LIKE 'CGA-GRD-%';
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
  "IframeLink" = $17,
  "updatedAt" = $18,
  "updatedBy" = $19
WHERE
  "refGroundId" = $1
RETURNING *;


`;

export const listGroundQuery = `
SELECT
  rg.*,
  array_agg(DISTINCT ao."refAddOnsId") AS "AddOn",
  array_agg(DISTINCT f."refFeaturesId") AS "refFeaturesIds",
  array_agg(DISTINCT fe."refFacilitiesId") AS "refFacilitiesIds",
  array_agg(DISTINCT ug."refUserGuidelinesId") AS "refUserGuidelinesIds",
  array_agg(DISTINCT ad."refAdditionalTipsId") AS "refAdditionalTipsIds",
  array_agg(DISTINCT s."refSportsCategoryId") AS "refSportsCategoryIds"
FROM
  public."refGround" rg
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rg."refAddOnsId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
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
  rg."isDelete" IS NOT true
  AND rg."createdBy"::integer = $1::integer
GROUP BY
  rg."refGroundId";

  `;
// export const listGroundQuery = `
// SELECT
//   rg.*,
//   ao."refAddOn",
//   aa."unAvailabilityDate",
//   array_agg(DISTINCT f."refFeaturesId") AS "refFeaturesIds",
//   array_agg(DISTINCT fe."refFacilitiesId") AS "refFacilitiesIds",
//   array_agg(DISTINCT ug."refUserGuidelinesId") AS "refUserGuidelinesIds",
//   array_agg(DISTINCT ad."refAdditionalTipsId") AS "refAdditionalTipsIds",
//   array_agg(DISTINCT s."refSportsCategoryId") AS "refSportsCategoryIds"
// FROM
//   public."refGround" rg
//   LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = rg."refAddOnsId"
//   LEFT JOIN public."addOnUnAvailability" aa ON CAST(aa."refAddOnsId" AS INTEGER) = rg."refAddOnsId"
//   LEFT JOIN public."refFeatures" f ON CAST(f."refFeaturesId" AS INTEGER) = ANY (
//     string_to_array(regexp_replace(rg."refFeaturesId", '[{}]', '', 'g'), ',')::INTEGER[]
//   )
//   LEFT JOIN public."refFacilities" fe ON CAST(fe."refFacilitiesId" AS INTEGER) = ANY (
//     string_to_array(regexp_replace(rg."refFacilitiesId", '[{}]', '', 'g'), ',')::INTEGER[]
//   )
//   LEFT JOIN public."refUserGuidelines" ug ON CAST(ug."refUserGuidelinesId" AS INTEGER) = ANY (
//     string_to_array(regexp_replace(rg."refUserGuidelinesId", '[{}]', '', 'g'), ',')::INTEGER[]
//   )
//   LEFT JOIN public."refAdditionalTips" ad ON CAST(ad."refAdditionalTipsId" AS INTEGER) = ANY (
//     string_to_array(regexp_replace(rg."refAdditionalTipsId", '[{}]', '', 'g'), ',')::INTEGER[]
//   )
//   LEFT JOIN public."refSportsCategory" s ON CAST(s."refSportsCategoryId" AS INTEGER) = ANY (
//     string_to_array(regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'), ',')::INTEGER[]
//   )
// WHERE
//   rg."isDelete" IS NOT true
// GROUP BY
//   rg."refGroundId",
//   ao."refAddOn",
//   aa."unAvailabilityDate";
//   `;

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
  string_to_array(regexp_replace(rg."refFeaturesId", '[{}]', '', 'g'), ',')::int[] AS "refFeaturesId",
  string_to_array(regexp_replace(rg."refUserGuidelinesId", '[{}]', '', 'g'), ',')::int[] AS "refUserGuidelinesId",
  string_to_array(regexp_replace(rg."refFacilitiesId", '[{}]', '', 'g'), ',')::int[] AS "refFacilitiesId",
  string_to_array(regexp_replace(rg."refAdditionalTipsId", '[{}]', '', 'g'), ',')::int[] AS "refAdditionalTipsId",
  string_to_array(regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'), ',')::int[] AS "refSportsCategoryId",

  (
    SELECT json_agg(DISTINCT f."refFeaturesName")
    FROM public."refFeatures" f
    WHERE CAST(f."refFeaturesId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rg."refFeaturesId", '[{}]', '', 'g'), ',')::int[]
    )
  ) AS "refFeaturesName",

  (
    SELECT json_agg(DISTINCT fe."refFacilitiesName")
    FROM public."refFacilities" fe
    WHERE CAST(fe."refFacilitiesId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rg."refFacilitiesId", '[{}]', '', 'g'), ',')::int[]
    )
  ) AS "refFacilitiesName",

  (
    SELECT json_agg(DISTINCT ug."refUserGuidelinesName")
    FROM public."refUserGuidelines" ug
    WHERE CAST(ug."refUserGuidelinesId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rg."refUserGuidelinesId", '[{}]', '', 'g'), ',')::int[]
    )
  ) AS "refUserGuidelinesName",

  (
    SELECT json_agg(DISTINCT ad."refAdditionalTipsName")
    FROM public."refAdditionalTips" ad
    WHERE CAST(ad."refAdditionalTipsId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rg."refAdditionalTipsId", '[{}]', '', 'g'), ',')::int[]
    )
  ) AS "refAdditionalTipsName",

  (
    SELECT json_agg(DISTINCT s."refSportsCategoryName")
    FROM public."refSportsCategory" s
    WHERE CAST(s."refSportsCategoryId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'), ',')::int[]
    )
  ) AS "refSportsCategoryName",

  (
    SELECT json_agg(
      jsonb_build_object(
        'id', ao."refAddOnsId",
        'addOn', ao."refAddOn",
        'price', ao."refAddonPrice",
        'unAvailabilityDate', aa."unAvailabilityDate",
        'subAddOns', (
          SELECT json_agg(
            jsonb_build_object(
              'id', sa."subAddOnsId",
              'subAddOn', sa."refSubAddOnName",
              'price', sa."refSubAddOnPrice",
              'items', (
                SELECT json_agg(
                  jsonb_build_object(
                    'id', it."refItemsId",
                    'item', it."refItemsName",
                    'price', it."refItemsPrice"
                  )
                )
                FROM public."refItems" it
                WHERE it."subAddOnsId" = sa."subAddOnsId"
              )
            )
          )
          FROM public."subAddOns" sa
          WHERE sa."refAddOnsId" = ao."refAddOnsId"
        )
      )
    )
    FROM public."refAddOns" ao
    LEFT JOIN public."addOnUnAvailability" aa ON aa."refAddOnsId" = ao."refAddOnsId"
    WHERE ao."refGroundId" = rg."refGroundId"
  ) AS "addOns"

FROM public."refGround" rg
WHERE rg."refGroundId" = $1;  
  `;

export const getAvailableAddonsQuery = `
SELECT
  json_agg(
    json_build_object(
      'addOnsAvailabilityId',
      aa."addOnsAvailabilityId",
      'refAddOnsId',
      ao."refAddOnsId",
      'refAddOn',
      ao."refAddOn",
      'refGroundId',
      ao."refGroundId",
      'unAvailabilityDate',
      aa."unAvailabilityDate"
    )
  ) AS arraydata
FROM
  public."addOnUnAvailability" aa
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = aa."refAddOnsId"
WHERE
  aa."isDelete" IS NOT true
  AND aa."refGroundId" = $1
  AND ao."refAddOnsId" != '1'
  AND ao."refStatus" IS true
AND aa."createdBy"::INTEGER = '1'::INTEGER
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

export const imgResultQuery = `
SELECT
  *
FROM
  public."refGround"
WHERE
  "refGroundId" = $1
`;

export const addAddOnsQuery = `
INSERT INTO
  public."refAddOns" (
    "refAddOn",
    "refGroundId",
    "refStatus",
    "refAddOnPrice",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *;
`;

export const updateAddOnsQuery = `
UPDATE
  public."refAddOns"
SET
  "refAddOn" = $2,
  "refGroundId" = $3,
  "refStatus" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
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
  AND "refStatus" IS true
   AND "createdBy"::int = $1
`;

export const addAddOnsAvailabilityQuery = `
INSERT INTO
  public."addOnUnAvailability" (
    "unAvailabilityDate",
    "refAddOnsId",
    "refGroundId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *;
`;

export const updateAddOnsAvailabilityQuery = `
UPDATE
  public."addOnUnAvailability"
SET
  "unAvailabilityDate" = $2,
  "refAddOnsId" = $3,
  "refGroundId" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
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
  AND "createdBy"::INTEGER = '1'::INTEGER
`;

export const listaddonsQuery = `
SELECT
  *
FROM
  public."refAddOns"
WHERE
  "refStatus" IS true
  AND "isDelete" IS NOT true
  AND "refAddOn" != 'Ground'
  AND "refGroundId" = $1
`;
//  AND "createdBy"::integer = $1::integer