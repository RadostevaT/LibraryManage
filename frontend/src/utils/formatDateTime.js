function formatDateTime(dateTimeString) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    const formattedDate = new Date(dateTimeString)
        .toLocaleDateString(undefined, options);

    const formattedTime = new Date(dateTimeString)
        .toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});

    return `${formattedDate} ${formattedTime}`.replace(',', '');
}

export default formatDateTime;
