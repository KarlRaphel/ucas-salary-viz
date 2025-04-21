export function getCurrentDate(monthOffset = 0) {
  let date = new Date() - monthOffset * 30 * 24 * 60 * 60 * 1000;
  date = new Date(date);
  const year = date.getFullYear();
  // getMonth() 方法返回 0-11，因此需要加1，同时我们希望月份是两位数，所以使用 padStart 方法确保月份是两位数字
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}