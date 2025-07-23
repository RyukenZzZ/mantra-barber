import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import bgBooking from "../assets/bgProfile.JPG";
import { cancelBooking, getMyBookings, getBookings } from "../service/bookings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Alert, Button, Spinner } from "flowbite-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/history-bookings")({
  component: MyBookingComponent,
});

function MyBookingComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const isGuest = !user;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

   // Ambil booking code terakhir dari localStorage jika user belum login
  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      const lastCode = localStorage.getItem("last_booking_code");
      if (lastCode) {
        setSearchTerm(lastCode);
        setSearchInput(lastCode);
      }
    }
  }, [token]);

    // Kosongkan localStorage jika user sudah login
  useEffect(() => {
    if (token) {
      localStorage.removeItem("last_booking_code");
    }
  }, [token]);

  const {
    data: bookings = [],
    isLoading: bookingLoading,
  } = useQuery({
    queryKey: ["getBookings", searchTerm],
    queryFn: () => getBookings(searchTerm),
    enabled: !!searchTerm, // ✅ aktifkan query getBookings untuk siapa pun jika searchTerm ada
  });

  const { data: myBookings = [], isLoading } = useQuery({
    queryKey: ["getMyBookings"],
    queryFn: getMyBookings,
    enabled: !!token,
  });

  const { mutate: handleCancelBooking, isPending } = useMutation({
    mutationFn: (id) => cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking berhasil dibatalkan");
      queryClient.invalidateQueries({ queryKey: ["getMyBookings"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
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

  const filteredBookings = bookings.filter(
    (b) => b.booking_code.toLowerCase() === searchTerm.toLowerCase()
  );

  const bookingsToShow =
    searchTerm.trim() !== "" ? filteredBookings : myBookings;

  const handleReschedule = (custName,bookingCode) => {
    Swal.fire({
      title: "Ingin Melakukan Reschedule?",
      html: `
        <p>Silakan hubungi admin untuk melakukan reschedule, kirimkan booking Code dan Nama!</p>
        <p class="mt-2 text-red-600 font-semibold">⚠️ Reschedule hanya dapat dilakukan sekali! ⚠️</p>
      `,
      icon: "info",
      confirmButtonText: "Hubungi Admin",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "Tutup",
  }).then((result) => {
    if (result.isConfirmed) {
      const message = `Halo Admin, saya ingin melakukan reschedule booking.\nNama: ${custName}\nBooking Code: ${bookingCode}\nMenjadi Tanggal(jam): `;
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/6287878299029?text=${encodedMessage}`;
      window.open(waUrl, "_blank");
    }
  });
};

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat ${
        isAdmin ? "" : "pt-24"
      }`}
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <div className="max-w-full mx-auto p-4 grid gap-3 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-black">
          History Bookings
        </h2>

        {/* Search bar */}
        <div className="bg-white bg-opacity-70 p-4 rounded-md shadow-lg mb-6">
          <p className="text-center mb-3 font-semibold text-black">
            Cari Booking Anda dengan Kode Booking
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <input
              autoFocus
              type="text"
              placeholder="Masukkan Booking Code"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = searchInput.trim();
                  const bookingCodeRegex = /^MB-[A-Z0-9]{6,}$/i;

                  if (bookingCodeRegex.test(trimmed)) {
                    setSearchTerm(trimmed);
                  } else {
                    toast.warn(
                      "Kode booking harus lengkap dan valid, contoh: MB-XXXXXX"
                    );
                  }
                }
              }}
              className="rounded-md px-4 py-2 w-full sm:w-[500px] border"
            />
            <Button
              color="dark"
              onClick={() => {
                setSearchTerm(searchInput.trim());
              }}
            >
              Cari
            </Button>
          </div>
        </div>

        {/* Spinner loading */}
        {(isLoading || bookingLoading) && (
          <div className="flex flex-col items-center gap-2 text-white">
            <Spinner color="info" />
            <p>Memuat data...</p>
          </div>
        )}

        {/* Alert tidak ditemukan */}
        {searchTerm &&
          !bookingLoading &&
          filteredBookings.length === 0 && (
            <Alert color="warning" className="text-center w-full text-white">
              Booking dengan kode <strong>{searchTerm}</strong> tidak ditemukan.
            </Alert>
          )}

        {/* Alert jika user belum pernah booking */}
        {myBookings.length === 0 && !isGuest && !searchTerm && !isLoading && (
          <Alert color="warning" className="text-center w-full text-white">
            Kamu belum melakukan Booking sama sekali.
            <Button
              as={Link}
              onClick={() =>
                isAdmin
                  ? navigate({ to: "/admin/bookings" })
                  : navigate({ to: "/create-booking" })
              }
              color="dark"
              className="mt-4"
            >
              Booking Now
            </Button>
          </Alert>
        )}

        {!searchTerm && myBookings.length > 0 && (
  <h3 className="text-xl font-bold text-black mb-2 text-center">
    Your Bookings
  </h3>
)}

        {/* Booking cards */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {bookingsToShow
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
                booking.status === "cancelled" ||
                booking.status === "expired" ||
                booking.status === "done";
              const formattedDate = booking.booking_date
                ? format(new Date(booking.booking_date), "dd MMMM yyyy")
                : "-";
              const formattedTime = booking.booking_time
                ? format(new Date(booking.booking_time), "HH:mm")
                : "-";

              return (
                <div key={booking.id} className="mx-auto">
                <div className="relative w-full h-[320px] max-w-md sm:max-w-xl border-2 border-gray-200 bg-white bg-opacity-60 p-6 rounded-lg text-black mb-10 flex flex-col justify-between">
                    <div>
                    {/* Status badge */}
                    <span
                      className={`
                        absolute top-5 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white
                        ${
                          booking.status === "cancelled" ||
                          booking.status === "expired"
                            ? "bg-red-600"
                            : pendingStatus
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

                    <h2 className="text-xl font-semibold text-center mb-7">
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
                        <p className="col-span-2">
                          : {Math.floor(price / 1000)}k
                        </p>
                      </div>
                    </div>
                    </div>

                    {/* Tombol aksi */}
                    {!isInactive && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleCancel(booking.id)}
                          disabled={isPending || pendingStatus}
                          className={`w-2/3 justify-self-end ${
                            pendingStatus || isPending
                              ? "!bg-gray-300 !text-gray-500 cursor-not-allowed"
                              : "!bg-red-600 !text-white !hover:bg-red-700"
                          }`}
                        >
                          Cancel
                        </Button>

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
                          <Button
                            color="blue"
                            onClick={() => handleReschedule(name,booking.booking_code)}
                            className="w-2/3"
                          >
                            Reschedule
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <footer className="w-full text-center py-3 bg-black bg-opacity-50 text-white mt-36">
        &copy; {new Date().getFullYear()} Mantra Barber. All rights reserved.
      </footer>
    </div>
  );
}