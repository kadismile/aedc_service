export const installationInProgressTemplate = (customerName: string) => `
  <h1>Hello ${customerName},</h1>
  <p>Your meter installation is in progress. We will notify you once it is complete.</p>
`;

export const installationCompleteTemplate = (customerName: string) => `
  <h1>Hello ${customerName},</h1>
  <p>Your meter has been successfully installed and commissioned.</p>
`;
