import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePDFReportWithChart = async ({
  reportTitle = "Laporan Penjualan",
  totalSales,
  totalTransactions,
  doneBookings,
  cancelledBookings,
  barbers = [],
  barberTotals = {},
  chartRef, // ref ke div chart
}) => {
  const doc = new jsPDF();

  // 1. Judul
  doc.setFontSize(16);
  doc.text(reportTitle, 14, 20);

  // 2. Ringkasan Penjualan
  autoTable(doc, {
    startY: 30,
    head: [["Total Penjualan", "Total Transaksi", "Booking Selesai", "Booking Dibatalkan"]],
    body: [[
      `Rp ${totalSales.toLocaleString()}`,
      totalTransactions,
      doneBookings,
      cancelledBookings,
    ]],
  });

  // 3. Komisi Barber
  const barberData = barbers.map((barber) => {
    const total = barberTotals[barber.name]?.totalService || 0;
    const komisiBarber = total * 0.6;
    const komisiOwner = total * 0.4;
    return [
      barber.name,
      `Rp ${total.toLocaleString()}`,
      `Rp ${komisiBarber.toLocaleString()}`,
      `Rp ${komisiOwner.toLocaleString()}`,
    ];
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Nama Barber", "Total Service", "Komisi Barber (60%)", "Komisi Owner (40%)"]],
    body: barberData,
    didDrawPage: async (data) => {
      if (chartRef?.current) {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL("image/png");

        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 28; // 14 + 14 margin
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const chartStartY = data.cursor.y + 15;

        // Jika chart melebihi halaman, buat halaman baru
        if (chartStartY + pdfHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text("Grafik Penjualan", 14, 20);
          doc.addImage(imgData, "PNG", 14, 30, pdfWidth, pdfHeight);
        } else {
          doc.setFontSize(14);
          doc.text("Grafik Penjualan", 14, chartStartY);
          doc.addImage(imgData, "PNG", 14, chartStartY + 10, pdfWidth, pdfHeight);
        }

        // Simpan PDF setelah gambar ditambahkan
        const fileName = `${reportTitle.replace(/\s+/g, " ")}.pdf`;
        doc.save(fileName);
      }
    },
  });

  // Jika chartRef tidak tersedia, tetap simpan PDF
  if (!chartRef?.current) {
    const fileName = `${reportTitle.replace(/\s+/g, " ")}.pdf`;
    doc.save(fileName);
  }
};
