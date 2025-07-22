import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { getBookings } from "../../service/bookings";
import { useSelector } from "react-redux";
import {
  isToday,
  isAfter,
  format,
  parseISO,
  parse,
  isTomorrow,
} from "date-fns";
import { id } from "date-fns/locale";
import { doneBooking } from "../../service/bookings";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import NFBooking from "../../assets/NotFoundBookings.png";
import Protected from "../../components/Auth/Protected";
import { HiCheck } from "react-icons/hi";

export const Route = createFileRoute("/admin/dashboard")({
    component: () => (
        <Protected roles={["admin"]}>
            <AdminDashboardComponent />
        </Protected>
    ),
});

function AdminDashboardComponent() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);

  // Filter state: bisa "today" atau "tomorrow"
  const [filters, setFilters] = useState({ day: "today" });

  // Ambil data booking via React Query
  const { data: Bookings = [], isLoading } = useQuery({
    queryKey: ["getBookings"],
    queryFn: getBookings,
    enabled: !!token,
  });

  // Mutation untuk menandai booking selesai
  const { mutate: handleDoneBooking } = useMutation({
    mutationFn: (id) => doneBooking(id),
    onSuccess: () => {
      toast.success("Booking Sudah Selesai 🙏");
      queryClient.invalidateQueries(["getBookings"]);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menyelesaikan booking");
    },
  });

  // Konfirmasi sebelum menandai selesai
  function handleMarkAsDone(id) {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "akan menyelesaikan Booking ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, selesaikan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDoneBooking(id);
        Swal.fire("Berhasil!", "Booking sudah diselesaikan.", "success");
      }
    });
  }

  // Statistik - jumlah booking hari ini
  const todayBookings = Bookings.filter(
    (b) =>
      isToday(parseISO(b.booking_date)) &&
      ["booked", "isPending"].includes(b.status)
  ).length;

  // Statistik - booking mendatang (setelah hari ini)
  const upcomingBookings = Bookings.filter(
    (b) =>
      isAfter(parseISO(b.booking_date), new Date()) &&
      ["booked", "isPending"].includes(b.status)
  ).length;

  // Statistik - booking selesai hari ini
  const completedBookings = Bookings.filter(
    (b) => b.status === "done" && isToday(parseISO(b.booking_date))
  ).length;

  // Statistik - pendapatan hari ini, rumusnya diskon 50% untuk booked & cancelled
  const todayRevenue = Bookings.filter(
    (b) =>
      isToday(parseISO(b.booking_date)) &&
      ["done", "booked", "cancelled"].includes(b.status)
  ).reduce((total, b) => {
    const price = b.services?.price || 0;
    if (b.status === "done") return total + price;
    if (["booked", "cancelled"].includes(b.status)) return total + price / 2;
    return total;
  }, 0);

  // Format rupiah
  const todayRevenueFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(todayRevenue);

  // Tombol lihat semua (reset filter)
  const handleShowAll = () => setFilters({ day: null });

  // Filter bookings sesuai filter hari (today, tomorrow, atau semua)
  const filteredBookings = Bookings.filter((b) => {
    const date = parseISO(b.booking_date);
    if (filters.day === "today" && !isToday(date)) return false;
    if (filters.day === "tomorrow" && !isTomorrow(date)) return false;
    return ["booked", "isPending", "done", "cancelled"].includes(b.status);
  }).sort((a, b) => {
    // Urutkan berdasarkan tanggal + jam booking
    const dateTimeA = parse(
      `${format(parseISO(a.booking_date), "yyyy-MM-dd")} ${format(
        parseISO(a.booking_time),
        "HH:mm"
      )}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const dateTimeB = parse(
      `${format(parseISO(b.booking_date), "yyyy-MM-dd")} ${format(
        parseISO(b.booking_time),
        "HH:mm"
      )}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    return dateTimeA - dateTimeB;
  });

  // Handle klik filter (today / tomorrow)
  const handleFilterClick = (day) => setFilters({ day });

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={<HiOutlineCalendarDays className="text-3xl text-blue-600" />}
          label="Booking Hari Ini"
          value={todayBookings}
          color="blue"
        />
        <StatCard
          icon={<HiOutlineCalendar className="text-3xl text-yellow-600" />}
          label="Booking Mendatang"
          value={upcomingBookings}
          color="yellow"
        />
        <StatCard
          icon={<HiOutlineCheckBadge className="text-3xl text-green-600" />}
          label="Booking Selesai"
          value={completedBookings}
          color="green"
        />
        <StatCard
          icon={
            <HiOutlineCurrencyDollar className="text-3xl text-purple-600" />
          }
          label="Pendapatan Hari Ini"
          value={todayRevenueFormatted}
          color="purple"
        />
      </div>

      {/* Tabel Booking */}
      <div className="mt-6 bg-white rounded-xl shadow border border-gray-300">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Booking{" "}
            {filters.day
              ? filters.day === "today"
                ? "Hari Ini"
                : "Besok"
              : "Semua"}
          </h2>
          {/* Filter Tombol */}
          <div className="flex gap-3">
            <button
              onClick={() => handleFilterClick("today")}
              className={`px-4 py-2 rounded-md font-semibold ${
                filters.day === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => handleFilterClick("tomorrow")}
              className={`px-4 py-2 rounded-md font-semibold ${
                filters.day === "tomorrow"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Besok
            </button>
            <button
              onClick={handleShowAll}
              className={`px-4 py-2 rounded-md font-semibold ${
                !filters.day
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
            <thead className="bg-blue-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Telepon</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Jam</th>
                <th className="px-6 py-3">Layanan (Harga)</th>
                <th className="px-6 py-3">Barber</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-10">
                    <div className="animate-spin h-10 w-10 mx-auto border-t-4 border-blue-600 rounded-full"></div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <img
                        src={NFBooking}
                        alt="No Bookings"
                        className="w-60 h-60 mb-4"
                      />
                      <p className="text-lg font-semibold">
                        Belum ada booking untuk{" "}
                        {filters.day
                          ? filters.day === "today"
                            ? "hari ini"
                            : "besok"
                          : "waktu ini"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-xs">{index + 1}</td>
                    <td className="px-6 py-4 text-xs">{booking.cust_name}</td>
                    <td className="px-6 py-4 text-xs">{booking.cust_phone_number}</td>
                    <td className="px-6 py-4 text-xs">
                      {format(parseISO(booking.booking_date), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {format(parseISO(booking.booking_time), "HH:mm")} WIB
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {booking.services?.name} (Rp{" "}
                      {Math.floor(booking.services?.price / 1000)}K)
                    </td>
                    <td className="px-6 py-4 text-xs">{booking.barbers.name}</td>
                    <td className="px-6 py-4 text-xs">
                      <span
                        className={`px-3 py-2 rounded-full text-xs font-semibold ${
                          booking.status === "done"
                            ? "bg-green-100 text-green-600"
                            : booking.status === "isPending"
                              ? "bg-yellow-100 text-yellow-600"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {booking.status !== "done" &&
                        booking.status !== "cancelled" && (
                          <button
                            onClick={() => handleMarkAsDone(booking.id)}
                            className="text-xs text-white px-2 py-2 rounded-full bg-blue-600 hover:bg-blue-700"
                          >
                            <HiCheck />
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-300 p-5 shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <div className={`rounded-full bg-${color}-100 p-3`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-lg font-bold sm:text-xl">{value}</h3>
        </div>
      </div>
    </div>
  );
}
