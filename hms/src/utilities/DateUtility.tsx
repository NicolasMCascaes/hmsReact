import dayjs from "dayjs";

const formatDate= (dateString: any) => {
  if(!dateString) return '-'
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
   return `${day} de ${month} de ${year}`;
}
const toIsoLocalDateTime = (dateString:any) => {
   return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
}
const toIsoLocalDate = (dateString:any) => {
   return dayjs(dateString).format('YYYY-MM-DD');
}
const formatDateWithTime = (dateTime: any) =>{
  if(!dateTime) return '-'
  const date = new Date(dateTime);

  const options: Intl.DateTimeFormatOptions ={
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day:'numeric',
    hour:'numeric',
    minute:'numeric'
  }
  return date.toLocaleString('pt-br', options)
}
export {formatDate, toIsoLocalDateTime, toIsoLocalDate, formatDateWithTime}