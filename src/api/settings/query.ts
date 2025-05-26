export const checkSportCategoryQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refSportsCategory"
WHERE
  "refSportsCategoryName" = $1
  AND "isDelete" IS NOT true;
`;
export const addSportCategoryQuery = `
INSERT INTO
  public."refSportsCategory" (
    "refSportsCategoryName",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3)
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

export const updateSportCategoryQuery = `
UPDATE
  public."refSportsCategory"
SET
  "refSportsCategoryName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refSportsCategoryId" = $1
RETURNING
  *;
`;

export const deleteSportCategoryQuery = `
UPDATE
  public."refSportsCategory"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refSportsCategoryId" = $1
RETURNING
  *;
`;
export const getdeleteSportCategoryQuery = `
SELECT
  "refSportsCategoryName"
FROM
  public."refSportsCategory"
WHERE
  "refSportsCategoryId" = $1;
`;

export const listSportCategoryQuery = `
SELECT
  *
FROM
  public."refSportsCategory"
  WHERE
  "isDelete" IS NOT true
`;

export const checkduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refFeatures"
WHERE
  "refFeaturesName" = $1
  AND "isDelete" IS NOT true;
`;

export const addFeaturesQuery = `
INSERT INTO
  public."refFeatures" (
    "refFeaturesName",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3)
RETURNING
  *;
`;

export const checkFeaturesQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refFeatures"
WHERE
  "refFeaturesName" = $1
  AND "isDelete" IS NOT true;
`;

export const updateFeaturesQuery = `
UPDATE
  public."refFeatures"
SET
  "refFeaturesName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refFeaturesId" = $1
RETURNING
  *;
`;

export const deleteFeaturesQuery = `
UPDATE
  public."refFeatures"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refFeaturesId" = $1
RETURNING
  *;
`;

export const getdeleteFeaturesQuery = `
SELECT
  "refFeaturesName"
FROM
  public."refFeatures"
WHERE
  "refFeaturesId" = $1;
`;

export const listFeaturesQuery = `
SELECT
  *
FROM
  public."refFeatures"
  WHERE
  "isDelete" IS NOT true
`;

export const checkUserGuidelinesduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refUserGuidelines"
WHERE
  "refUserGuidelinesName" = $1
  AND "isDelete" IS NOT true;
`;
export const addUserGuidelinesQuery = `
INSERT INTO
  public."refUserGuidelines" (
    "refUserGuidelinesName",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3)
RETURNING
  *;
`;

export const updateUserGuidelinesQuery = `
UPDATE
  public."refUserGuidelines"
SET
  "refUserGuidelinesName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refUserGuidelinesId" = $1
RETURNING
  *;
`;

export const deleteUserGuidelinesQuery = `
UPDATE
  public."refUserGuidelines"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refUserGuidelinesId" = $1
RETURNING
  *;
`;
export const getdeleteUserGuidelineQuery = `
SELECT
  "refUserGuidelinesName"
FROM
  public."refUserGuidelines"
WHERE
  "refUserGuidelinesName" = $1
`;

export const listUserGuidelinesQuery = `
SELECT
  *
FROM
  public."refUserGuidelines"
  WHERE
  "isDelete" IS NOT true
`;
export const checkFacilitiesNameduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refFacilities"
WHERE
  "refFacilitiesName" = $1
  AND "isDelete" IS NOT true;
`;

export const addFacilitiesQuery = `
INSERT INTO
  public."refFacilities" (
    "refFacilitiesName",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3)
RETURNING
  *;
`;

export const updateFacilitiesQuery = `
UPDATE
  public."refFacilities"
SET
  "refFacilitiesName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refFacilitiesId" = $1
RETURNING
  *;
`;
export const deleteFacilitiesQuery = ` 
UPDATE
  public."refFacilities"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refFacilitiesId" = $1
RETURNING
  *;
`;

export const listFacilitiesQuery = `
SELECT
  *
FROM
  public."refFacilities"
  WHERE
  "isDelete" IS NOT true
`;

export const checkAdditionalTipsduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refAdditionalTips"
WHERE
  "refAdditionalTipsName" = $1
  AND "isDelete" IS NOT true;
