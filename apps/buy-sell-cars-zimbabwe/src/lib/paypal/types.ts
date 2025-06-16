export type SubscribeToSubscriptionResponse = {
  id: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  status: string;
  created_time: string;
};

export type SubscriptionResponse = {
  id: string;
  status: string;
  plan_id: string;
  plan_overridden: boolean;
  quantity: string;
  start_time: string;
  status_update_time: string;
  update_time: string;
  create_time: string;
  shipping_amount: {
    currency_code: string;
    value: string;
  };
  billing_info: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      total_cycles: number;
    }>;
    last_payment?: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time: string;
    failed_payments_count: number;
  };
  subscriber: {
    email_address: string;
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
    shipping_address?: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
    tenant?: string;
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
};
