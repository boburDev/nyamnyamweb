export const phoneRegex = /^\+998\d{9}$/;
export const phoneLocalRegex = /^\d{9}$/;
  export const normalizePhone = (raw: string) => {
    if (phoneRegex.test(raw)) return raw;
    if (phoneLocalRegex.test(raw)) return `+998${raw}`;
    return raw;
  };