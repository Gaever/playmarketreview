import moment from "moment";

function localTime(date?: moment.MomentInput) {
  if (!date) {
    return moment();
  }
  return moment.utc(date).local();
}

export default localTime;
