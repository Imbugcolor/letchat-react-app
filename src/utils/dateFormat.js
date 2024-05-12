const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  
  
export const getTimeFromDate = (_date) => {
    const date_format = new Date(_date).toLocaleString().replace('-', '/').split(' ')[1].replace('-', '/');
    return date_format + ' - ' + formatAMPM(new Date(_date))
}

export const formatDDMMYYYYDate = (date) => {
  // Extract year, month, and day components
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
  const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed

  // Concatenate components into the desired format
  const formattedDate = day + '/' + month + '/' + year;

  return formattedDate;
}

export const formatInputDate = (date) => {
  // Extract year, month, and day components
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
  var day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed

  // Concatenate components into the desired format
  var formattedDate = year + '-' + month + '-' + day;

  return formattedDate;
}