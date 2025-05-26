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
