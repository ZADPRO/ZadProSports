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

export const adduserBookingQuery = `
INSERT INTO
  public."refUserBooking" (
    "refUserId",
    "refGroundId",  
    "refBookingTypeId",
    "refAddOnsId",
    "refBookingStartDate",
    "refBookingEndDate",
    "refStartTime",
    "refEndTime",
    "additionalNotes",
    "retTotalAmount",
    "createdAt",
    "createdBy",
    "refBookingAmount",
    "refSGSTAmount",
    "refCGSTAmount"
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
    $15
  )
RETURNING
  *;
`;

export const insertUnavailableQuery = `
            INSERT INTO "addOnUnAvailability"
              ("unAvailabilityDate", "refAddOnsId", "createdAt", "createdBy", "refGroundId")
            VALUES ($1, $2, $3, $4, $5)
          `;

export const listFiletedGroundsQuery = `
SELECT
  rg.*,
  array_agg(DISTINCT f."refFeaturesName") AS "refFeaturesName",
  array_agg(DISTINCT fe."refFacilitiesName") AS "refFacilitiesName",
  array_agg(DISTINCT ug."refUserGuidelinesName") AS "refUserGuidelinesName",
  array_agg(DISTINCT ad."refAdditionalTipsName") AS "refAdditionalTipsName",
  array_agg(DISTINCT s."refSportsCategoryName") AS "refSportsCategoryName"
FROM
  public."refGround" rg
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
  $1 = ANY (
    string_to_array(
      regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  AND rg."isDelete" IS NOT true
GROUP BY
  rg."refGroundId";
`;

export const listGroundsQuery = `
SELECT
  rg.*,
  array_agg(DISTINCT f."refFeaturesName") AS "refFeaturesName",
  array_agg(DISTINCT fe."refFacilitiesName") AS "refFacilitiesName",
  array_agg(DISTINCT ug."refUserGuidelinesName") AS "refUserGuidelinesName",
  array_agg(DISTINCT ad."refAdditionalTipsName") AS "refAdditionalTipsName",
  array_agg(DISTINCT s."refSportsCategoryName") AS "refSportsCategoryName"
FROM
  public."refGround" rg
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
GROUP BY
  rg."refGroundId"
LIMIT
  5;
`;

export const listFreeGroundsQuery = `
SELECT
  rg.*,
  b."refBookingTypeName",
  array_agg(DISTINCT f."refFeaturesName") AS "refFeaturesName",
  array_agg(DISTINCT fe."refFacilitiesName") AS "refFacilitiesName",
  array_agg(DISTINCT ug."refUserGuidelinesName") AS "refUserGuidelinesName",
  array_agg(DISTINCT ad."refAdditionalTipsName") AS "refAdditionalTipsName",
  array_agg(DISTINCT s."refSportsCategoryName") AS "refSportsCategoryName",
  ub."refBookingStartDate",
  ub."refBookingEndDate",
  ub."refStartTime",
  ub."refEndTime"
FROM
  public."refGround" rg
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
  LEFT JOIN public."refUserBooking" ub ON ub."refGroundId" = rg."refGroundId"
  LEFT JOIN public."refBookingType" b ON b."refBookingTypeId" = ub."refBookingTypeId"
WHERE
  $1 = ANY (
    string_to_array(regexp_replace(rg."refSportsCategoryId", '[{}]', '', 'g'), ',')::INTEGER[]
  )
  AND rg."isDelete" IS NOT TRUE
  AND (
    ($2 = 1 AND (
      (
        TO_DATE($3, 'YYYY-MM-DD') NOT BETWEEN ub."refBookingStartDate"::date AND ub."refBookingEndDate"::date
        OR TO_DATE($4, 'YYYY-MM-DD') NOT BETWEEN ub."refBookingStartDate"::date AND ub."refBookingEndDate"::date
        OR ub."refBookingStartDate" IS NULL
      )
    ))
    OR
    ($2 = 2 AND (
      (
        TO_TIMESTAMP($5, 'HH24:MI')::time NOT BETWEEN ub."refStartTime"::time AND ub."refEndTime"::time
        OR TO_TIMESTAMP($6, 'HH24:MI')::time NOT BETWEEN ub."refStartTime"::time AND ub."refEndTime"::time
        OR ub."refStartTime" IS NULL
      )
    ))
  )
GROUP BY
  rg."refGroundId",
  b."refBookingTypeName",
  ub."refBookingStartDate",
  ub."refBookingEndDate",
  ub."refStartTime",
  ub."refEndTime";
    
`;

