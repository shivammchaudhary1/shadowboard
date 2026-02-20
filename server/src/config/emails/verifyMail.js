export const verifyEmailTemplate = (verificationLink, username = 'User') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Shadow Board</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
  <table role="presentation" style="width: 100%; margin: 0; padding: 40px 0; background-color: #f6f9fc;">
    <tr>
      <td align="center">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🎯 Shadow Board</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Anonymous Voting Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome ${username}! 👋</h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for joining Shadow Board! We're excited to have you as part of our anonymous voting community.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                To get started and secure your account, please verify your email address by clicking the button below:
              </p>
              
              <!-- Verification Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td>
                    <a href="${verificationLink}" 
                       style="display: inline-block; 
                              padding: 16px 32px; 
                              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                              color: white; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: 600; 
                              font-size: 16px;
                              box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
                              transition: all 0.2s ease;">
                      ✅ Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="margin: 0 0 30px 0; color: #3b82f6; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                ${verificationLink}
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                  <strong>What happens after verification?</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
                  <li>Vote anonymously on polls</li>
                  <li>Create your own polls</li>
                  <li>Share opinions safely</li>
                  <li>Join the anonymous community</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">
                If you didn't create a Shadow Board account, please ignore this email.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                <strong>The Shadow Board Team</strong>
              </p>
              <p style="margin: 8px 0 0 0; color: #d1d5db; font-size: 12px;">
                Anonymous voting made simple and secure.
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
