type EmailTemplate = {
  template: string;
  subject: string;
};

export const emailTemplates: Record<string, EmailTemplate> = {
  PRODUCT_UPDATED: {
    template: 'product_update_email.hbs',
    subject: 'Product has been updated'
  }
};
