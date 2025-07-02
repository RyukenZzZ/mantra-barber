import { createFileRoute } from "@tanstack/react-router";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { cancelBooking, getBookings } from "../../service/bookings";
import { useEffect, useState } from "react";
import { format, parseISO, startOfDay, endOfDay, parse } from "date-fns";
import { id } from "date-fns/locale";
import NotFoundBookings from "../../assets/NotFoundBookings.png";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import BookingModal from "../../components/Modal/bookingModal";
import { getBarbers } from "../../service/barbers";
import { getServices } from "../../service/services";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Protected from "../../components/Auth/Protected";

export const Route = createFileRoute("/admin/bookings")({
    component: () => (
        <Protected roles={["admin"]}>
            <BookingsComponent />
        </Protected>
    ),
});

function BookingsComponent() {
  const queryClient = useQueryClient();
  const { token } = useSelector((s) => s.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [filterDates, setFilterDates] = useState(null); // { from: Date, to: Date }
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["getBookings", searchTerm],
    queryFn: () => getBookings(searchTerm),
    enabled: !!token,
  });

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

  const { mutate: handleCancelBooking, isPending } = useMutation({
    mutationFn: (id) => cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking berhasil dibatalkan");
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCancel = async (bookingId) => {
    const confirm = await Swal.fire({
      title: "Batalkan Booking?",
      text: "Apakah yakin ingin membatalkan booking ini?",
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

  const allowedStatus = ["booked", "done", "cancelled", "isPending"];

  // Filter bookings berdasarkan search dan range tanggal
  const filtered = bookings
    .filter((b) => {
      const bookingDate = parseISO(b.booking_date);
      const matchesSearch =
        b.cust_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.booking_code?.toLowerCase().includes(searchTerm.toLowerCase());

      const inDateRange =
        !filterDates ||
        (bookingDate >= startOfDay(filterDates.from) &&
          bookingDate <= endOfDay(filterDates.to));

      const isAllowedStatus = allowedStatus.includes(b.status);

      return matchesSearch && inDateRange && isAllowedStatus;
    })
    .sort((a, b) => {
      // Format date and time correctly
      const dateStrA = format(parseISO(a.booking_date), "yyyy-MM-dd");
      const timeStrA = a.booking_time
        ? format(parseISO(a.booking_time), "HH:mm")
        : "00:00";

      const dateStrB = format(parseISO(b.booking_date), "yyyy-MM-dd");
      const timeStrB = b.booking_time
        ? format(parseISO(b.booking_time), "HH:mm")
        : "00:00";
      const statusOrder = ["booked", "done", "cancelled", "isPending"];

      const dateTimeA = parse(
        `${dateStrA} ${timeStrA}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const dateTimeB = parse(
        `${dateStrB} ${timeStrB}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );

      // Urutkan berdasarkan waktu
      const dateCompare = dateTimeA - dateTimeB;
      if (dateCompare !== 0) return dateCompare;

      // Urutkan berdasarkan status jika waktu sama
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });

  useEffect(() => {
    if (!openModal) {
      setEditMode(false);
      setEditData(null);
    }
  }, [openModal]);

  return (
    <div className="px-6 py-6 bg-white rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Center</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setOpenModal(true)}
        >
          <FaPlus />
          Tambah Booking
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative">
          <button
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            Pilih Tanggal
          </button>

          {showPicker && (
            <div className="absolute z-50 bg-white p-4 shadow-md rounded-md mt-2 max-w-sm">
              <DayPicker
                mode="range"
                selected={filterDates || undefined}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setFilterDates(range);
                  }
                }}
                locale={id}
                footer={
                  filterDates?.from && filterDates?.to ? (
                    <p className="text-center text-sm mt-2">
                      Dipilih dari{" "}
                      <b>
                        {format(filterDates.from, "dd MMM yyyy", {
                          locale: id,
                        })}
                      </b>{" "}
                      sampai{" "}
                      <b>
                        {format(filterDates.to, "dd MMM yyyy", { locale: id })}
                      </b>
                    </p>
                  ) : (
                    <p className="text-center text-sm mt-2">
                      Pilih rentang tanggal
                    </p>
                  )
                }
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 !text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    // Kalau dari dan to ada, apply filter & tutup picker
                    if (filterDates?.from && filterDates?.to) {
                      setShowPicker(false);
                    }
                  }}
                  disabled={!filterDates?.from || !filterDates?.to}
                >
                  Terapkan Filter
                </button>
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setFilterDates(null);
                    setShowPicker(false);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Cari nama atau kode booking..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filterDates && filterDates.from && filterDates.to && (
        <p className="text-sm text-gray-500 mb-4">
          Filter: {format(filterDates.from, "dd MMM yyyy", { locale: id })} -{" "}
          {format(filterDates.to, "dd MMM yyyy", { locale: id })}
        </p>
      )}

      <div className="bg-white shadow-md border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src={NotFoundBookings}
              alt="No Bookings"
              className="w-60 h-60 mb-4"
            />
            <p className="text-lg font-semibold">Belum ada booking</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100 text-center text-sm text-gray-700">
              <tr>
                {[
                  "No",
                  "Nama",
                  "No Telp",
                  "Tanggal",
                  "Jam",
                  "Service (Harga)",
                  "Barbers",
                  "Kode",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-center text-sm">
              {filtered.map((b, i) => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{b.cust_name}</td>
                  <td className="px-4 py-3">{b.cust_phone_number}</td>
                  <td className="px-4 py-3">
                    {format(parseISO(b.booking_date), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {format(parseISO(b.booking_time || "00:00"), "HH:mm")} WIB
                  </td>
                  <td className="px-4 py-3">
                    {b.services?.name} <br />
                    <span className="text-gray-500 text-xs">
                      (Rp {Math.floor(b.services?.price / 1000)}K)
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.barbers.name}</td>
                  <td className="px-4 py-3 font-mono">{b.booking_code}</td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        b.status === "done"
                          ? "bg-green-100 text-green-700"
                          : b.status === "isPending"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 text-xl"
                        onClick={() => {
                          setEditMode(true);
                          setEditData(b); // b adalah data booking yang sedang diiterasi
                          setOpenModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="text-red-500 hover:text-red-700 text-xl"
                        onClick={() => handleCancel(b.id)}
                        disabled={isPending}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <BookingModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        barbers={barbers}
        services={services}
        bookings={bookings}
        editMode={editMode}
        initialData={editData}
      />
    </div>
  );
}
