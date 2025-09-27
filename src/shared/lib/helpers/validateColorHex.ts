export const validateColorHex = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex);
