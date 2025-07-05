import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, Spinner, Alert, Button } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import bgBooking from "../../assets/bg-booking6.JPG";
import { getDetailBookings } from "../../service/bookings";
import { getUrlPayment } from "../../service/payments";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Protected from "../../components/Auth/Protected";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/payments/$id")({
  component: PaymentsRoute
});

function PaymentsRoute() {
  const { id } = Route.useParams();
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "admin";

  const navigate = useNavigate();

  const snapBoxRef = useRef(null);
  const [snapReady, setSnapReady] = useState(false);
  const [infoMsg, setInfoMsg] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [snapEmbedded, setSnapEmbedded] = useState(false);

  const {
    data: booking,
    isPending: loadingBooking,
    isError: errBooking,
  } = useQuery({
    queryKey: ["booking-detail", id],
    queryFn: () => getDetailBookings(id),
    enabled: !!id,
  });

  const {
    data: payment,
    error: paymentErr,
    isPending: loadingPayment,
  } = useQuery({
    queryKey: ["payment-token", id],
    queryFn: () => getUrlPayment(id),
    enabled: !!id,
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    if (paymentErr) setInfoMsg(paymentErr.message);
  }, [paymentErr]);

  useEffect(() => {
    if (window.snap) {
      setSnapReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    s.id = "midtrans-script";
    s.dataset.clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    s.onload = () => setSnapReady(true);
    s.onerror = () =>
      setInfoMsg("Gagal memuat modul pembayaran, silakan muat ulang halaman.");
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    // Reset embed state saat ID berubah
    setSnapEmbedded(false);
  }, [id]);

  useEffect(() => {
    if (!booking && !loadingBooking) {
      navigate({ to: "/" });
      return;
    }
  }, [booking, loadingBooking, user, navigate]);

  useEffect(() => {
    if (
      snapReady &&
      payment?.snap_token &&
      snapBoxRef.current &&
      window?.snap &&
      typeof window.snap.embed === "function" &&
      !snapEmbedded
    ) {
      // Bersihkan container Snap
      snapBoxRef.current.innerHTML = "";

      if (typeof window.snap.close === "function") {
        window.snap.close();
      }

      setTimeout(() => {
        window.snap.embed(payment.snap_token, {
          embedId: "midtrans-container",
          onSuccess: () => {
            toast.success(`Payment successful! Your booking code is: ${booking.booking_code}`);
            navigate({ to: "/history-bookings" });
            setSnapEmbedded(false);
          },
          onPending: () => {
            toast.info(`Payment is pending. Your booking code is: ${booking.booking_code}`);
            navigate({ to: "/history-bookings" });
            setSnapEmbedded(false);
          },
          onError: (err) => {
            console.error("Snap error", err);
            navigate({ to: "/" });
            setSnapEmbedded(false);
          },
          onClose: () => {
            navigate({ to: "/" });
            setSnapEmbedded(false);
          },
        });
        setSnapEmbedded(true);
      }, 1000);
    }
  }, [snapReady, payment, snapEmbedded, navigate]);

  // Cleanup Snap saat komponen unmount
  useEffect(() => {
    return () => {
      if (window.snap?.hide) window.snap.hide();
      setSnapEmbedded(false);
    };
  }, []);

  useEffect(() => {
    if (!payment?.expired_time) return;

    const targetTime = new Date(payment.expired_time).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("Waktu habis");
        setInfoMsg("Waktu pembayaran telah kadaluarsa.");
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [payment]);

  const loading = loadingBooking || loadingPayment;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat ${isAdmin ? "pt-5" : "pt-20"}`}
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      {loading && (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" />
        </div>
      )}

      {errBooking && (
        <Alert color="failure" rounded className="max-w-lg mx-auto mt-10">
          Gagal memuat booking.
        </Alert>
      )}

      {infoMsg && (
        <Alert color="warning" rounded className="max-w-lg mx-auto mt-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-center">{infoMsg}</span>
            {infoMsg.toLowerCase().includes("kadaluarsa") && (
              <Button
                size="sm"
                color="dark"
                onClick={() =>
                  isAdmin
                    ? navigate({ to: "/admin/bookings" })
                    : navigate({ to: "/create-booking" })
                }
              >
                Buat Ulang Booking
              </Button>
            )}
          </div>
        </Alert>
      )}

      {countdown && (
        <Alert
          color="warning"
          className="text-center text-white font-semibold text-lg flex flex-row justify-center"
        >
          Sisa Waktu Pembayaran:{" "}
          <span className="bg-opacity-40 px-3 py-1 rounded">{countdown}</span>
        </Alert>
      )}

      {booking && payment && !infoMsg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-7 items-start">
          {/* SNAP */}
          <div className="w-full h-[700px] bg-white rounded-xl shadow p-4 order-2 md:order-1">
            <h2 className="text-xl font-semibold text-center mb-4">
              Payment Method
            </h2>

            <div
              id="midtrans-container"
              ref={snapBoxRef}
              className="w-full justify-self-center"
            />
          </div>

          {/* DETAIL */}
          <Card className="!bg-white/95 border border-gray-300 order-1 md:order-2">
            <h2 className="text-xl font-semibold text-center">
              Detail Booking
            </h2>
            <h2 className="text-xl font-bold text-center mb-4" >{booking.booking_code}</h2>
            <Info label="Customer" value={booking.cust_name} />
            <Info label="Email" value={booking.cust_email} />
            <Info label="Telepon" value={booking.cust_phone_number} />
            <Info label="Barber" value={booking.barbers?.name} />
            <Info label="Layanan" value={booking.services?.name} />
            <Info
              label="Harga"
              value={`Rp ${booking.services?.price.toLocaleString("id-ID")}`}
            />
            <Info
              label="Tanggal"
              value={format(new Date(booking.booking_date), "dd MMMM yyyy")}
            />
            <Info
              label="Jam"
              value={
                booking?.booking_time
                  ? format(new Date(booking.booking_time), "HH:mm")
                  : "-"
              }
            />
            <p className="text-xs italic text-red-500">
              Jika pembayaran tidak muncul, silakan refresh halaman
            </p>
          </Card>
        </div>
      )}

      <footer className="w-full text-center py-3 bg-black bg-opacity-50 text-white mt-36">
        &copy; {new Date().getFullYear()} Mantra Barber. All rights reserved.
      </footer>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1 text-sm">
      <span className="font-medium">{label}</span>
      <span className="col-span-2 break-words">: {value ?? "-"}</span>
    </div>
  );
}
