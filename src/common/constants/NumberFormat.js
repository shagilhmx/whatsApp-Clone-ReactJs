export const numberFormat = number => {
  if (!isNaN(number) && number) {
    let num;
    try {
      num = number
        .toFixed(1)
        .replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,')
        .toString()
        .split('.')[0];
    } catch {
      num = number;
    }
    return num;
  }
  return number;
};
