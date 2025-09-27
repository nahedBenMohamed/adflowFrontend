export interface MyworkInvoicePdfData {
  invoiceTitle: string;
  recipientData: string[];
  recipientDetails: {
    recipient: string;
    bank: string;
    // Расчетный счет (р./сч. №)
    accountNumber: string;
    bic: string;
    kpp: string;
    itn: string;
    ogrn: string;
    // Корреспондентский счет (к/сч. №)
    correspondentAccount: string;
  };
  customerPlanData: {
    plan: string;
    numberOfUsers: number;
    period: string;
  };
  customerData: string[];
  productName: string;
  amountNumber: number;
  amountText: string;
}
