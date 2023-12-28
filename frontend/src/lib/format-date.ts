import moment from "moment";

export function formatDate({
  date,
  format,
  formatToday,
}: {
  date: moment.MomentInput;
  format: string;
  formatToday: string;
}): string {
  const isToday = moment(date).format("ddMMYYYY") === moment(new Date()).format("ddMMYYYY");

  return moment(date).format(isToday ? formatToday : format);
}
