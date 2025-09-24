
export type ForgotForm = {
  emailOrPhone: string;
};

export type LoginForm = {
  emailOrPhone: string;
  password: string;
};

export type SignupForm = {
  emailOrPhone: string;
};

export type ResetForm = {
  new_password: string;
  confirmPassword: string;
};

export type CompleteForm = {
  first_name: string;
  last_name?: string;
  birth_date?: Date;
  password: string;
  confirmPassword: string;
};


export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}
export interface ErrorResponseData {
  error_message: string;
}
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
  time_status: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}
export type ResetPayload = {
  new_password: string;
  confirm_token: string;
};
export interface VerifyResetPayload {
  email?: string;
  phone_number?: string;
  code: string;
}

export interface CompletePayload {
  first_name: string;
  last_name?: string;
  birth_date?: Date | string;
  password: string;
}