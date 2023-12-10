export const searchDataValidator = (data: string) => {
  if (!data) {
    return data;
  }

  return data.replace(/[е|ё]/g, "е");
};
