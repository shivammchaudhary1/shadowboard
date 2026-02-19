export const forgotPasswordTemplate = (resetLink, username = "User") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Shadow Board</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
  <table role="presentation" style="width: 100%; margin: 0; padding: 40px 0; background-color: #f6f9fc;">
    <tr>
      <td align="center">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🔐 Password Reset</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Shadow Board Security</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Hello ${username}! 🔑</h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your Shadow Board account. Don't worry - it happens to the best of us!
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in <strong>1 hour</strong> for security reasons.
              </p>
              
              <!-- Reset Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td>
                    <a href="${resetLink}" 
                       style="display: inline-block; 
                              padding: 16px 32px; 
                              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                              color: white; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: 600; 
                              font-size: 16px;
                              box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
                              transition: all 0.2s ease;">
                      🔐 Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="margin: 0 0 30px 0; color: #3b82f6; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                ${resetLink}
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                  🚨 Security Notice:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px;">
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>This link expires in 1 hour</li>
                  <li>Never share this link with others</li>
                  <li>We recommend using a strong, unique password</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">
                If you didn't request a password reset, please contact our support team.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                <strong>The Shadow Board Team</strong>
              </p>
              <p style="margin: 8px 0 0 0; color: #d1d5db; font-size: 12px;">
                Keep your account secure and vote anonymously.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
