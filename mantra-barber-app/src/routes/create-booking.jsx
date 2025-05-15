import { createFileRoute } from "@tanstack/react-router";
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
import { useEffect, useState } from "react";
import serviceImage from "../assets/aboutUs.png";

// Contoh user store. Ganti sesuai implementasi kamu (misalnya dari Zustand, Context, Redux, dsb)
const useUserStore = () => {
  return {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "08123456789",
  };
};

const barbers = [
  { name: "Yazid", image: serviceImage },
  { name: "Rizki", image: serviceImage },
  { name: "Aloy", image: serviceImage },
];

const services = [
  { name: "Haircut" },
  { name: "Shave" },
  { name: "Hair Color" },
];

export const Route = createFileRoute("/create-booking")({
  component: CreateBooking,
});

function CreateBooking() {
  const user = useUserStore();
  const [agree, setAgree] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [barber, setBarber] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [step, setStep] = useState(1);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

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
    let endHour = 22;

    if (day === 0 || day === 5 || day === 6) {
      startHour = 10;
      endHour = 21;
    }

    const times = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeStr = hour.toString().padStart(2, "0") + ":00";
      times.push(timeStr);
    }

    setAvailableTimes(times);
    setTime("");
  }, [date]);

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

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat pt-24"
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col items-center px-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
          {step === 1 ? (
            "Choose Your Barber"
          ) : step === 2 ? (
            `Choose Your Service for ${barber}`
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
            barbers.map((b) => (
              <Card
                key={b.name}
                className="max-w-sm !bg-white border-3 !border-gray-400"
              >
                <div className="h-30 sm:h-45 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h5 className="text-xl font-bold tracking-tight text-center text-gray-900">
                  {b.name}
                </h5>
                <Button
                  color="dark"
                  outline
                  onClick={() => {
                    setBarber(b.name);
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
                key={s.name}
                className="max-w-sm !bg-white border-3 !border-gray-400"
              >
                <h5 className="text-xl font-bold tracking-tight text-center text-gray-900 py-6">
                  {s.name}
                </h5>
                <Button
                  color="dark"
                  outline
                  onClick={() => {
                    setService(s.name);
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
                      {availableTimes.map((t) => (
                        <option
                          key={t}
                          value={t}
                          className={
                            t === "13:00"
                              ? "text-gray-400 bg-gray-700"
                              : "text-white bg-gray-700"
                          }
                          disabled={t === "13:00"}
                        >
                          {t}
                        </option>
                      ))}
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
                <p className="col-span-2 ">: {barber}</p>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <p className="font-semibold">Layanan</p>
                <p className="col-span-2 ">: {service}</p>

                <p className="font-semibold">Tanggal</p>
                <p className="col-span-2 ">: {date}</p>

                <p className="font-semibold">Jam</p>
                <p className="col-span-2 ">: {time}</p>

                <p className="font-semibold">Jam</p>
                <p className="col-span-2 ">: {time}</p>
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
                onClick={() => {
                  const bookingData = {
                    name,
                    email,
                    phone,
                    barber,
                    service,
                    date,
                    time,
                  };
                  console.log("Booking Submitted:", bookingData);
                  alert(
                    `Booking berhasil:\n${JSON.stringify(bookingData, null, 2)}`
                  );
                  setStep(1);
                  setBarber("");
                  setService("");
                  setDate("");
                  setTime("");
                  setAgree(false);
                }}
                disabled={!agree}
              >
                Submit Booking
              </Button>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <ModalHeader>Syarat & Ketentuan</ModalHeader>
              <ModalBody className="text-white">
                <div className="space-y-3 text-sm">
                  <p>
                    Dengan melakukan booking, Anda menyetujui bahwa Anda akan
                    datang tepat waktu sesuai dengan jadwal yang dipilih.
                  </p>
                  <p>
                    Pembatalan dapat dilakukan maksimal 2 jam sebelum jadwal
                    booking. Setelah itu, tidak ada refund atau penjadwalan
                    ulang.
                  </p>
                  <p>
                    Harap mengikuti protokol kesehatan dan menjaga ketertiban
                    selama berada di barbershop.
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
