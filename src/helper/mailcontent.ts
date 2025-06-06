export const generateforgotPasswordEmailContent = (
  emailId: string,
  newPassword: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset</h2>
      <p>Hello,</p>
      <p>Your temporary password has been generated.</p>
      <p><strong>Email:</strong> ${emailId}</p>
      <p><strong>New Password:</strong> ${newPassword}</p>
      <br>
      <p>Regards,<br>Team</p>
    </div>
  `;
};


export const generateSignupEmailContent = (
  fullName: string,
  userEmail: string,
  password: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to ZadSports APP</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #e6f0ff;
        color: #003366;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 51, 102, 0.2);
        padding: 30px;
      }
      .header {
        background-color: #004080;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        color: white;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        margin-top: 20px;
        font-size: 16px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #0073e6;
        color: white !important;
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        margin: 25px 0;
      }
      .footer {
        font-size: 12px;
        color: #666666;
        margin-top: 30px;
        text-align: center;
      }
      .credentials {
        background-color: #f0f5ff;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        font-family: monospace;
        font-size: 14px;
        color: #004080;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        ZadSports APP - Ground Owner
      </div>
      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Welcome to <strong>ZadSports APP</strong>! Your ground owner account has been created successfully.</p>
        <p>Please find your login credentials below:</p>

        <div class="credentials">
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>We recommend changing your password after your first login for security reasons.</p>
        <p>
          <a href="https://zadsportsapp.com/login" class="button" target="_blank" rel="noopener noreferrer">Login to ZadSports APP</a>
        </p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br />The ZadSports APP Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ZadSports APP. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};


export const generateFormSubmittedContent = (
  refOwnerFname: string,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Form Submitted Successfully!</h2>
      <p>Dear <strong>${refOwnerFname}</strong>,</p>

      <p>Thank you for submitting your owner registration form on our platform.</p>


      <p>Your form is currently under review. You will be notified once the verification is complete.</p>

      <p>If you have any questions, feel free to contact our support team.</p>

      <p style="margin-top: 30px;">Best regards,<br/>The ZadSports Team</p>
    </div>
  `;
};


// Enum for status codes
export enum OWNER_STATUS {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  ONBOARDED = "ONBOARDED",
  SUSPENDED = "SUSPENDED",
}

// Human-readable labels for UI / default fallback
export const OwnerStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Review",
  UNDER_REVIEW: "Under Review",
  REJECTED: "Rejected",
  APPROVED: "Approved",
  ONBOARDED: "Onboarded",
  SUSPENDED: "Suspended",
};

// Mail template generator
export const getOwnerStatusEmailContent = (
  ownerName: string,
  status: string,
  content?: string
): { subject: string; body: string } => {
  const statusLabels = OwnerStatusLabels;
  const commonFooter = `<br><br>Regards,<br>Team ZadSports`;
  const adminNote = content ? `<br><br><strong>Note from Admin:</strong><br>${content}` : "";

  switch (status) {
    case OWNER_STATUS.DRAFT:
      return {
        subject: `Action Required: Complete Your Owner Profile`,
        body: `Hi ${ownerName},<br><br>We noticed you started filling out your profile but haven’t submitted it yet. Please complete and submit the form to begin the verification process.${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.PENDING:
      return {
        subject: `Owner Profile Submitted - In Review`,
        body: `Hi ${ownerName},<br><br>Your profile has been submitted successfully and is currently under initial review by our team.${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.UNDER_REVIEW:
      return {
        subject: `Your Profile is Under Verification`,
        body: `Hi ${ownerName},<br><br>Your profile is now being verified. We’ll notify you once it's completed.${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.REJECTED:
      return {
        subject: `Owner Profile Rejected`,
        body: `Hi ${ownerName},<br><br>Unfortunately, your profile did not meet our requirements. Please review and resubmit the required details.${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.APPROVED:
      return {
        subject: `Owner Profile Approved`,
        body: `Hi ${ownerName},<br><br>Your profile has been approved! Final onboarding steps are in progress.${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.ONBOARDED:
      return {
        subject: `Congratulations! You Are Now Onboarded`,
        body: `Hi ${ownerName},<br><br>We're excited to have you on board. Your profile is now fully active!${adminNote}${commonFooter}`,
      };
    case OWNER_STATUS.SUSPENDED:
      return {
        subject: `Owner Account Suspended`,
        body: `Hi ${ownerName},<br><br>Your profile has been suspended temporarily. Please contact support for more details.${adminNote}${commonFooter}`,
      };
    default:
      return {
        subject: `Owner Status Updated`,
        body: `Hi ${ownerName},<br><br>Your profile status has been updated to ${statusLabels[status] || status}.${adminNote}${commonFooter}`,
      };
  }
};


