export const addFeedBackQuery = `
INSERT INTO
  public."refFeedBack" (
    "refUserId",
    "refGroundId",
    "refContent",
    "refRatings",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *;
`;

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

export const listFeedBackQuery = `
SELECT
  *
FROM
  public."refFeedBack"
WHERE
  "isDelete" IS NOT true
`;

export const getTransactionHistoryQuery = `
SELECT
  *
FROM
  public."refTxnHistory"
WHERE
  "refUserId" = $1
  AND "refTransactionTypeId" = 28
`;

export const addGroundFeedBackQuery = `
INSERT INTO
  public."refFeedBack" (
    "refUserId",
    "refGroundId",
    "refContent",
    "refRatings",
    "isGroundFeedBack",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;
`;

export const listUserFeedBackHistoryQuery = `
SELECT
  *
FROM
  public."refFeedBack"
WHERE
  "isDelete" IS NOT true
  AND "isGroundFeedBack" IS null
  AND "refUserId" = $1
`;
export const listGroundFeedBackHistoryQuery = `
SELECT
  *
FROM
  public."refFeedBack"
WHERE
  "isDelete" IS NOT true
  AND "isGroundFeedBack" IS NOT null
  AND "refUserId" = $1

`;