export const checkQuery = `
SELECT
  COUNT(*)
FROM
  public."refUsersDomain"
WHERE
  "refEmail" = $1
`;

export const getLastPartnerIdQuery = `
SELECT
  COUNT(*)
FROM
  public."owners" u
WHERE
  u."refOwnerCustId" LIKE 'CGA-OWN-%';
`;

export const insertUserQuery = `
INSERT INTO
  public."owners" (
    "refOwnerCustId",
    "refOwnerFname",
    "refOwnerLname",
    "refEmailId",
    "refMobileId",
    "refCustPassword",
    "refCustHashedPassword",
    "refAadharId",
    "refPANId",
    "refGSTnumber",
    "isOwnGround",
    "refGroundImage",
    "refGroundDescription",
    "refBankName",
    "refBankBranch",
    "refAcHolderName",
    "refAccountNumber",
    "refIFSCcode",
    "refDocument1Path",
    "refDocument2Path",
        "isDefaultAddress",
    "refUserTypeId",
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
    $18,
    $19,
    $20,
    $21,
    $22,
    $23,
    $24,
    $25
  )
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

export const listOwnersQuery = `
SELECT DISTINCT ON (o."refOwnerId")
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refOwnerLname",
  o."refEmailId",
  o."refMobileId",
  o."refCustHashedPassword",
  o."refAadharId",
  o."refPANId",
  o."refGSTnumber",
  o."isOwnGround",
  o."refGroundImage",
  o."refGroundDescription",
  o."refBankName",
  o."refBankBranch",
  o."refAcHolderName",
  o."refAccountNumber",
  o."refIFSCcode",
  o."refDocument1Path",
  o."refDocument2Path",
  o."refUserTypeId",
  o."refStatus",
  o."isDefaultAddress"
FROM
  public."owners" o
  LEFT JOIN public."userSportsMapping" s ON CAST(s."refOwnerId" AS INTEGER) = o."refOwnerId"
WHERE
  o."isDelete" IS NOT true;
`;
export const getOwnersQuery = `
SELECT
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refOwnerLname",
  o."refEmailId",
  o."refMobileId",
  o."refCustHashedPassword",
  o."refAadharId",
  o."refPANId",
  o."refGSTnumber",
  o."isOwnGround",
  o."refGroundImage",
  o."refGroundDescription",
  o."refBankName",
  o."refBankBranch",
  o."refAcHolderName",
  o."refAccountNumber",
  o."refIFSCcode",
  o."refDocument1Path",
  o."refDocument2Path",
  o."refUserTypeId",
  o."refStatus",
  o."isDefaultAddress",
  COALESCE(
    json_agg(
      json_build_object(
        'refOwnerSportsMappingId', s."ownerSportsMappingId",
        'refSportsCategoryId', s."refSportsCategoryId",
        'groundAddress', s."groundAddress",
        'refSportsCategoryName', sc."refSportsCategoryName"
      )
    ) FILTER (
      WHERE s."ownerSportsMappingId" IS NOT NULL
    ),
    '[]'
  ) AS ownerSportsMappings
FROM
  public."owners" o
  LEFT JOIN public."userSportsMapping" s ON CAST(s."refOwnerId" AS INTEGER) = o."refOwnerId"
  LEFT JOIN public."refSportsCategory" sc ON CAST(sc."refSportsCategoryId" AS INTEGER) = s."refSportsCategoryId"
WHERE
  o."refOwnerId" = $1
GROUP BY
  o."refOwnerId";
    `;

export const updateUserQuery = `
UPDATE public."owners"
SET
  "refOwnerFname" = $2,
  "refOwnerLname" = $3,
  "refEmailId" = $4,
  "refMobileId" = $5,
  "refCustPassword" = $6,
  "refCustHashedPassword" = $7,
  "refAadharId" = $8,
  "refPANId" = $9,
  "refGSTnumber" = $10,
  "isOwnGround" = $11,
  "refGroundImage" = $12,
  "refGroundDescription" = $13,
  "refBankName" = $14,
  "refBankBranch" = $15,
  "refAcHolderName" = $16,
  "refAccountNumber" = $17,
  "refIFSCcode" = $18,
  "refDocument1Path" = $19,
  "refDocument2Path" = $20,
  "updatedAt" = $21,
  "updatedBy" = $22
WHERE
  "refUserId" = $1
RETURNING *;
`;

export const updateUserDomainQuery = `
UPDATE public."refUsersDomain"
SET
  "refMobileNumber" = $2,
  "refEmail" = $3,
  "refUserName" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "refUserId" = $1
RETURNING *;
`;
export const getImageRecordQuery = `
SELECT
  "refGroundImage",
  "refDocument1Path",
  "refDocument2Path"
FROM
  public."owners"
WHERE
  "refOwnerId" = $1;
`;

export const deleteOwnerQuery = `
UPDATE
  public."owners"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refOwnerId" = $1
RETURNING
  *;
`;

export const approveOwnerQuery = `
UPDATE
  public."users"
SET
  "refStatus" = 'Approved'
WHERE
  "refuserId" = $1;
`;

// export const getUserDetailsQuery = `
// SELECT
//   u."refUserFname",
//   ud."refCustPassword",
//   ud."refEmail"
// FROM
//   public."users" u
//   LEFT JOIN public."refUsersDomain" ud ON CAST (ud."refUserId" AS INTEGER) = u."refuserId"
// WHERE
//   u."refuserId" = $1
// `;

export const updateOwnerStatusQuery = `
UPDATE
  public."owners"
SET
  "refStatus" = $1
WHERE
  "refOwnerId" = $2
  RETURNING *;
`;

export const updateduserTypeQuery = `
UPDATE
  public."owners"
SET
   "refUserTypeId" = '4'
WHERE
  "refOwnerId" = $1
    RETURNING *;

`;

export const getUserDetailsQuery = `
SELECT
  "refOwnerFname",
  "refEmailId"
FROM
  public."owners"
WHERE
  "refOwnerId" = $1
  
`;

export const OwnersHistoryQuery = `
SELECT
  o.*,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'refOwnerSportsMappingId',
        us."ownerSportsMappingId",
        'refSportsCategoryId',
        us."refSportsCategoryId",
        'groundAddress',
        us."groundAddress",
        'refSportsCategoryName',
        s."refSportsCategoryName"
      )
    ) FILTER (
      WHERE
        us."ownerSportsMappingId" IS NOT NULL
    ),
    '[]'
  ) AS ownerSportsMappings,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'refGroundId',
        rg."refGroundId",
        'refGroundName',
        rg."refGroundName",
        'refGroundCustId',
        rg."refGroundCustId",
        'refGroundPrice',
        rg."refGroundPrice",
        'refGroundLocation',
        rg."refGroundLocation",
        'approveGround',
        rg."approveGround"
      )
    ) FILTER (
      WHERE
        rg."refGroundId" IS NOT NULL
    ),
    '[]'
  ) AS grounds
FROM
  public."owners" o
  LEFT JOIN public."userSportsMapping" us ON CAST(us."refOwnerId" AS INTEGER) = o."refOwnerId"
  LEFT JOIN public."refSportsCategory" s ON CAST(s."refSportsCategoryId" AS INTEGER) = us."refSportsCategoryId"
  LEFT JOIN public."refGround" rg ON CAST(rg."createdBy" AS INTEGER) = o."refOwnerId"
WHERE
  o."refOwnerId" = $1
GROUP BY
  o."refOwnerId";
`;

export const listSportCategoryQuery = `
SELECT
  *
FROM
  public."refSportsCategory"
  WHERE
  "isDelete" IS NOT true
`;
