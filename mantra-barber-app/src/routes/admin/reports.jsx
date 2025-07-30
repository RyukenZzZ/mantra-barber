import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Card } from "flowbite-react";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaChartLine,
  FaUndoAlt,
  FaPercentage,
} from "react-icons/fa";
import {
  format,
  startOfMonth,
  endOfDay,
  isSameDay,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  addDays,
} from "date-fns";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getPayments } from "../../service/payments";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { generatePDFReportWithChart } from "../../components/Reports/generatePDF";
import { getBookings } from "../../service/bookings";
import { getBarbers } from "../../service/barbers";
import * as XLSX from "xlsx";
import Protected from "../../components/Auth/Protected";

export const Route = createFileRoute("/admin/reports")({
    component: () => (
        <Protected roles={["admin"]}>
            <ReportComponent />
        </Protected>
    ),
});

function ReportComponent() {
  const chartRef = useRef();

  const [filterType, setFilterType] = useState("today");
  const [dateRange, setDateRange] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useSelector((s) => s.auth);

  const { data: payments = [] } = useQuery({
    queryKey: ["getPayments"],
    queryFn: () => getPayments(),
    enabled: !!token,
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ["getBarbers"],
    queryFn: () => getBarbers(),
    enabled: !!token,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["getBookings"],
    queryFn: () => getBookings(),
    enabled: !!token,
  });

  const getReportTitle = (mode = filterType, range = dateRange) => {
    const now = new Date();
    
        if (mode === "range" && range?.from && range?.to) {
      const start = format(range.from, "dd MMM yyyy", { locale: id });
      const end = format(range.to, "dd MMM yyyy", { locale: id });
      return `Laporan Rentang Tanggal (${start} - ${end})`;
    }

    if (filterType === "today") {
      return `Laporan Hari Ini (${format(now, "dd MMMM yyyy", { locale: id })})`;
    }

    if (mode === "thisMonth") {
      return `Laporan Bulan ${format(now, "MMMM yyyy", { locale: id })}`;
    }

    if (mode === "thisYear") {
      return `Laporan Tahun ${format(now, "yyyy", { locale: id })}`;
    }

    if (mode === "thisWeek") {
      const start = format(startOfWeek(now, { locale: id }), "dd MMM yyyy", {
        locale: id,
      });
      const end = format(endOfWeek(now, { locale: id }), "dd MMM yyyy", {
        locale: id,
      });
      return `Laporan Minggu Ini (${start} - ${end})`;
    }

    return "Laporan Penjualan";
  };

  function generateSalesData(payments, mode = "today", customRange = null) {
    const today = new Date();
    let data = [];

    if (mode === "range" && customRange?.from && customRange?.to) {
      const current = new Date(customRange.from);
      while (current <= customRange.to) {
        data.push({
          date: format(current, "dd MMM"),
          rawDate: format(current, "yyyy-MM-dd"),
          sales: 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (mode === "thisWeek") {
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Senin
  data = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i); // dari Senin ke Minggu
    return {
      date: format(date, "dd MMM"),
      rawDate: format(date, "yyyy-MM-dd"),
      sales: 0,
    };
  });
}
 else if (mode === "thisMonth") {
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const daysInMonth = end.getDate();
      data = Array.from({ length: daysInMonth }, (_, i) => {
        const currentDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          i + 1
        );
        return {
          date: format(currentDate, "dd"),
          rawDate: format(currentDate, "yyyy-MM-dd"),
          sales: 0,
        };
      });
    } else if (mode === "thisYear") {
      // Per bulan
      data = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today.getFullYear(), i, 1);
        return {
          date: format(date, "MMM", { locale: id }), // Mis: Jan, Feb, dst
          month: i + 1,
          year: today.getFullYear(),
          sales: 0,
        };
      });
    } else if (mode === "today") {
      data = [
        {
          date: format(today, "dd MMM"),
          rawDate: format(today, "yyyy-MM-dd"),
          sales: 0,
        },
      ];
    }

    payments.forEach((payment) => {
      const status = payment.status;
      const bookingDate = payment.bookings?.booking_date;
      if (!["done", "paid","cancelled"].includes(status)) return;
      if (!bookingDate) return;

      const dateObj = new Date(bookingDate);
      if (mode === "today") {
        if (isSameDay(dateObj, today)) {
          data[0].sales += payment.amount;
        }
      }

      if (mode === "thisYear") {
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const found = data.find((d) => d.month === month && d.year === year);
        if (found) {
          found.sales += payment.amount;
        }
      } else {
        data.forEach((d) => {
          if (isSameDay(new Date(d.rawDate), dateObj)) {
            d.sales += payment.amount;
          }
        });
      }
    });

    return data.map(({ ...rest }) => rest);
  }

  const appliedFilter = dateRange?.from && dateRange?.to ? "range" : filterType;
  const customRange = dateRange?.from && dateRange?.to ? dateRange : null;
  const monthlySalesData = generateSalesData(
    payments,
    appliedFilter,
    customRange
  );

  // Perhitungan metrik
  const filteredPayments = payments.filter((p) => {
  if (!["done", "paid", "cancelled"].includes(p.status)) return false;

  const rawDate = p.bookings?.booking_date;
  if (!rawDate) return false;
  const date = new Date(rawDate); // Booking date sebagai acuan filter

  if (appliedFilter === "today") {
    return isSameDay(date, new Date());
  }
if (appliedFilter === "thisWeek") {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });     
  return date >= startOfDay(start) && date <= endOfDay(end);
}