`;
export const addAditionalTipsQuery = `
INSERT INTO
  public."refAdditionalTips" (
    "refAdditionalTipsName",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3)
RETURNING
  *;
`;

export const updateAdditionalTipsQuery = `
UPDATE
  public."refAdditionalTips"
SET
  "refAdditionalTipsName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refAdditionalTipsId" = $1
RETURNING
  *;
`;

export const deleteAdditionalTipsQuery = `
UPDATE
  public."refAdditionalTips"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refAdditionalTipsId" = $1
RETURNING
  *;
`;

export const listAdditionalTipsQuery = `
SELECT
  *
FROM
  public."refAdditionalTips"
  WHERE
  "isDelete" IS NOT true
`;

export const checkFoodAndSnacksQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refFoodAndSnacks"
WHERE
  "refFoodAndSnacks" = $1
  AND "isDelete" IS NOT true;
`;

export const getFoodImageRecordQuery = `
SELECT
  *
FROM
  public."refFoodAndSnacks"
WHERE
  "refFoodName" = $1;
`;
export const deleteFoodImageRecordQuery = `
UPDATE
  public."refFoodAndSnacks"
SET
  "refFoodImage" = NULL
WHERE
  "refFoodAndSnacksId" = $1
RETURNING
  *;
`;

export const addFoodAndSnacksQuery = `
INSERT INTO
  public."refFoodAndSnacks" (
  "refFoodCategory",
    "refFoodName",
    "refPrice",
    "refQuantity",
    "refFoodImage",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;
`;
export const updateFoodAndSnacksQuery = `
UPDATE
  public."refFoodAndSnacks"
SET
  "refFoodName" = $2,
  "refPrice" = $3,
  "refQuantity" = $4,
  "refFoodImage" = $5,
  "updatedAt" = $6,
  "updatedBy" = $7,
  "refFoodCategory" = $8
WHERE
  "refFoodAndSnacksId" = $1
RETURNING
  *;
`;

export const deleteFoodAndSnacksQuery = `
UPDATE
  public."refFoodAndSnacks"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refFoodAndSnacksId" = $1
RETURNING
  *;
`;

export const listFoodAndSnacksQuery = `
SELECT
  rf.*,
  fc."refFoodCategory"
FROM
  public."refFoodAndSnacks" rf
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = rf."refFoodCategory"
WHERE
  rf."isDelete" IS NOT true
`;

export const addFoodAndSnacksComboQuery = `
INSERT INTO
  public."refCombo" (
    "refGroundId",
    "breakfast",
    "breakfastTime",
    "breakfastPrice",
    "lunch",
    "lunchTime",
    "lunchPrice",
    "dinner",
    "dinnerTime",
    "dinnerPrice",
    "snacks1",
    "snacks1Time",
    "snacks1Price",
    "snacks2",
    "snacks2Time",
    "snacks2Price",
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

export const uploadFoodAndSnacksComboQuery = `
UPDATE
  public."refCombo"
SET
  "refGroundId" = $1,
  "breakfast" = $2,
  "breakfastTime" = $3,
  "breakfastPrice" = $4,
  "lunch" = $5,
  "lunchTime" = $6,
  "lunchPrice" = $7,
  "dinner" = $8,
  "dinnerTime" = $9,
  "dinnerPrice" = $10,
  "snacks1" = $11,
  "snacks1Time" = $12,
  "snacks1Price" = $13,
  "snacks2" = $14,
  "snacks2Time" = $15,
  "snacks2Price" = $16,
  "updatedAt" = $17,
  "updatedBy" = $18
WHERE
  "refComboId" = $19
RETURNING
  *;

`;

export const deleteFoodComboQuery = `
UPDATE
  public."refCombo"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refComboId" = $1
RETURNING
  *;
`;

export const listFoodComboQuery = `
SELECT
  *
FROM
  public."refCombo"
WHERE
  "isDelete" IS NOT true
`;

export const listFoodCategoryQuery = `
SELECT
  *
FROM
  public."refFoodCategory"
ORDER BY
  "refFoodCategoryId" ASC
`;