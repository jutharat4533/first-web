export function validateRequired(fields: Record<string, boolean>): string | null {
  const missing = Object.entries(fields)
    .filter(([, valid]) => !valid)
    .map(([label]) => label);

  if (missing.length === 0) return null;
  return `กรุณากรอกข้อมูลให้ครบ: ${missing.join(", ")}`;
}
