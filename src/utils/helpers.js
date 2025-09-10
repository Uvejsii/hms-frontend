import moment from "moment";
import jsPDF from "jspdf";
import {hmsLogoBase64} from "@/utils/base64's.js";

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

export const getVacationTypeLabel = (status) => {
    const labels = {
        0: 'Vacation',
        1: 'Sick Leave',
        2: 'Unpaid Leave',
    };
    return labels[status] || 'Unknown';
};

function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8; // ensures UUID version 4 compliance
        return v.toString(16);
    });
}

export const generatePrescription = (data) => {
    const secondaryColor = '#20C997';
    const secondaryLight = '#5DDCBC';
    const secondaryDark = '#13A57E';

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(secondaryColor);
    doc.setLineWidth(1);
    doc.line(10, 40, docWidth - 10, 40);

    const logoSize = 30;
    const logoX = 15;
    const logoY = 5;
    doc.addImage(hmsLogoBase64, 'PNG', logoX, logoY, logoSize, logoSize);

    doc.setFontSize(18);
    doc.setTextColor(secondaryDark);
    doc.text(`Dr. ${data.doctor.firstName} ${data.doctor.lastName}`, docWidth - 10, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor('#333333');
    doc.text(data.doctor.departament.name, docWidth - 10, 27, { align: 'right' });
    doc.setFontSize(8);
    doc.setTextColor('#666666');
    doc.text(`${data.doctor.email}`, docWidth - 10, 32, { align: 'right' });

    const contentY = 50;
    doc.setDrawColor(secondaryLight);
    doc.line(docWidth / 2, contentY, docWidth / 2, docHeight - 30);

    const labelX = 15;
    const fieldYStart = contentY + 10;
    const lineHeight = 10;
    const formattedDate = formatDate(new Date());

    const fields = [
        { label: 'Date:', value: formattedDate },
        { label: 'Name:', value: `${data.user.firstName} ${data.user.lastName}` },
        { label: 'Email:', value: data.user.email },
        { label: 'Phone:', value: data.contactPhoneNumber }
    ];

    doc.setFontSize(10);
    doc.setTextColor('#333333');
    doc.setLineWidth(0.7);
    fields.forEach((field, index) => {
        const currentY = fieldYStart + (index * lineHeight);
        doc.text(`${field.label}`, labelX, currentY);

        if (field.value) {
            doc.text(`${field.value}`, labelX + 15, currentY);
        }

        doc.line(labelX + 15, currentY + 1, docWidth / 2 - 10, currentY + 1);
    });

    doc.setFontSize(18);
    doc.setTextColor(secondaryDark);
    doc.text('Prescription', docWidth / 2 + 10, contentY);

    const prescriptionYStart = contentY + 10;
    doc.setFontSize(10);
    doc.setTextColor('#333333');
    const prescriptionText = data.prescription || "No prescription provided.";

    const prescriptionXStart = docWidth / 2 + 10;
    const prescriptionMaxWidth = docWidth / 2 - 20;

    doc.text(prescriptionText, prescriptionXStart, prescriptionYStart, { maxWidth: prescriptionMaxWidth });

    const footerY = docHeight - 20;
    doc.setFillColor(secondaryLight);
    doc.setDrawColor(secondaryColor);
    doc.rect(0, footerY, docWidth, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor('#ffffff');
    doc.text('+383 44 290 348, +383 45 148 617', 15, footerY + 8);
    doc.text('Muharrem Fejza, Prishtina, 10000', 15, footerY + 15);
    doc.text('Every day (9am - 17:00pm)', docWidth - 15, footerY + 15, { align: 'right' });

    doc.save(`prescription-${data.user.firstName}-${data.user.lastName}.pdf`);
};

export const generateInvoice = (data) => {
    const primaryColor = '#20C997';
    const primaryLight = '#5DDCBC';
    const primaryDark = '#13A57E';
    const secondaryText = '#333333';
    const lightText = '#666666';

    const doc = jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;

    doc.setFontSize(24);
    doc.setTextColor(primaryDark);
    doc.text('INVOICE', docWidth - 20, yPos, { align: 'right' });

    const formattedDate = formatDate(new Date());

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(secondaryText);
    doc.text(`Invoice #: ${generateGUID()}`, docWidth - 20, yPos, { align: 'right' });
    yPos += 5;
    doc.text(`Issue Date: ${formattedDate}`, docWidth - 20, yPos, { align: 'right' });
    const logoSize = 30;
    const logoX = 15;
    const logoY = 5;
    doc.addImage(hmsLogoBase64, 'PNG', logoX, logoY, logoSize, logoSize);

    yPos = 45;
    doc.setFontSize(12);
    doc.setTextColor(secondaryText);
    doc.text('Bill To:', 15, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text(`${data.user.firstName} ${data.user.lastName}`, 15, yPos);
    yPos += 5;
    doc.text(`${data.user.email}`, 15, yPos);
    yPos += 5;
    doc.text(`${data.contactPhoneNumber}`, 15, yPos);

    yPos = 70;
    doc.setFontSize(10);
    doc.setTextColor(primaryDark);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, docWidth - 15, yPos);

    yPos += 5;
    doc.text('Description', 15, yPos);
    doc.text('Date / Time', docWidth / 2, yPos, { align: 'left' });
    doc.text('Total', docWidth - 15, yPos, { align: 'right' });

    yPos += 5;
    doc.setLineWidth(0.1);
    doc.setTextColor(secondaryText);

    doc.text(`Appointment with Dr. ${data.doctor.firstName} ${data.doctor.lastName}`, 15, yPos);

    doc.text(`${formatDateWithHour(data.startTime) + ' - ' + formatDateTo24Hour(data.endTime)}`, docWidth / 2, yPos, { align: 'left' });

    doc.text(`$${data.price.toFixed(2)}`, docWidth - 15, yPos, { align: 'right' });

    yPos = 110;
    doc.setFontSize(10);
    doc.setTextColor(primaryDark);
    doc.setLineWidth(0.2);
    doc.line(15, yPos, docWidth - 15, yPos);

    yPos = docHeight - 180;
    doc.setTextColor(secondaryText);
    doc.setFontSize(10);
    doc.text('Subtotal:', docWidth - 65, yPos, { align: 'right' });
    doc.text(`$${data.price.toFixed(2)}`, docWidth - 15, yPos, { align: 'right' });
    yPos += 5;
    doc.text('Tax (0%):', docWidth - 65, yPos, { align: 'right' });
    doc.text(`$0.00`, docWidth - 15, yPos, { align: 'right' });

    doc.setLineWidth(0.5);
    yPos += 2;
    doc.line(docWidth - 65, yPos, docWidth - 15, yPos);

    yPos += 5;
    doc.setFontSize(12);
    doc.setTextColor(primaryDark);
    doc.text('Total:', docWidth - 65, yPos, { align: 'right' });
    doc.text(`$${data.price.toFixed(2)}`, docWidth - 15, yPos, { align: 'right' });

    const footerY = docHeight - 20;
    doc.setFillColor(primaryLight);
    doc.setDrawColor(primaryColor);
    doc.rect(0, footerY, docWidth, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor('#ffffff');
    doc.text('+383 44 290 348, +383 45 148 617', 15, footerY + 8);
    doc.text('Muharrem Fejza, Prishtina, 10000', 15, footerY + 15);
    doc.text('Every day (9am - 17:00pm)', docWidth - 15, footerY + 15, { align: 'right' });

    doc.save(`appointment-invoice-${data.user.firstName}-${data.user.lastName}.pdf`);
}