import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { getBookings } from "../../service/bookings";
import { useSelector } from "react-redux";
import { isToday,isAfter,format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { doneBooking } from "../../service/payments";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import notFoundBooking from "../../assets/notFoundBooking.png"

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  const queryClient = useQueryClient();

  const { token } = useSelector((state) => state.auth);

  const { data: Bookings = [] } = useQuery({
    queryKey: ["getBookings"],
    queryFn: getBookings,
    enabled: !!token,
  });

  const { mutate: handleDoneBooking } = useMutation({
    mutationFn: (id) => doneBooking(id),
    onSuccess: () => {
      toast.success("Booking Sudah Selesai 🙏");
      queryClient.invalidateQueries(["getBookings"]); // <- ini yang penting
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleMarkAsDone(id) {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "akan menyelesaikan Boooking ini?",
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

  const filteredBookings = Bookings.filter(
  (b) => ["booked", "pending"].includes(b.status)
);

const todayBookings = filteredBookings.filter((b) =>
  isToday(parseISO(b.booking_date))
).length;

const upcomingBookings = filteredBookings.filter((b) =>
  isAfter(parseISO(b.booking_date), new Date())
).length;

const completedBookings = Bookings.filter(
  (b) => b.status === "done"
).length;

const todayRevenue = Bookings.filter(
  (b) =>
    b.status === "done"|| b.status === "isPending" && isToday(parseISO(b.booking_date))
).reduce((total, b) => total + (b.services?.price || 0), 0) / 1000;

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Booking Hari Ini */}
        <div className="flex items-center justify-between rounded-xl border border-gray-300 p-5 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <HiOutlineCalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Hari Ini</p>
              <h3 className="text-2xl font-bold">{todayBookings}</h3>
            </div>
          </div>
        </div>

        {/* Booking Mendatang */}
        <div className="flex items-center justify-between rounded-xl border border-gray-300 p-5 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <HiOutlineCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Mendatang</p>
              <h3 className="text-2xl font-bold">{upcomingBookings}</h3>
            </div>
          </div>
        </div>

        {/* Booking Selesai */}
        <div className="flex items-center justify-between rounded-xl border border-gray-300 p-5 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <HiOutlineCheckBadge className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Selesai</p>
              <h3 className="text-2xl font-bold">{completedBookings}</h3>
            </div>
          </div>
        </div>

        {/* Pendapatan Hari Ini */}
        <div className="flex items-center justify-between rounded-xl border border-gray-300 p-5 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <HiOutlineCurrencyDollar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendapatan Hari Ini</p>
              <h3 className="text-2xl font-bold">Rp {todayRevenue}.000</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-300">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Booking Terbaru</h2>
          <button className="text-sm text-blue-600 hover:underline">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-600 text-center">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Nomor Telepon</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Jam</th>
                <th className="px-6 py-3">Service (Harga)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
<tbody className="divide-y text-center divide-gray-100">
  {[...Bookings]
    .filter((booking) =>
      ["booked", "done", "isPending"].includes(booking.status)
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.booking_date}T${a.booking_time}`);
      const dateB = new Date(`${b.booking_date}T${b.booking_time}`);
      return dateB - dateA;
    }).length === 0 ? (
      <tr>
        <td colSpan="8" className="py-10 text-center text-gray-500">
          <div className="flex flex-col items-center justify-center">
            <img
              src={notFoundBooking} // ganti dengan link ilustrasi lain jika perlu
              alt="No Bookings"
              className="w-60 h-60 mb-4"
            />
            <p className="text-lg font-semibold">Belum ada booking untuk hari ini</p>
          </div>
        </td>
      </tr>
    ) : (
      [...Bookings]
        .filter((booking) =>
          ["booked", "done", "isPending"].includes(booking.status)
        )
        .sort((a, b) => {
          const dateA = new Date(`${a.booking_date}T${a.booking_time}`);
          const dateB = new Date(`${b.booking_date}T${b.booking_time}`);
          return dateB - dateA;
        })
        .map((booking, index) => (
          <tr key={booking.id} className="hover:bg-gray-50">
<td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{booking.cust_name}</td>
                    <td className="px-6 py-4">{booking.cust_phone_number}</td>
                    <td className="px-6 py-4">
                      {format(parseISO(booking.booking_date), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {format(parseISO(`${booking.booking_time}`), "HH:mm")} WIB
                    </td>

                    <td className="px-6 py-4">
                      {booking.services?.name} (Rp{" "}
                      {Math.floor(booking.services?.price / 1000)}K)
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "done"
                            ? "bg-green-100 text-green-600"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : booking.status === "booked"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full"
                        onClick={() => handleMarkAsDone(booking.id)}
                      >
                        Done
                      </button>
                    </td>          </tr>
        ))
    )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
