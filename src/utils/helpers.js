import moment from "moment";

export const formatDate = (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : ''
}

export const formatDateTo24Hour = (date) => {
    const momentDate = moment(date)

    return momentDate.isValid() ? momentDate.format('HH:mm') : ''
}