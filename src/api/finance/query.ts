export const groundEarningsQuery = `
  INSERT INTO
  public."groundEarnings" (
    "refGroundId",
    "ownerId",
    "refUserBookingId",
    "amount",
    "commissionRate",
    "adminCommission",
    "ownerEarnings",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`;

export const upsertBookingStatsQuery = `
INSERT INTO
  public."groundBookingStats" (
    "refGroundId",
    "totalBookings",
    "totalRevenue",
    "lastUpdated",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, 1, $2, NOW(), NOW(), $3, false) ON CONFLICT ("refGroundId")
DO
UPDATE
SET
  "totalBookings" = "groundBookingStats"."totalBookings"::int + 1,
  "totalRevenue" = ("groundBookingStats"."totalRevenue")::numeric + $2,
  "lastUpdated" = NOW()
`;

export const calculateWeeklyOwnerSummary = `
SELECT
  "ownerId",
  SUM("ownerEarnings"::numeric) AS "totalEarnings",
  SUM("adminCommission"::numeric) AS "totalCommission"
FROM
  public."groundEarnings"
WHERE
  "createdAt"::timestamp >= NOW() - INTERVAL '7 days'
  AND "isDelete" = false
GROUP BY
  "ownerId"
`;

export const insertWeeklyPayout = `
 INSERT INTO
  public."weeklyPayouts" (
    "refOwnerId",
    "totalEarnings",
    "totalCommission",
    "ownerReceivable",
    "payoutStatus",
    "payoutDate",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    'pending',
    CURRENT_DATE,
    NOW(),
    $5,
    false
  )
`;

export const markPayoutAsPaid = `
  UPDATE
  public."weeklyPayouts"
SET
  "payoutStatus" = 'paid',
  "updatedAt" = NOW(),
  "updatedBy" = $2
WHERE
  "weeklyPayoutsid" = $1
`;