export const listProfleDataQuery = `
SELECT
  u.*,
  ud."refEmail",
  ud."refMobileNumber"
FROM
  public."users" u
  LEFT JOIN public."refUsersDomain" ud ON CAST (ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."refuserId" = $1

`;


export const updateUserDataQuery = `
UPDATE
  public."users"
SET
  "refUserFname" = $2,
  "refUserLname" = $3,
  "refDoB" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "refuserId" = $1
RETURNING
  *;
`;
export const updateUserDomainQuery = `
UPDATE
  public."refUsersDomain"
SET
  "refMobileNumber" = $2,
  "refEmail" = $3,
  "refUserName" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "refUserId" = $1
RETURNING
  *;
`;

export const getUsersQuery = `
SELECT
  *
FROM
  public.users u
  LEFT JOIN public."refUsersDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  ud."refEmail" = $1
  AND u."refCustId" LIKE 'CGA-CUS-%';
`;

export const updateUserPasswordQuery = `
UPDATE
  public."refUsersDomain"
SET
  "refCustPassword" = $2,
  "refCustHashedPassword" = $3,
  "updatedAt" = $4

WHERE
  "refEmail" = $1
RETURNING
  *;
`;

// export const listUserBookingHistoryQuery = `
// SELECT
//   ub.*,
//   rg."refGroundName",
//   rg."refGroundCustId",
//   rg."isAddOnAvailable",
//   rg."refGroundPrice",
//   rg."refGroundLocation",
//   rg."refGroundPincode",
//   rg."refGroundState",
//   (
//     SELECT json_agg(DISTINCT jsonb_build_object(
//       'addOnId', ao."refAddOnsId",
//       'addon', ao."refAddOn",
//       'selectedDates', (
//         SELECT array_agg(aa."unAvailabilityDate")
//         FROM public."addOnUnAvailability" aa
//         WHERE aa."refAddOnsId" = ao."refAddOnsId"
//           AND aa."refGroundId" = ub."refGroundId"
//           AND aa."isDelete" IS NOT true
//       )
//     ))
//     FROM public."refAddOns" ao
//     WHERE ao."refAddOnsId" = ANY (
//       string_to_array(
//         regexp_replace(ub."refAddOnsId", '[{}]', '', 'g'),
//         ','
//       )::INTEGER[]
//     )
//     AND ao."refStatus" IS true
//   ) AS "AddOn"
// FROM
//   public."refUserBooking" ub
//   LEFT JOIN public."refGround" rg ON CAST(rg."refGroundId" AS INTEGER) = ub."refGroundId"
// WHERE
//   ub."refUserId" = $1
//   AND ub."isDelete" IS NOT true
// GROUP BY
//   ub."refUserBookingId",
//   rg."refGroundName",
//   rg."refGroundCustId",
//   rg."isAddOnAvailable",
//   rg."refGroundPrice",
//   rg."refGroundLocation",
//   rg."refGroundPincode",
//   rg."refGroundState"

// `;

