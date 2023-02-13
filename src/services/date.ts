import dayjs from "dayjs";

function getBrDate(date: Date): string {
  try {
    return dayjs(date).format("DD/MM/YYYY");
  } catch (error) {
    return "-";
  }
}

function getTime(date: Date): string {
  try {
    return dayjs(date).format("HH:mm");
  } catch (error) {
    return "-";
  }
}

export { getBrDate, getTime };
