export const isEmailValid = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const isRequired = (value: string | number | undefined | null): boolean => {
  return value !== undefined && value !== null && value.toString().trim().length > 0;
};
