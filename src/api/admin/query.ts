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

export const checkMobileQuery = `
SELECT
  COUNT(*)
FROM
  public."refUsersDomain"
WHERE
  "refMobileNumber" = $1
  ;
`;
export const checkEmailQuery = `
SELECT
  COUNT(*)
FROM
  public."refUsersDomain"
WHERE
  "refEmail" = $1

  ;
`;

export const getLastCustomerIdQuery = `
SELECT
  COUNT(*)
FROM
  public."users" u
WHERE
  u."refCustId" LIKE 'CGA-CUS-%';
`;

export const insertUserQuery = `
INSERT INTO
  public."users"(
    "refCustId",
    "refUserFname",
    "refUserLname",
    "refDoB",
    "refUserTypeId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;
`;
export const insertUserDomainQuery = `
INSERT INTO
  public."refUsersDomain" (
    "refUserId",
    "refMobileNumber",
    "refEmail",
    "refUserName",
    "refCustPassword",
    "refCustHashedPassword",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;
`;

export const listUserBookingsQuery = `
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
          'refAddOnsPrice', COALESCE(json_agg(aa."refAddOnsPrice" ORDER BY aa."unAvailabilityDate"), '[]'::json),
          'subAddOns', (
            SELECT COALESCE(json_agg(jsonb_build_object(
              'subAddOnId', sa."subAddOnsId",
              'subAddon', sa."refSubAddOnName",
              'subAddonPrice', sa."refSubAddOnPrice",
              'items', (
                SELECT COALESCE(json_agg(jsonb_build_object(
                  'itemId', it."refItemsId",
                  'itemName', it."refItemsName",
                  'itemPrice', it."refItemsPrice"
                )), '[]'::json)
                FROM public."refItems" it
                WHERE it."subAddOnsId" = sa."subAddOnsId"
                  AND it."refGroundId" = ub."refGroundId"
                  AND it."isDelete" IS NOT true
              )
            )), '[]'::json)
            FROM public."subAddOns" sa
            WHERE sa."refAddOnsId" = ao."refAddOnsId"
              AND sa."refGroundId" = ub."refGroundId"
              AND sa."isDelete" IS NOT true
          )
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
ub."isDelete" IS NOT true
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

export const deleteUserBookingQuery = `
UPDATE
  public."refUserBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refUserBookingId" = $1
RETURNING
  *;
`;

export const listSignUpUserQuery = `
SELECT
  u.*,
  ud."refMobileNumber",
  ud."refEmail",
  ud."refUserName"
FROM
  public."users" u
  LEFT JOIN public."refUsersDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."refCustId" LIKE 'CGA-CUS-%';
`;

export const listOverallAuditQuery = `
SELECT
  tx.*,
  tt."refTransactionType"
FROM
  public."refTxnHistory" tx
  LEFT JOIN public."refTransactionType" tt ON CAST(tt."refTransactionTypeId" AS INTEGER) = tx."refTransactionTypeId"
WHERE
  tx."isDelete" IS NOT true
ORDER BY
  tx."refTxnHistoryId" ASC
`;

export const listReportQuery = `
SELECT
  *
FROM
  public."refUserBooking" ub
  LEFT JOIN public."refGround" rg ON CAST(rg."refGroundId" AS INTEGER) = ub."refGroundId"
WHERE
  ub."isDelete" IS NOT true

`;