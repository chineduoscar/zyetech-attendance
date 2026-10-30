import jsPDF from "jspdf";

const loadImageAsBase64 = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Unable to prepare the receipt image."));
        return;
      }
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error(`Unable to load ${url}.`));
    image.src = url;
  });

export const generatePDFReceipt = async (data) => {
  const {
    studentName,
    studentPhone,
    course,
    totalCost,
    amountPaid,
    previousPaid,
    totalPaid,
    outstandingBalance,
    paymentMethod,
    paymentPlan,
    currentStage,
    settleByDate,
    note,
    receiptNumber,
    receiptDate,
  } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const navy = [6, 6, 111];
  const dark = [30, 33, 40];
  const gray = [100, 110, 120];
  let y = 40;

  const logo = await loadImageAsBase64("/logo.png");
  doc.addImage(logo, "PNG", pageWidth - margin - 50, y, 50, 50);
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ZYETECH INNOVATION TECHNOLOGY", margin, y + 12);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("36 Trans Amadi Industrial Layout Road, Rumuobiakani", margin, y + 28);
  doc.text("Port-Harcourt, Rivers State.", margin, y + 42);
  doc.setFontSize(8.5);
  doc.text(
    "Call: (+234) 9113263807     |     Email: zyetechofficial@gmail.com",
    margin,
    y + 58,
  );

  y += 85;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...dark);
  doc.text("PAYMENT RECEIPT", margin, y);
  y += 20;

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  const hasReceiptNumber = Boolean(receiptNumber?.trim());
  if (hasReceiptNumber) doc.text("Receipt No:", margin, y + 12);
  doc.text("Date:", margin + 160, y + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  if (hasReceiptNumber) doc.text(receiptNumber, margin, y + 26);
  doc.text(receiptDate || "", margin + 160, y + 26);

  y += 40;
  doc.setDrawColor(...dark);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  const leftX = margin;
  const rightX = pageWidth / 2 + 20;
  const leftWidth = pageWidth / 2 - margin - 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Received From:", leftX, y);
  doc.text("Payment Summary:", rightX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const nameLines = doc.splitTextToSize(`Name: ${studentName}`, leftWidth);
  const phoneLines = doc.splitTextToSize(
    `Contact: ${studentPhone || "Not provided"}`,
    leftWidth,
  );
  doc.text(nameLines, leftX, y);
  const contactY = y + nameLines.length * 13 + 3;
  doc.text(phoneLines, leftX, contactY);
  const leftEnd = contactY + phoneLines.length * 13;

  const numericTotal = Number(totalCost) || 0;
  const currentPaid = Number(amountPaid) || 0;
  const priorPaid = Number(previousPaid) || 0;
  const cumulativePaid = Number(totalPaid) || currentPaid + priorPaid;
  const balance =
    Number(outstandingBalance) || Math.max(0, numericTotal - cumulativePaid);
  let rightOffset = 0;
  const summaryLines = [
    `Total Cost: NGN ${numericTotal.toLocaleString()}`,
    ...(paymentPlan === "Installment" && currentStage !== "1st"
      ? [`Previous Paid: NGN ${priorPaid.toLocaleString()}`]
      : []),
    `Amount Paid (Current): NGN ${currentPaid.toLocaleString()}`,
    `Total Cumulative Paid: NGN ${cumulativePaid.toLocaleString()}`,
    `Payment Method: ${paymentMethod}`,
    ...(paymentPlan === "Installment"
      ? [`Outstanding Balance: NGN ${balance.toLocaleString()}`]
      : []),
  ];
  summaryLines.forEach((line) => {
    doc.text(line, rightX, y + rightOffset);
    rightOffset += 16;
  });
  y = Math.max(y + rightOffset, leftEnd) + 20;

  doc.setFillColor(...navy);
  doc.rect(margin, y, contentWidth, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", margin + 10, y + 17);
  doc.text("Amount", pageWidth - margin - 85, y + 17);

  const rowTop = y + 26;
  const description =
    paymentPlan === "Installment"
      ? `${course} (${currentStage} Installment)`
      : course;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...dark);
  const descriptionLines = doc.splitTextToSize(description, contentWidth - 130);
  const rowHeight = Math.max(36, descriptionLines.length * 12 + 20);
  doc.setDrawColor(180, 184, 192);
  doc.setLineWidth(1);
  doc.rect(margin, rowTop, contentWidth, rowHeight);
  doc.text(descriptionLines, margin + 10, rowTop + 22);
  doc.setFont("helvetica", "bold");
  doc.text(
    `NGN ${currentPaid.toLocaleString()}`,
    pageWidth - margin - 85,
    rowTop + 22,
  );
  y = rowTop + rowHeight + 25;

  if (note?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...navy);
    doc.text("Additional Notes:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    const noteLines = doc.splitTextToSize(note.trim(), contentWidth);
    doc.text(noteLines, margin, y + 14, { lineHeightFactor: 1.3 });
    y += 18 + noteLines.length * 9 * 1.3 + 10;
  }

  if (y + 260 > pageHeight - 40) {
    doc.addPage();
    y = 40;
  }
  const leftSectionWidth = pageWidth / 2 - margin - 20;
  const signatureX = pageWidth / 2 + 20;
  const sectionTop = y + 10;
  let leftY = sectionTop;
  const drawParagraph = (text, size, gapAfter = 8) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, leftSectionWidth);
    doc.text(lines, margin, leftY, { lineHeightFactor: 1.3 });
    leftY += lines.length * size * 1.3 + gapAfter;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Payment Terms:", margin, leftY);
  leftY += 16;
  doc.setFont("helvetica", "normal");
  if (paymentPlan === "Installment" && settleByDate) {
    const dueDate = new Date(`${settleByDate}T00:00:00`).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" },
    );
    drawParagraph(
      `This is a part payment. Kindly settle the remaining balance on or before ${dueDate}.`,
      9,
    );
  }
  drawParagraph(
    "For inquiries, call: (+234) 9113263807 or email: zyetechofficial@gmail.com",
    9,
    14,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...navy);
  doc.text("NOTE:", margin, leftY);
  leftY += 12;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  drawParagraph("1. No Refund Policy: All payments made are non-refundable.", 8, 4);
  drawParagraph(
    "2. No Course Change: Once the first class of a course has commenced, students are not permitted to change to another course.",
    8,
    4,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Authorized By:", signatureX, sectionTop);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Emmanuel Majekodunmi", signatureX, sectionTop + 16);
  const signature = await loadImageAsBase64("/sign.png");
  doc.addImage(signature, "PNG", signatureX, sectionTop + 22, 130, 45);
  doc.line(signatureX, sectionTop + 75, pageWidth - margin, sectionTop + 75);
  doc.setFontSize(8.5);
  doc.text("Signature", signatureX, sectionTop + 87);

  const footerY = Math.max(leftY, sectionTop + 87) + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Thank You For", margin, footerY);
  doc.text("Your Payment!", margin, footerY + 15);

  doc.save(
    hasReceiptNumber
      ? `zyetech-receipt-${receiptNumber}.pdf`
      : "zyetech-receipt-general.pdf",
  );
};
