import dayjs from "dayjs";

const formatDate = (dateString: any) => {
  if (!dateString) return "-";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("pt-BR", {
      ...options,
      timeZone: "UTC",
    });
  }

  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

const toIsoLocalDateTime = (dateString: any) => {
  return dayjs(dateString).format("YYYY-MM-DDTHH:mm:ss");
};

const toIsoLocalDate = (dateString: any) => {
  return dayjs(dateString).format("YYYY-MM-DD");
};

const formatDateWithTime = (dateTime: any) => {
  if (!dateTime) return "-";
  const date = new Date(dateTime);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return date.toLocaleString("pt-BR", options);
};
const extractTime = (dateTime: any) => {
  if (!dateTime) return "-";
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleTimeString("pt-BR", options);
}

export { formatDate, toIsoLocalDateTime, toIsoLocalDate, formatDateWithTime, extractTime };
