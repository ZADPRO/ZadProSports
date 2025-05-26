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
    "isFoodNeeded",
    "refComboId",
    "refComboCount",
    "refBookingTypeId",
    "isRoomNeeded",
    "refBookingStartDate",
    "refBookingEndDate",
    "refStartTime",
    "refEndTime",
    "additionalNotes",
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
    $14
  )
RETURNING
  *;
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
  ud."refUserEmail",
  ud."refUsername"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST (ud."refUserId" AS INTEGER) = u."refuserId"
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

export const listUserBookingHistoryQuery =
`
SELECT
  *
FROM
  public."refUserBooking"
WHERE
  "refUserId" = $1
  AND "isDelete" IS NOT true
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

// export const checkQuery = `
// SELECT
//   COUNT(*)
// FROM
//   public."refUsersDomain"
// WHERE
//   "refUserName" = $1
//   OR "refEmail" = $2;
// `;