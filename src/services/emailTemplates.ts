
export const installationInProgressTemplate = (customerName: string, logoUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="AEDC Logo" style="max-width: 150px; margin-bottom: 20px;">
    </div>
    <h1 style="color: #333;">Hello ${customerName},</h1>
    <p style="font-size: 16px; color: #555;">Your meter installation is in progress. We will notify you once it is complete.</p>
    <p style="font-size: 16px; color: #555;">Thank you for your patience.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://www.abujaelectricity.com" style="padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </div>
    <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 20px;">© 2024 AEDC. All rights reserved.</p>
  </div>
`;

export const installationCompleteTemplate = (customerName: string, logoUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="AEDC Logo" style="max-width: 150px; margin-bottom: 20px;">
    </div>
    <h1 style="color: #333;">Hello ${customerName},</h1>
    <p style="font-size: 16px; color: #555;">Your meter has been successfully installed and commissioned.</p>
    <p style="font-size: 16px; color: #555;">Thank you for choosing AEDC.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://www.abujaelectricity.com" style="padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">View Details</a>
    </div>
    <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 20px;">© 2024 AEDC. All rights reserved.</p>
  </div>
`;
