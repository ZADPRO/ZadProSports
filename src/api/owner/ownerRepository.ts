import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime, generatePassword } from "../../helper/common";
import { checkQuery, getLastPartnerIdQuery } from "./query";


export class ownerRepository {
//   public async addOwnersV1(userData: any, token_data?: any): Promise<any> {
//     const client: PoolClient = await getClient();
//     try {
//       await client.query("BEGIN");
//       const {
//         refFName,
//         refLName,
//         refAadharId,
//         refUserEmail,
//         refMoblile,
//         refAadharPath
//       } = userData;

//       const hashedPassword = await bcrypt.hash(refPassword, 10);

//       const checkmobile = [refMoblile];
//       const checkEmail = [refUserEmail];

//       const userCheck = await executeQuery(checkMobileQuery, checkmobile);
//       const mobliecount = Number(userCheck[0]?.count || 0); // safely convert to number
//       console.log("count", mobliecount);

//       if (mobliecount > 0) {
//         await client.query("ROLLBACK");
//         return encrypt(
//           {
//             message: `Moblile Number Already exists`,
//             success: false,
//           },
//           true
//         );
//       }
//       const userEMailCheck = await executeQuery(checkEmailQuery, checkEmail);
//       const count = Number(userEMailCheck[0]?.count || 0); // safely convert to number
//       console.log("count", count);

//       if (count > 0) {
//         await client.query("ROLLBACK");
//         return encrypt(
//           {
//             message: `Email Already exists`,
//             success: false,
//           },
//           true
//         );
//       }

//       const customerPrefix = "CGA-CUS-";
//       const baseNumber = 0;

//       const lastCustomerResult = await client.query(getLastCustomerIdQuery);
//       let newCustomerId: string;

//       if (lastCustomerResult.rows.length > 0) {
//         const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
//         newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
//           .toString()
//           .padStart(4, "0")}`;
//       } else {
//         newCustomerId = `${customerPrefix}${(baseNumber + 1)
//           .toString()
//           .padStart(4, "0")}`;
//       }

//       // Insert into users table
//       const params = [
//         newCustomerId,
//         refFName,
//         refLName,
//         refDOB,
//         2,
//         CurrentTime(),
//         2,
//       ];
//       const userResult = await client.query(insertUserQuery, params);
//       const newUser = userResult.rows[0];

//       // Insert into userDomain table
//       const domainParams = [
//         newUser.refuserId,
//         refMoblile,
//         refUserEmail,
//         refUserEmail,
//         refPassword,
//         hashedPassword,
//         CurrentTime(),
//         2,
//       ];

//       const domainResult = await client.query(
//         insertUserDomainQuery,
//         domainParams
//       );
//       if ((userResult.rowCount ?? 0) > 0 && (domainResult.rowCount ?? 0) > 0) {
//         const history = [
//           1,
//           newUser.refuserId,
//           `${userData.refFName} user signed Up succcesfully`,
//           CurrentTime(),
//           3,
//         ];
//         const updateHistory = await client.query(updateHistoryQuery, history);

//         await client.query("COMMIT");

//         return encrypt(
//           {
//             success: true,
//             message: "User signed up added successful",
//             user: newUser,
//             firstName: refFName,
//             lastName: refLName,
//           },
//           true
//         );
//       }
//     } catch (error: unknown) {
//       await client.query("ROLLBACK");
//       console.error("Error during User signed up:", error);
//       return encrypt(
//         {
//           success: false,
//           message: "An unexpected error occurred during User signed up ",
//           error: error instanceof Error ? error.message : String(error),
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }
//   public async addPartnersV1(userData: any, token_data?: any): Promise<any> {
//     const client: PoolClient = await getClient();
//     const token = { id: token_data.id }; // Extract token ID
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       await client.query("BEGIN");
//       const {
//          refFName,
//         refLName,
//         refAadharId,
//         refUserEmail,
//         refMoblile,
//         refAadharPath
//       } = userData
//       const genPassword = generatePassword();
//       const genHashedPassword = await bcrypt.hash(genPassword, 10);

//       // Check if the username already exists
//       const check = [userData.refUserEmail];
//       const userCheck = await client.query(checkQuery
//         , check);
//       if (userCheck.rows.length > 0) {
//         await client.query("ROLLBACK");
//         return encrypt(
//           {
//             success: false,
//             message: "Already exists",
//             token: tokens,
//           },
//           true
//         );
//       }

//       const customerPrefix = "GB-OWN-";
//       const baseNumber = 0;

//       const lastCustomerResult = await client.query(getLastPartnerIdQuery);
//       let newCustomerId: string;

//       if (lastCustomerResult.rows.length > 0) {
//         const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
//         newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
//           .toString()
//           .padStart(4, "0")}`;
//       } else {
//         newCustomerId = `${customerPrefix}${(baseNumber + 1)
//           .toString()
//           .padStart(4, "0")}`;
//       }

//       // Insert into users table
//       const params = [
//         newCustomerId,
//         userData.refFName,
//         userData.refLName,
//         userData.refDOB,
//         userData.refMoblile,
//         userData.refOffersId,
//         `{6}`,
//         CurrentTime(),
//         token_data.id,
//       ];

//       const userResult = await client.query(insertUserQuery, params);
//       const newUser = userResult.rows[0];

//       // Insert into userDomain table
//       const domainParams = [
//         newUser.refuserId,
//         userData.refUserEmail,
//         genPassword,
//         genHashedPassword,
//         userData.refMoblile,
//         CurrentTime(),
//         token_data.id,
//       ];

//       const domainResult = await client.query(
//         insertUserDomainQuery,
//         domainParams
//       );

//       if ((userResult.rowCount ?? 0) > 0 && (domainResult.rowCount ?? 0) > 0) {
//         const history = [
//           59,
//           token_data.id,
//           `${userData.refFName} Partner added succcesfully`,
//           CurrentTime(),
//           token_data.id,
//         ];
//         const updateHistory = await client.query(updateHistoryQuery, history);

//         if ((updateHistory.rowCount ?? 0) > 0) {
//           const tokenData = {
//             id: newUser.refUserId,
//             email: userData.refUserEmail,
//           };
//           await client.query("COMMIT");
//           const main = async () => {
//             const mailOptions = {
//               to: userData.refUserEmail,
//               subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
//               html: generatePartnerSignupEmailContent(
//                 userData.refFName,
//                 userData.refUserEmail,
//                 genPassword
//               ),
//             };

//             // Call the sendEmail function
//             try {
//               sendEmail(mailOptions);
//             } catch (error) {
//               console.error("Failed to send email:", error);
//             }
//           };
//           main().catch(console.error);

//           return encrypt(
//             {
//               success: true,
//               message: "Partner added successful",
//               user: newUser,
//               roleId: 6,
//               token: tokens,
//             },
//             true
//           );
//         }
//       }

//       await client.query("ROLLBACK");
//       return encrypt(
//         {
//           success: false,
//           message: "failed Partner added",
//           token: tokens,
//         },
//         true
//       );
//     } catch (error: unknown) {
//       await client.query("ROLLBACK");
//       console.error("Error during Partner added:", error);
//       return encrypt(
//         {
//           success: false,
//           message: "An unexpected error occurred during Partner added",
//           error: error instanceof Error ? error.message : String(error),
//           token: tokens,
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }

}
