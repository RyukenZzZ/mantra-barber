import { createFileRoute } from "@tanstack/react-router";
import { Button, Card } from "flowbite-react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNamesPlugin from "embla-carousel-class-names";
import bgDashboard from "../assets/bgDashboard.jpg";
import mantraLogo from "../assets/mantraLogo.png";
import aboutUs from "../assets/aboutUs.png";
import galeri1 from "../assets/galeri1.jpg";
import galeri2 from "../assets/galeri2.jpg";
import galeri3 from "../assets/galeri3.jpg";
import galeri4 from "../assets/galeri4.jpg";
import bgServices from "../assets/bgServices.jpg";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { useEffect, useState, useCallback } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const images = [galeri1, galeri2, galeri3, galeri4, bgServices, bgDashboard];
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" }, [
    ClassNamesPlugin(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => embla && embla.scrollPrev();
  const scrollNext = () => embla && embla.scrollNext();

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section id="home" className="relative">
        <img
          src={bgDashboard}
          className="w-full h-[500px] object-cover"
          alt="Hero Barber"
        />

        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow max-w-sm w-[90%] text-sm text-center"> */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
          <p>📍 Jl. Radar Auri No. 6 Cimanggis, Depok</p>
          <p>📞 +62 878-7828-9019</p>
          <p>🕒 Mon-Thu: 10AM - 10PM | Fri-Sun: 10AM - 8PM</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center">About Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="text-gray-700">
            <p>
              Mantra Barbershop bukan sekadar tempat potong rambut — ini adalah
              ruang di mana gaya bertemu kenyamanan. Kami hadir untuk memberikan
              pengalaman grooming terbaik bagi pria modern yang menghargai
              detail, kebersihan, dan pelayanan premium. Dengan barbers
              profesional dan suasana yang cozy, kami memastikan setiap
              kunjungan adalah waktu berkualitas untuk merawat diri.
            </p>
            <p> ~ ✂️ Look Sharp, Feel Confident — hanya di Mantra.</p>
            <Button className="mt-4" color="dark">
              BOOK
            </Button>
          </div>
          <img
            src={aboutUs}
            alt="About Mantra"
            className="w-64 h-auto mx-auto"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-black text-white px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              Best Haircut
            </h5>
            <img
              src={aboutUs} // ganti dengan path gambar kamu
              alt="Best Haircut"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Rp.</span>
              <span className="text-5xl font-extrabold tracking-tight">65</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                K
              </span>
            </div>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  2 team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  20GB Cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Integration help
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
              Choose plan
            </button>
          </Card>
        </div>
      </section>

      {/* product Section */}
      <section id="product" className="px-6 py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">Product</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src={aboutUs} className="rounded w-full" alt="Gallery 1" />
          <img src={aboutUs} className="rounded w-full" alt="Gallery 2" />
          <img src={aboutUs} className="rounded w-full" alt="Gallery 3" />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-black text-white py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Gallery</h2>
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {images.map((src, i) => (
                  <div
                    className="embla__slide min-w-[70%] transition-all duration-300 ease-in-out px-2"
                    key={i}
                  >
                    <img
                      src={src}
                      className={`rounded-xl w-full h-[400px] object-cover ${
                        selectedIndex === i
                          ? "opacity-100 scale-100"
                          : "opacity-60 scale-95"
                      }`}
                      alt={`Slide ${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => embla && embla.scrollTo(i)}
                className={`w-3 h-3 rounded-full ${
                  selectedIndex === i
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white text-gray-700 px-6 py-7 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <img src={mantraLogo} className="h-20 mb-2" alt="Mantra Logo" />
            <p className="text-sm">
              WE MADE YOURSELF BOLD AND CLEAN AS FAST LIKE A MAGIC TOUCH
            </p>
            <p className="mt-4 text-sm mb-2 font-medium">
              Follow Our Social Media
            </p>
            <div className="flex gap-3 text-xl">
              <a
                href="https://www.instagram.com/mantra.barber/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="hover:text-pink-600 transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@mantrabarber?lang=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="hover:text-black transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="text-sm space-y-1">
              <li>Booking</li>
              <li>Review</li>
              <li>Gallery</li>
              <li>Product</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Contact</h4>

            <div className="flex gap-2 items-center">
              <HiLocationMarker className="text-xl " />
              <p className="text-sm">
                Jl. Radar Auri No. 6 RT 003/RW 006, Melatiarum, Cimanggis, Depok
              </p>
            </div>

            <div className="w-full h-[200px] mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.8229580454619!2d106.87077810675198!3d-6.372386770272539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed35096e49e3%3A0xa680d32198e0ec4e!2sMantra%20Barber%20%26%20Grooming!5e0!3m2!1sen!2sid!4v1746809847770!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl shadow-md"
              ></iframe>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <FaWhatsapp className="text-lg" />
              <p className="text-sm">0878-7828-9029</p>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-black text-white p-4">
        <p className="text-center text-xs">
          Copyright © 2024 MANTRA. All rights reserved.
        </p>
      </div>
    </div>
  );
}