if (appliedFilter === "thisMonth") {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  return date >= startOfDay(start) && date <= endOfDay(end);
}

if (appliedFilter === "thisYear") {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(new Date().getFullYear(), 11, 31);
  return date >= startOfDay(start) && date <= endOfDay(end);
}
  
  if (appliedFilter === "range" && customRange) {
    return (
      date >= startOfDay(customRange.from) && date <= endOfDay(customRange.to)
    );
  }

  return true;
});

  const totalSales = filteredPayments
    .filter((p) => ["done", "paid", "cancelled"].includes(p.status))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalTransactions = filteredPayments.length;
  const doneBookings = filteredPayments.filter(
    (p) => p.status === "done"
  ).length;
  const cancelledBookings = filteredPayments.filter(
    (p) => p.status === "cancelled"
  ).length;

  const barberCounts = {};
  barbers.forEach((barber) => {
    barberCounts[barber.name] = 0; // inisialisasi semua dengan 0
  });

  bookings
   .filter((booking) => {
  if (booking.status !== "done") return false;

  const date = new Date(booking.booking_date);
  if (appliedFilter === "range" && customRange) {
    return (
      date >= startOfDay(customRange.from) &&
      date <= endOfDay(customRange.to)
    );
  }
  if (appliedFilter === "today") {
    return isSameDay(date, new Date());
  }
  if (appliedFilter === "thisWeek") {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return date >= startOfDay(start) && date <= endOfDay(end);
  }
  if (appliedFilter === "thisMonth") {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return date >= startOfDay(start) && date <= endOfDay(end);
  }
  if (appliedFilter === "thisYear") {
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date(new Date().getFullYear(), 11, 31);
    return date >= startOfDay(start) && date <= endOfDay(end);
  }
  return true;
}).forEach((booking) => {
      const barberName = booking.barbers?.name;
      if (barberName) {
        barberCounts[barberName] = (barberCounts[barberName] || 0) + 1;
      }
    });

  const barberCommissions = barbers.map((barber) => ({
    name: barber.name,
    amount: barberCounts[barber.name] || 0,
  }));

  const cards = [
    {
      label: "Total Penjualan",
      value: `Rp ${totalSales.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-blue-600 text-xl" />,
    },
    {
      label: "Total Transaksi",
      value: totalTransactions,
      icon: <FaShoppingCart className="text-pink-600 text-xl" />,
    },
    {
      label: "Booking Selesai",
      value: doneBookings,
      icon: <FaChartLine className="text-green-600 text-xl" />,
    },
    {
      label: "Booking Dibatalkan",
      value: cancelledBookings,
      icon: <FaUndoAlt className="text-red-600 text-xl" />,
    },
  ];

  const barberCards = barberCommissions.map((barber) => ({
    label: `Komisi ${barber.name}`,
    value: `${barber.amount.toLocaleString()}`,
    icon: <FaPercentage className="text-orange-600 text-xl" />,
  }));

  const barberTotals = {};
  bookings.forEach((booking) => {
    if (booking.status !== "done") return;

    const date = new Date(booking.booking_date);

   if (appliedFilter === "range" && customRange) {
  if (
    date < startOfDay(customRange.from) ||
    date > endOfDay(customRange.to)
  ) return;  
} else if (appliedFilter === "today") {
  if (!isSameDay(date, new Date())) return;
  }else if (appliedFilter === "thisWeek") {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  if (date < startOfDay(start) || date > endOfDay(end)) return;
} else if (appliedFilter === "thisMonth") {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  if (date < startOfDay(start) || date > endOfDay(end)) return;
} else if (appliedFilter === "thisYear") {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(new Date().getFullYear(), 11, 31);
  if (date < startOfDay(start) || date > endOfDay(end)) return;
}


    const barberName = booking.barbers?.name;
    const servicePrice = booking.services?.price;

    if (!barberName || !servicePrice) return;

    if (!barberTotals[barberName]) {
      barberTotals[barberName] = { totalService: 0 };
    }

    barberTotals[barberName].totalService += servicePrice;
  });


  const exportAllDataToExcel = () => {
    const mode = dateRange?.from && dateRange?.to ? "range" : filterType;
    const range = dateRange?.from && dateRange?.to ? dateRange : null;

    const reportTitle = getReportTitle(mode, range);
    const wb = XLSX.utils.book_new();

    // Sheet 1: Ringkasan Penjualan
    const summaryData = [
      [reportTitle],
      [],
      [
        "Total Penjualan",
        "Total Transaksi",
        "Jumlah Booking Selesai",
        "Jumlah Booking Dibatalkan",
      ],
      [totalSales, totalTransactions, doneBookings, cancelledBookings],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Ringkasan");

    // Sheet 2: Komisi Barber
    const barberData = [
      ["Laporan Komisi Barber"],
      [],
      [
        "Nama Barber",
        "Total Service",
        "Komisi Barber (60%)",
        "Komisi Owner (40%)",
      ],
      ...barbers.map((barber) => {
        const totalService = barberTotals[barber.name]?.totalService || 0;
        const komisiBarber = totalService * 0.6;
        const komisiOwner = totalService * 0.4;

        return [
          barber.name,
          `Rp ${totalService.toLocaleString()}`,
          `Rp ${komisiBarber.toLocaleString()}`,
          `Rp ${komisiOwner.toLocaleString()}`,
        ];
      }),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(barberData);
    XLSX.utils.book_append_sheet(wb, ws2, "Komisi Barber");

    // Sheet 3: Data Grafik
    const chartData = [
      [reportTitle],
      [],
      ["Tanggal", "Total Penjualan"],
      ...monthlySalesData.map((item) => [
        item.date,
        `Rp ${item.sales.toLocaleString()}`,
      ]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(chartData);
    XLSX.utils.book_append_sheet(wb, ws3, "Data Grafik");

    // Export file
    const fileName = `Laporan - ${reportTitle}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="p-6 space-y-6 bg-white text-gray-900 min-h-screen rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Laporan - Ringkasan Penjualan</h2>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative max-w-xs">
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            onClick={() => setIsOpen((prev) => !prev)}
            onBlur={() => setIsOpen(false)}
            className="bg-white text-black border border-gray-300 rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="today" className="text-xs lg:text-md">Hari Ini</option>
            <option value="thisWeek" className="text-xs lg:text-md">Minggu Ini</option>
            <option value="thisMonth" className="text-xs lg:text-md">Bulan Ini</option>
            <option value="thisYear" className="text-xs lg:text-md">Tahun Ini</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-[15px] text-gray-700">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>

        <div className="relative">
          <button
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            Pilih Rentang Tanggal
          </button>

          {showPicker && (
            <div className="absolute z-50 bg-white p-4 shadow-md rounded-md mt-2">
              <DayPicker
                mode="range"
                selected={dateRange || undefined}
                onSelect={(range) => setDateRange(range)}
                locale={id}
                footer={
                  dateRange?.from && dateRange?.to ? (
                    <p className="text-sm text-center mt-2">
                      Dipilih dari{" "}
                      <b>
                        {format(dateRange.from, "dd MMM yyyy", { locale: id })}
                      </b>{" "}
                      sampai{" "}
                      <b>
                        {format(dateRange.to, "dd MMM yyyy", { locale: id })}
                      </b>
                    </p>
                  ) : (
                    <p className="text-sm text-center mt-2">
                      Pilih rentang tanggal
                    </p>
                  )
                }
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 !text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    if (dateRange?.from && dateRange?.to) {
                      setShowPicker(false);
                    }
                  }}
                  disabled={!dateRange?.from || !dateRange?.to}
                >
                  Terapkan Filter
                </button>
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setDateRange(null);
                    setShowPicker(false);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...cards, ...barberCards].map((card, index) => (
          <Card key={index} className="p-4 !bg-white !border-gray-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">{card.icon}</div>
              <div>
                <h5 className="text-md font-medium text-gray-800">
                  {card.label}
                </h5>
                <p className="text-xl font-bold text-black">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grafik */}
      <div  className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Grafik Penjualan</h3>
        <div ref={chartRef} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySalesData}
              margin={{ top: 30, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                label={{
                  value:
                    appliedFilter === "thisYear"
                      ? `Tahun ${new Date().getFullYear()}`
                      : appliedFilter === "thisMonth"
                        ? `Bulan ${format(new Date(), "MMMM", { locale: id })}`
                        : "Tanggal",
                  position: "outsideBottom",
                  offset: 10,
                  style: { fill: "#000" }, // warna hitam
                }}
                height={80}
              />
              <YAxis
                domain={[0, (dataMax) => Math.ceil(dataMax / 500000) * 500000]} // dinamis kelipatan 500rb
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

<div className="flex gap-4">
      <button
        onClick={exportAllDataToExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Export ke Excel
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        onClick={() =>
          generatePDFReportWithChart({
      reportTitle: getReportTitle(appliedFilter, customRange),
            totalSales,
            totalTransactions,
            doneBookings,
            cancelledBookings,
            barbers,
            barberTotals,
            chartRef,
          })
        }
      >
        Export PDF
      </button>
      </div>
    </div>
  );
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
