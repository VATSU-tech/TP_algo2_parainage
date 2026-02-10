export const formatMoney = (value: number) => `${value.toFixed(2)} $`;

export const getNextId = (items: { id: number }[]) =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
