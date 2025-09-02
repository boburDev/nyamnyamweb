export const ACCESS_TOKEN = "NYAM_ACCESS_TOKEN";
export const REFRESH_TOKEN = "NYAM_REFRESH_TOKEN";
export const DOMAIN = process.env.NEXT_PUBLIC_API_URL;
export const SIGNIN = `${DOMAIN}/auth/login/`;
export const SIGNUP = `${DOMAIN}/auth/register/`;
export const OTP_UPDATE = `${DOMAIN}/otp/verify-update/`;
export const OTP = `${DOMAIN}/otp/verify`;