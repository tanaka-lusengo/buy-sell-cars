export type PaystackVerificationResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      custom_filters: Record<string, unknown>;
      referrer: string;
    };
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: unknown[];
      history: unknown[];
    };
    fees: number;
    fees_split: unknown | null;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
      receiver_bank_account_number: string | null;
      receiver_bank: string | null;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: unknown | null;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: string;
    split: Record<string, unknown>;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: unknown | null;
    source: unknown | null;
    fees_breakdown: unknown | null;
    connect: unknown | null;
    transaction_date: string;
    plan_object: {
      id: number;
      name: string;
      plan_code: string;
      description: string;
      amount: number;
      interval: string;
      send_invoices: boolean;
      send_sms: boolean;
      currency: string;
    };
    subaccount: Record<string, unknown>;
  };
};

// export type PaystackSubscriptionResponse = {
//   status: boolean;
//   message: string;
//   data: {
//     customer: number;
//     plan: number;
//     integration: number;
//     domain: string;
//     start: number;
//     status: string;
//     quantity: number;
//     amount: number;
//     authorization: {
//       authorization_code: string;
//       bin: string;
//       last4: string;
//       exp_month: string;
//       exp_year: string;
//       channel: string;
//       card_type: string;
//       bank: string;
//       country_code: string;
//       brand: string;
//       reusable: boolean;
//       signature: string;
//       account_name: string | null;
//     };
//     invoice_limit: number;
//     subscription_code: string;
//     email_token: string;
//     id: number;
//     createdAt: string;
//     updatedAt: string;
//     cron_expression: string;
//     next_payment_date: string;
//   };
// };

export type PaystackSubscriptionResponse = {
  status: true;
  message: string;
  data: Subscription[];
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
};

type Subscription = {
  customer: Customer;
  plan: Plan;
  integration: number;
  authorization: Authorization;
  domain: string;
  start: number;
  status: string;
  quantity: number;
  amount: number;
  subscription_code: string;
  email_token: string;
  easy_cron_id: string;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: string;
  id: number;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  metadata: null | unknown;
  domain: string;
  customer_code: string;
  risk_action: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

type Plan = {
  domain: string;
  name: string;
  plan_code: string;
  description: string;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  hosted_page_url: string | null;
  hosted_page_summary: string | null;
  currency: string;
  migrate: null | unknown;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

type Authorization = {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
};

export type PaystackManageSubscriptionResponse = {
  status: boolean;
  message: string;
  data: {
    link: string;
  };
};
