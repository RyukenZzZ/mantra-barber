import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  Datepicker,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  TextInput,
} from "flowbite-react";
import bgBooking from "../assets/bg-booking3.jpg";
import { useMutation, useQuery } from "@tanstack/react-query"; // pastikan sudah terpasang
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getBookings } from "../service/bookings";
import { getServices } from "../service/services";
import { getBarbers } from "../service/barbers";
import { createBooking } from "../service/bookings";
import { toast } from "react-toastify";

export const Route = createFileRoute("/create-booking")({
  component: CreateBooking,
});

function CreateBooking() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [agree, setAgree] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [barberName, setBarberName] = useState("");
  const [barberId, setBarberId] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [step, setStep] = useState(1);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const { data: services = [] } = useQuery({
    queryKey: ["getServices"],
    queryFn: getServices,
    enabled: !!token,
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ["getBarbers"],
    queryFn: getBarbers,
    enabled: !!token,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["getBookings"],
    queryFn: getBookings,
    enabled: !!token,
  });

  const unavailableTimes = useMemo(() => {
    if (!barberId || !date) return [];

    return bookings
      .filter(
        (bk) =>
          bk.barber_id === barberId &&
          ["booked", "done", "isPending"].includes(bk.status) &&
          // cocokan TANGGAL lokal (yyyy-MM-dd)
          new Date(bk.booking_date).toLocaleDateString("sv-SE") === date
      )
      .map((bk) => {
        const d = new Date(bk.booking_time); // ← sudah jadi waktu lokal
        const hh = d.getHours().toString().padStart(2, "0");
        const mm = d.getMinutes().toString().padStart(2, "0");
        return `${hh}:${mm}`; // contoh "20:00"
      });
  }, [bookings, barberId, date]);

  const { mutate: create, isPending } = useMutation({
    mutationFn: (request) => createBooking(request),
    onSuccess: (response) => {
      toast.success("Bookings Created Successfully!");

      // Reset state
      setStep(1);
      setBarberName("");
      setBarberId("");
      setServiceId("");
      setServiceName("");
      setPrice("");
      setDate("");
      setTime("");
      setAgree(false);

      // Ambil payment ID dari response
      const bookingId = response?.data?.payment?.booking_id;
      if (bookingId) {
        navigate({ to: `/payments/${bookingId}` });
      } else {
        // fallback jika payment.id tidak ditemukan
        navigate({ to: "/my-bookings" });
      }
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (!date) {
      setAvailableTimes([]);
      setTime("");
      return;
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) return;

    const day = selectedDate.getDay();
    let startHour = 11;
    let endHour = 21;

    if (day === 0 || day === 5 || day === 6) {
      startHour = 10;
      endHour = 20;
    }

    const times = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeStr = hour.toString().padStart(2, "0") + ":00";
      times.push(timeStr);
    }

    setAvailableTimes(times);
    setTime("");
  }, [date]);

  useEffect(() => {
    setTime("");
  }, [date, barberId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(4); // Lanjut ke halaman konfirmasi
  };

  const handleNext = (event) => {
    if (event) event.preventDefault();

    if (step === 3) {
      if (!name) {
        alert("Nama lengkap wajib diisi.");
        return;
      }
      if (!email) {
        alert("Email wajib diisi.");
        return;
      }
      if (!phone) {
        alert("Nomor telepon wajib diisi.");
        return;
      }
      if (!date) {
        alert("Tanggal booking wajib dipilih.");
        return;
      }
      if (!time) {
        alert("Jam booking wajib dipilih.");
        return;
      }
    }

    setStep(step + 1);
  };

  const onSubmit = () => {
    const bookingDateTime = new Date(`${date}T${time}:00`).toISOString();

    const bookingData = {
      barber_id: barberId,
      service_id: serviceId,
      booking_date: bookingDateTime,
      booking_time: bookingDateTime,
      cust_name: name,
      cust_phone_number: phone,
      cust_email: email,
    };

    console.log("Booking Submitted:", bookingData);

    create(bookingData);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat pt-24"
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col items-center px-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 text-white mb-4">
          {step === 1 ? (
            "Choose Your Barber"
          ) : step === 2 ? (
            `Choose Your Service for ${barberName}`
          ) : step === 3 ? (
            <>
              User Confirmation &<br />
              Select Booking Time
            </>
          ) : (
            "Booking Confirmation"
          )}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {step === 1 &&
            barbers
              .filter((b) => b.is_active) // hanya tampilkan service yang is_active === true
              .map((b) => (
                <Card
                  key={b.id}
                  className="max-w-sm !bg-white border-3 !border-gray-400"
                >
                  <div className="h-30 sm:h-40 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={
                        !b.photo_url ||
                        b.photo_url === "null" ||
                        b.photo_url === null
                          ? "https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg"
                          : b.photo_url
                      }
                      alt={b.name}
                      referrerPolicy="no-referrer"
                      className="w-35 h-35 object-cover"
                    />
                  </div>
                  <h5 className="text-xl font-bold tracking-tight text-center text-gray-900">
                    {b.name}
                  </h5>
                  <Button
                    color="dark"
                    outline
                    onClick={() => {
                      setBarberName(b.name);
                      setBarberId(b.id);
                      setStep(2);
                    }}
                  >
                    Pilih
                  </Button>
                </Card>
              ))}

          {step === 2 &&
            services.map((s) => (
              <Card
                key={s.id}
                className="max-w-sm !bg-white border-3 !border-gray-400"
              >
                <div className="flex flex-row items-center justify-center text-gray-900 py-6">
                  <h5 className="text-lg font-bold tracking-tight text-center">
                    {s.name}
                  </h5>

                  <p className="text-xl font-bold ms-2">
                    (Rp.{Math.floor(s.price / 1000)}K)
                  </p>
                </div>
                <Button
                  color="dark"
                  outline
                  onClick={() => {
                    setServiceName(s.name);
                    setServiceId(s.id);
                    setPrice(s.price);
                    setStep(3);
                  }}
                >
                  Pilih
                </Button>
              </Card>
            ))}
        </div>

        {step === 2 && (
          <Button
            color="gray"
            onClick={() => setStep(step - 1)}
            className="mb-10"
          >
            &larr; Back
          </Button>
        )}

        {step === 3 && (
          <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-black bg-opacity-60 p-6 rounded-lg text-white mb-10 border-gray-600 border-2">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Order Information
            </h2>

            {/* Grid untuk Form User */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 sm:gap-4">
              <div className="mb-4">
                <label className="block mb-1">Nama:</label>
                <TextInput
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  shadow
                  color="gray"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <TextInput
                  type="email"
                  placeholder="Alamat email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  shadow
                  color="gray"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">No. Telepon:</label>
                <TextInput
                  type="tel"
                  placeholder="0812xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  shadow
                  color="gray"
                />
              </div>
            </div>

            <div className="mb-4 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center">
                {/* Datepicker */}
                <div className="w-1/2 justify-items-center">
                  <Datepicker
                    inline
                    showClearButton={false}
                    minDate={new Date()}
                    value={date ? new Date(date) : undefined}
                    onChange={(selectedDate) => {
                      if (selectedDate) {
                        selectedDate.setHours(12, 0, 0, 0);
                        const formattedDate = selectedDate
                          .toISOString()
                          .split("T")[0];
                        setDate(formattedDate);
                      }
                    }}
                  />
                </div>

                {/* Jam */}
                {availableTimes.length > 0 && (
                  <div className="w-full">
                    <label
                      htmlFor="time"
                      className="text-sm font-medium text-white"
                    >
                      Pilih Jam
                    </label>
                    <select
                      id="time"
                      className="block w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    >
                      <option
                        value=""
                        disabled
                        className="bg-gray-700 text-white"
                      >
                        -- Pilih Jam --
                      </option>
                      {availableTimes.map((t) => {
                        const isBooked = unavailableTimes.includes(t);

                        // Waktu sekarang + 1 jam
                        const now = new Date();
                        const oneHourLater = new Date(
                          now.getTime() + 60 * 45 * 1000 //unavaible 45 mnt jam berikutnya
                        );

                        // Buat waktu jam pilihan pada tanggal yg dipilih
                        const [hourStr, minuteStr] = t.split(":");
                        const selectedDateTime = new Date(date);
                        selectedDateTime.setHours(
                          parseInt(hourStr, 10),
                          parseInt(minuteStr, 10),
                          0,
                          0
                        );

                        // Disable jika sudah booked atau waktu sudah lewat sekarang + 1 jam
                        const isDisabled =
                          isBooked || selectedDateTime <= oneHourLater;

                        return (
                          <option
                            key={t}
                            value={t}
                            disabled={isDisabled}
                            className={
                              isDisabled
                                ? "text-gray-400 bg-gray-700"
                                : "text-white bg-gray-700"
                            }
                          >
                            {t} {isBooked && "(booked)"}
                            {selectedDateTime <= oneHourLater &&
                              !isBooked &&
                              " (not available)"}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <Button
              color="gray"
              onClick={() => setStep(step - 1)}
              className="w-full mb-2"
            >
              &larr; Back
            </Button>

            <Button
              color="dark"
              className="w-full mt-2"
              type="button"
              onClick={handleNext}
            >
              Confirm Booking
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="w-full max-w-md sm:max-w-xl bg-white bg-opacity-60 p-6 rounded-lg text-black mb-10">
            <h2 className="text-xl font-semibold mb-7 text-center">
              Booking Confirmation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 mb-4 text-sm">
              <div className="grid grid-cols-3 col-span-2 gap-1">
                <p className="font-semibold">Nama</p>
                <p className="col-span-2 ">: {name}</p>

                <p className="font-semibold">Email</p>
                <p className="col-span-2 ">: {email}</p>

                <p className="font-semibold">No. Telepon</p>
                <p className="col-span-2 ">: {phone}</p>

                <p className="font-semibold">Barber</p>
                <p className="col-span-2 ">: {barberName}</p>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <p className="font-semibold">Layanan</p>
                <p className="col-span-2 ">: {serviceName}</p>

                <p className="font-semibold">Tanggal</p>
                <p className="col-span-2 ">: {date}</p>

                <p className="font-semibold">Jam</p>
                <p className="col-span-2 ">: {time}</p>

                <p className="font-semibold">Price</p>
                <p className="col-span-2">: {Math.floor(price / 1000)}k</p>
              </div>
            </div>

            <div className="flex justify-center mb-5 mt-5">
              <fieldset className="flex items-center gap-2 text-center">
                <Radio
                  id="agree"
                  name="terms"
                  checked={agree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgree(checked);
                    setOpenModal(true);
                  }}
                />
                <p className="text-md">
                  Saya menyetujui{" "}
                  <button
                    type="button"
                    onClick={() => setOpenModal(true)}
                    className="text-blue-600 hover:underline"
                  >
                    syarat & ketentuan layanan
                  </button>
                  .
                </p>
              </fieldset>
            </div>

            <div className="grid grid-cols-2 gap-2 ">
              <Button
                color="gray"
                onClick={() => setStep(3)}
                className="w-2/3 mb-2 justify-self-end "
              >
                &larr; Back
              </Button>

              <Button
                color="dark"
                className="w-2/3"
                onClick={onSubmit}
                disabled={!agree || isPending}
              >
                {isPending ? "Processing..." : "Submit Booking"}
              </Button>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <ModalHeader>Syarat & Ketentuan</ModalHeader>
              <ModalBody className="text-white">
                <div className="space-y-3 text-sm">
                  <p>
                    Setelah menekan <strong>Submit Booking</strong>, Anda akan
                    dialihkan ke halaman pembayaran. Tautan pembayaran berlaku
                    <strong> maksimal 20 menit</strong>; lewat dari itu booking
                    dibatalkan otomatis.
                  </p>

                  <p>
                    Pembayaran dapat dilakukan dengan <strong>DP 50 %</strong>{" "}
                    dari total harga layanan. Sisa pembayaran dilunasi setelah
                    layanan selesai.
                  </p>

                  <p>
                    Ingin reschedule? Silakan hubungi admin melalui nomor yang
                    tertera di halaman utama{" "}
                    <strong>paling lambat 2 jam</strong> sebelum jadwal booking.
                  </p>

                  <p>
                    <strong>Pembatalan sepihak tidak diperkenankan.</strong>{" "}
                    Jika booking dibatalkan, seluruh pembayaran yang sudah masuk
                    dianggap hangus.
                  </p>

                  <p>
                    Mohon datang tepat waktu dan tetap mematuhi protokol
                    kebersihan selama berada di barbershop Terima Kasih.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="dark" onClick={() => setOpenModal(false)}>
                  Saya Mengerti
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        )}
      </form>

      <footer className="w-full text-center py-3 bg-black bg-opacity-50 text-white mt-35">
        &copy; {new Date().getFullYear()} Mantra Barber. All rights reserved.
      </footer>
    </div>
  );
}
