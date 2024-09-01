export const meterInstallationInProgress = (customerName: string) => `
  <p>Dear ${customerName},</p>
  <p>Your meter installation is currently in progress. We will notify you once it is completed.</p>
  <p>Thank you for choosing AEDC!</p>
`;

export const meterInstallationCompleted = (customerName: string) => `
  <p>Dear ${customerName},</p>
  <p>We are pleased to inform you that your meter installation has been completed and commissioned successfully.</p>
  <p>Thank you for choosing AEDC!</p>
`;
