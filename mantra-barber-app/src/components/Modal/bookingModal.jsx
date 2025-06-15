import { useEffect, useMemo, useState } from "react";
import mantraLogo from "../../assets/mantraLogo.png";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking, updateBookingById } from "../../service/bookings";
import { useSelector } from "react-redux";
import { Datepicker } from "flowbite-react";

const BookingModal = ({
  openModal,
  setOpenModal,
  barbers,
  services,
  bookings,
  editMode = false,
  initialData = null,
}) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  
  const [pendingTimeStr, setPendingTimeStr] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  const resetFormState = () => {
  setSelectedBarberId("");
  setSelectedServiceId("");
  setDate("");
  setTime("");
  setPendingTimeStr("");
};

  const unavailableTimes = useMemo(() => {
    if (!selectedBarberId || !date) return [];

    return bookings
      .filter(
        (bk) =>
          bk.barber_id === selectedBarberId &&
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
  }, [bookings, selectedBarberId, date]);

  const { mutate: create, isPending } = useMutation({
    mutationFn: (request) => createBooking(request),
    onSuccess: (response) => {
      toast.success("Bookings Created Successfully!");

      // Reset state
      resetFormState();
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });


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

  const { mutate: updateBooking, isPending: isUpdating } = useMutation({
    mutationFn: (data) => updateBookingById(initialData.id, data), // Buat endpoint ini
    onSuccess: () => {
      toast.success("Booking berhasil diperbarui!");
      setOpenModal(false);
          resetFormState()
            queryClient.invalidateQueries({ queryKey: ["getBookings"] });

    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // Isi data saat edit
useEffect(() => {
  if (editMode && initialData) {
    // 1. Set barber dan service
    setSelectedBarberId(initialData.barber_id || "");
    setSelectedServiceId(initialData.service_id || "");

    // 2. Format tanggal dan set date (triggers availableTimes generator)
    const dateOnly = new Date(initialData.booking_date);
    const formattedDate = dateOnly.toISOString().split("T")[0];
    setDate(formattedDate);

    // 3. Simpan sementara time string (akan di-set setelah availableTimes siap)
    if (initialData.booking_time) {
      const time = new Date(initialData.booking_time);
      const hh = time.getHours().toString().padStart(2, "0");
      const mm = time.getMinutes().toString().padStart(2, "0");
      const timeStr = `${hh}:${mm}`;
      setPendingTimeStr(timeStr);
    }
  }
}, [editMode, initialData]);

// Setelah availableTimes siap, baru setTime
useEffect(() => {
  if (editMode && pendingTimeStr && availableTimes.length > 0) {
    if (availableTimes.includes(pendingTimeStr)) {
      setTime(pendingTimeStr);
    }
    setPendingTimeStr(""); // Clear agar tidak diulang
  }
}, [availableTimes, pendingTimeStr, editMode]);


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
  }, [date, selectedBarberId]);



  const onSubmit = () => {
    const bookingDateTime = new Date(`${date}T${time}:00`).toISOString();

    const bookingData = {
      barber_id: selectedBarberId,
      service_id: selectedServiceId,
      booking_date: bookingDateTime,
      booking_time: bookingDateTime,
      cust_name: editMode && initialData ? initialData.cust_name : user.name,
      cust_phone_number:
        editMode && initialData ? initialData.cust_phone_number : user.phone,
      cust_email: editMode && initialData ? initialData.cust_email : user.email,
      source: "walk_in",
    };

    if (editMode) {
      updateBooking(bookingData);
    } else {
      create(bookingData);
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg my-8 max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <div className="flex flex-row gap-2 items-center">
            <img src={mantraLogo} className="h-12 w-15" alt="Mantra Logo" />
            <h2 className="text-xl font-semibold">
              {editMode ? "Edit Booking" : "Tambah Booking"}
            </h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={() => setOpenModal(false)}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Service
            </label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`mt-2 min-w-[140px] text-center px-5 py-2 rounded-full border text-md ${
                    selectedServiceId === service.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {service.name} ({service.price / 1000}K)
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Karyawan
            </label>
            <div className="flex flex-wrap gap-2">
             {barbers.map((barber) => {
  const isDisabled = !barber.is_active;

  return (
    <button
      key={barber.id}
      onClick={() => {
        if (!isDisabled) setSelectedBarberId(barber.id);
      }}
      disabled={isDisabled}
      className={`min-w-[140px] text-center px-4 py-1 rounded-full border text-md
        ${isDisabled
          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
          : selectedBarberId === barber.id
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {barber.name}{isDisabled && " (nonaktif)"}
    </button>
  );
})}

            </div>
          </div>
        </div>
        <div className="mb-4 mt-3 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center">
            <Datepicker
              inline
              showClearButton={false}
              minDate={new Date()}
              value={date ? new Date(date) : undefined}
              className="
    !bg-white text-black

    [&_.text-gray-900]:text-black
    [&_.bg-gray-100]:bg-white
    [&_.bg-white]:bg-white

    [&_.selected]:bg-blue-600 [&_.selected]:text-white
    [&_td:hover]:bg-gray-200
    [&_button.text-primary-600]:text-blue-600
    [&_button.text-primary-600:hover]:bg-blue-100

    [&_button]:text-black
    [&_button:hover]:bg-gray-200
    [&_thead]:bg-white
    [&_tfoot]:bg-white
  "
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

            {/* Jam */}
            {availableTimes.length > 0 && (
              <div className="w-full">
                <label
                  htmlFor="time"
                  className="text-sm font-medium text-black"
                >
                  Pilih Jam
                </label>
                <select
                  id="time"
                  className="block w-full rounded-md border border-gray-600 bg-white p-2.5 text-sm text-black focus:border-blue-500 focus:ring-blue-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="" disabled className="bg-white text-black">
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
                            ? "text-gray-400 bg-white"
                            : "text-black bg-white"
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

        {/* Modal Footer */}
        <div className="flex justify-center gap-2 mt-6 w-full max-w-md mx-auto">
          <button
            onClick={onSubmit}
            disabled={editMode ? isUpdating : isPending}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {editMode
              ? isUpdating
                ? "Memperbarui..."
                : "Update Booking"
              : isPending
                ? "Membuat..."
                : "Buat Booking"}
          </button>

          <button
  onClick={() => {
    resetFormState();
    setOpenModal(false);
  }}            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
