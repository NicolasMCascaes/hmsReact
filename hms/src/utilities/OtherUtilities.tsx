const arrayToCsv = (arr:string[]) => {
    if (!arr || arr.length === 0) {
        return ""
    }
  return arr.join(', ');
}
const addZeroMonths = (data: any[], monthKey: string, valueKey: string) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const result = months.map((month) => {
      const found = data.find((item) => item[monthKey] === month);
      return {
        [monthKey]: month,
        [valueKey]: found ? found[valueKey] : 0,
      };
    });
    return result;

}
export {arrayToCsv, addZeroMonths}