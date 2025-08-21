import moment from "moment";

export const formatDate = (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : ''
}

export const formatDateTo24Hour = (date) => {
    const momentDate = moment(date)

    return momentDate.isValid() ? momentDate.format('HH:mm') : ''
}

export const formatDateWithHour = (date) => {
    const momentDate = moment(date)

    return momentDate.isValid() ? momentDate.format('DD/MM/YYYY, HH:mm') : ''
}

export const getStatusLabel = (status) => {
    const labels = {
        0: 'Pending',
        1: 'Confirmed',
        2: 'Ongoing',
        3: 'Finished',
        4: 'Cancelled',
    };
    return labels[status] || 'Unknown';
};