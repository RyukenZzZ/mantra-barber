import { createFileRoute, Link } from "@tanstack/react-router";
import bgBooking from "../../assets/bg-booking3.jpg";
import { cancelBooking, getMyBookings } from "../../service/bookings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Alert, Button,Spinner } from "flowbite-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Protected from "../../components/Auth/Protected";

export const Route = createFileRoute("/admin/my-bookings")({
    component: () => (
        <Protected roles={["admin"]}>
            <MyBookingAdminComponent />
        </Protected>
    ),
});
function MyBookingAdminComponent() {
  const { token } = useSelector((state) => state.auth);

  const { data: myBookings = [], isLoading } = useQuery({
    queryKey: ["getMyBookings"],
    queryFn: getMyBookings,
    enabled: !!token,
  });

  const queryClient = useQueryClient();

  const { mutate: handleCancelBooking, isPending } = useMutation({
    mutationFn: (id) => cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking berhasil dibatalkan");
      queryClient.invalidateQueries({ queryKey: ["getMyBookings"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCancel = async (bookingId) => {
    const confirm = await Swal.fire({
      title: "Batalkan Booking?",
      text: "❗Uang DP yang telah dibayarkan akan hangus. ❗",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Tidak",
    });

    if (!confirm.isConfirmed) return;
    handleCancelBooking(bookingId);
  };

  const handleReschedule = () => {
    Swal.fire({
      title: "Ingin Melakukan Reschedule?",
      html: `
      <p>Silakan hubungi admin untuk melakukan reschedule, kirimnkan booking Code dan Nama !</p>
      <p class="mt-2 text-red-600 font-semibold">⚠️ Reschedule hanya dapat dilakukan sekali! ⚠️</p>
    `,
      icon: "info",
      confirmButtonText: "Hubungi Admin",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Tutup",
    }).then((result) => {
      if (result.isConfirmed) {
        // Arahkan ke WhatsApp admin atau tampilkan email/telepon
        window.open("https://wa.me/6287878299029", "_blank"); // ganti dengan nomor admin
      }
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat pt-2"
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <div className="max-w-4xl mx-auto p-4 grid gap-6">
        <h2 className="text-2xl font-bold text-center text-white mb-4">
          History Bookings
        </h2>

{isLoading && (
  <div className="flex flex-col items-center gap-2 text-white">
    <Spinner color="info" />
    <p>Memuat data...</p>
  </div>
)}
        {myBookings.length === 0 && !isLoading && (
          <Alert color="warning" className="text-center w-full text-white">
            Kamu belum melakukan Booking sama sekali.
            <Button
              as={Link}
              to="/create-booking"
              color="dark"
              className="mt-4"
            >
              Booking Now
            </Button>
          </Alert>
        )}

        {[...myBookings]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((booking) => {
            const name = booking.cust_name;
            const email = booking.cust_email;
            const phone = booking.cust_phone_number;
            const barberName = booking.barbers?.name;
            const serviceName = booking.services?.name;
            const price = booking.services?.price;

            const pendingStatus = booking.status === "isPending";
            const isInactive =
              booking.status === "cancelled" || booking.status === "expired";
            const formattedDate = booking.booking_date
              ? format(new Date(booking.booking_date), "dd MMMM yyyy")
              : "-";

            const formattedTime = booking.booking_time
              ? format(new Date(booking.booking_time), "HH:mm")
              : "-";

            return (
              <div
                key={booking.id}
                className="relative w-full max-w-md sm:max-w-xl bg-white bg-opacity-60 p-6 rounded-lg text-black mb-10"
              >
                {/* BADGE STATUS */}
                <span
                  className={`
          absolute top-5 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white
          ${
            isInactive
              ? "bg-red-600"
              : isPending
                ? "bg-gray-500"
                : booking.status === "booked"
                  ? "bg-blue-500"
                  : booking.status === "done"
                    ? "bg-green-500"
                    : "bg-black"
          }
        `}
                >
                  {booking.status}
                </span>

                <h2 className="text-xl font-semibold mb-7 text-center">
                  {booking.booking_code}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 mb-4 text-sm">
                  <div className="grid grid-cols-3 col-span-2 gap-1">
                    <p className="font-semibold">Nama</p>
                    <p className="col-span-2">: {name}</p>

                    <p className="font-semibold">Email</p>
                    <p className="col-span-2">: {email}</p>

                    <p className="font-semibold">No. Telepon</p>
                    <p className="col-span-2">: {phone}</p>

                    <p className="font-semibold">Barber</p>
                    <p className="col-span-2">: {barberName}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <p className="font-semibold">Layanan</p>
                    <p className="col-span-2">: {serviceName}</p>

                    <p className="font-semibold">Tanggal</p>
                    <p className="col-span-2">: {formattedDate}</p>

                    <p className="font-semibold">Jam</p>
                    <p className="col-span-2">: {formattedTime}</p>

                    <p className="font-semibold">Price</p>
                    <p className="col-span-2">: {Math.floor(price / 1000)}k</p>
                  </div>
                </div>

                {!isInactive && (
                  <div className="grid grid-cols-2 gap-3 mt-10">
                    {/* Cancel (selalu ditampilkan jika tidak inactive) */}
                    <Button
                      onClick={() => handleCancel(booking.id)}
                      disabled={isPending || pendingStatus}
                      className={`w-2/3 justify-self-end
    ${
      pendingStatus || isPending
        ? "!bg-gray-300 !text-gray-500 cursor-not-allowed"
        : "!bg-red-600 !text-white !hover:bg-red-700"
    }`}
                    >
                      Cancel
                    </Button>

                    {/* Tombol kedua tergantung status */}
                    {pendingStatus ? (
                      <Button
                        as={Link}
                        to={`/payments/${booking.id}`}
                        color="dark"
                        className="w-2/3"
                      >
                        Lanjut&nbsp;Bayar
                      </Button>
                    ) : (
                      /* booked/done → Reschedule */
                      <Button
                        color="blue"
                        onClick={() => handleReschedule()}
                        className="w-2/3"
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <footer className="w-full text-center py-3 bg-black bg-opacity-50 text-white mt-36">
        &copy; {new Date().getFullYear()} Mantra Barber. All rights reserved.
      </footer>
    </div>
  );
}