export const listUserBookingHistoryQuery = `
SELECT
  ub.*,
  rg."refGroundName",
  rg."refGroundCustId",
  rg."isAddOnAvailable",
  rg."refGroundPrice",
  rg."refGroundLocation",
  rg."refGroundPincode",
  rg."refGroundState",
  (
    SELECT
      COALESCE(
        json_agg(addon_data) FILTER (
          WHERE jsonb_array_length(addon_data -> 'selectedDates') > 0
        ),
        '[]'::json
      )
    FROM (
      SELECT
        jsonb_build_object(
          'addOnId', ao."refAddOnsId",
          'addon', ao."refAddOn",
          'selectedDates', COALESCE(json_agg(aa."unAvailabilityDate" ORDER BY aa."unAvailabilityDate"), '[]'::json),
          'refAddOnsPrice', COALESCE(json_agg(aa."refAddOnsPrice" ORDER BY aa."unAvailabilityDate"), '[]'::json)
        ) AS addon_data
      FROM
        public."refAddOns" ao
        LEFT JOIN public."addOnUnAvailability" aa
          ON aa."refAddOnsId" = ao."refAddOnsId"
          AND aa."refGroundId" = ub."refGroundId"
          AND aa."isDelete" IS NOT true
          AND aa."createdAt" = ub."createdAt"
      WHERE
        ao."refAddOnsId" = ANY (
          string_to_array(regexp_replace(ub."refAddOnsId", '[{}]', '', 'g'), ',')::INTEGER[]
        )
        AND ao."refStatus" IS true
      GROUP BY
        ao."refAddOnsId", ao."refAddOn"
    ) AS addon_subquery
  ) AS "AddOn"
FROM
  public."refUserBooking" ub
  LEFT JOIN public."refGround" rg ON CAST(rg."refGroundId" AS INTEGER) = ub."refGroundId"
WHERE
  ub."refUserId" = $1
  AND ub."isDelete" IS NOT true
GROUP BY
  ub."refUserBookingId",
  rg."refGroundName",
  rg."refGroundCustId",
  rg."isAddOnAvailable",
  rg."refGroundPrice",
  rg."refGroundLocation",
  rg."refGroundPincode",
  rg."refGroundState"
ORDER BY
  ub."refUserBookingId" DESC;
`;


export const listUserAuditPageQuery = `
SELECT
  *
FROM
  public."refTxnHistory"
WHERE
  "refUserId" = $1
  AND "isDelete" IS NOT true
`;

export const selectUserByLogin = `
SELECT
  u."refuserId",
  u."refCustId",
  u."refUserFname",
  u."refUserTypeId",
  ud.*
FROM
  public."users" u
  LEFT JOIN public."refUsersDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  (
    ud."refEmail" = $1
    OR ud."refUserName" = $1
  )
  AND u."isDelete" IS NOT true
`;

export const getGroundsQuery = `
SELECT
  rg.*,
  array_agg(DISTINCT f."refFeaturesName") AS "refFeaturesName",
  array_agg(DISTINCT fe."refFacilitiesName") AS "refFacilitiesName",
  array_agg(DISTINCT ug."refUserGuidelinesName") AS "refUserGuidelinesName",
  array_agg(DISTINCT ad."refAdditionalTipsName") AS "refAdditionalTipsName",
  array_agg(DISTINCT s."refSportsCategoryName") AS "refSportsCategoryName"
FROM
  public."refGround" rg
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
  AND rg."refGroundId" = $1
GROUP BY
  rg."refGroundId";
`;

export const getGroundUnavailableDateQuery = `
SELECT
  ao."refAddOn",
  aa."addOnsAvailabilityId",
  aa."unAvailabilityDate"
FROM
  public."addOnUnAvailability" aa
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = aa."refAddOnsId"
WHERE
  ao."refAddOn" = 'Ground'
  AND ao."refStatus" IS true
  AND ao."isDelete" IS NOT true
  AND aa."refGroundId" = $1
`;

export const listUnavailableAddonsQuery = `
SELECT
  ao."refAddOnsId",
  ao."refAddOn",
  aa."addOnsAvailabilityId",
  aa."unAvailabilityDate",
  array_agg(
    json_build_object(
      'refAddOnsId',
      ao."refAddOnsId",
      'refAddOn',
      ao."refAddOn",
      'unAvailabilityDate',
      aa."unAvailabilityDate"
    )
  ) AS arrayDate
FROM
  public."addOnUnAvailability" aa
  LEFT JOIN public."refAddOns" ao ON CAST(ao."refAddOnsId" AS INTEGER) = aa."refAddOnsId"
WHERE
  ao."refStatus" IS true
  AND ao."isDelete" IS NOT true
GROUP BY
  ao."refAddOnsId",
  ao."refAddOn",
  aa."addOnsAvailabilityId",
  aa."unAvailabilityDate"
`;

export const addUnavailbleDatesQuery = `
INSERT INTO
  public."addOnUnAvailability" (
    "unAvailabilityDate",
    "refGroundId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4)
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
`;

export const getGroundPriceQuery = `
SELECT
  "refGroundPrice"
FROM
  public."refGround"
WHERE
  "refGroundId" = $1
`;


