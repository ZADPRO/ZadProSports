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
  *
FROM
  "refUserBooking" ub
  LEFT JOIN public."refGround" gr ON CAST(gr."refGroundId" AS INTEGER) = ub."refGroundId"
  LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ub."refUserId"
  LEFT JOIN public."refUsersDomain" ud ON CAST(ud."refUserId" AS INTEGER) = ub."refUserId"
WHERE
  ub."isDelete" IS NOT TRUE
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