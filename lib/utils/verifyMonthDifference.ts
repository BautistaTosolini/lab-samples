export function verifyMonthDifference(initialDate: Date, finalDate: Date): boolean {
  const firstDate = new Date(initialDate);
  const lastDate = new Date(finalDate);

  firstDate.setMonth(firstDate.getMonth() + 1);

  return lastDate >= firstDate;
}