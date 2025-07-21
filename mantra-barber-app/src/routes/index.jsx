import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card } from "flowbite-react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNamesPlugin from "embla-carousel-class-names";
import bgDashboard from "../assets/bg-dashboards.JPG";
import mantraLogo from "../assets/mantraLogo.PNG";
import aboutUs from "../assets/aboutUs.png";
import galeri1 from "../assets/galeri1.jpg";
import galeri2 from "../assets/galeri2.jpg";
import galeri3 from "../assets/galeri3.jpg";
import galeri4 from "../assets/galeri4.jpg";
import { FaInstagram, FaSpinner, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../service/products/index";
import { getServices } from "../service/services"; // sesuaikan path-nya

import Swal from "sweetalert2";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });
  const { data: services = [], isLoading: serviceLoading } = useQuery({
    queryKey: ["getServices"],
    queryFn: getServices,
  });

  const images = [galeri1, galeri2, galeri3, galeri4, bgDashboard];
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

  const handleBuyNow = async (tokopediaUrl) => {
    const confirm = await Swal.fire({
      title: "Lanjutkan ke Tokopedia?",
      text: "Anda akan dialihkan ke halaman Tokopedia untuk pembelian produk ini.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, lanjutkan!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    window.open(tokopediaUrl, "_blank");
  };

  const bestService = services?.find((s) =>
    s.name.toLowerCase().includes("best haircut")
  );
  const otherServices = services
    ?.filter((s) => s.id !== bestService?.id)
    .slice(0, 3); // ambil hanya 3 teratas

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
          <p>🕒 Mon-Thu: 11AM - 10PM | Fri-Sun: 10AM - 9PM</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center">About Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="text-gray-700">
            <p className="mb-2">
              Mantra Barbershop bukan sekadar tempat potong rambut — ini adalah
              ruang di mana gaya bertemu kenyamanan. Kami hadir untuk memberikan
              pengalaman grooming terbaik bagi pria modern yang menghargai
              detail, kebersihan, dan pelayanan premium. Dengan barbers
              profesional dan suasana yang cozy, kami memastikan setiap
              kunjungan adalah waktu berkualitas untuk merawat diri.
            </p>
            <p className="font-semibold italic text-sm">
              {" "}
              - ✂️ WE MADE YOURSELF BOLD AND CLEAN AS FAST LIKE A MAGIC TOUCH ✂️
              -
            </p>
            <Button
              as={Link}
              to="/create-booking"
              className="mt-4 w-30"
              color="dark"
            >
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
      <section id="services" className="bg-black text-white px-8 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Services</h2>
        {serviceLoading ? (
          <div className="text-center w-full col-span-3">
            Loading services...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BEST HAIRCUT */}
            {bestService && (
              <Card className="w-full max-w-sm mx-auto">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {bestService.name}
                </h5>
                <img
                  src={bestService.image_service}
                  alt={bestService.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl font-semibold">Rp.</span>
                  <span className="text-5xl font-extrabold tracking-tight">
                    {(bestService.price / 1000).toFixed(0)}
                  </span>
                  <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                    K
                  </span>
                </div>
                <ul className="my-7 space-y-5">
                  {(bestService.description || "No description available")
                    .split(",")
                    .map((item, index) => (
                      <li key={index} className="flex space-x-3 items-center">
                        <svg
                          className="h-5 w-5 text-cyan-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-base font-normal text-gray-500 dark:text-gray-400 items-center">
                          {item.trim()}
                        </span>
                      </li>
                    ))}
                </ul>
                <Button
                  as={Link}
                  to="/create-booking"
                  className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Book Now
                </Button>
              </Card>
            )}

            {/* OTHER 3 SERVICES */}
            <div className="lg:col-span-2 grid grid-rows-3 gap-5">
              {otherServices?.map((service) => (
                <div
                  key={service.id}
                  className="flex bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg overflow-hidden shadow-md h-48"
                >
                  <img
                    src={service.image_service}
                    alt={service.name}
                    className="w-1/3 h-full object-cover"
                  />
                  <div className="p-6 flex flex-col justify-between w-full">
                    <div>
                      <div className="flex items-baseline text-gray-900 dark:text-white mb-3">
                        <h5 className="text-sm md:text-xl font-bold">
                          {service.name}
                        </h5>
                        <span className="text-sm md:text-base font-semibold ms-3">
                          (Rp.
                        </span>
                        <span className="text-md md:text-2xl font-extrabold tracking-tight">
                          {(service.price / 1000).toFixed(0)}
                        </span>
                        <span className="text-xs ml-1 md:text-xl text-gray-500 dark:text-gray-400">
                          K)
                        </span>
                      </div>
                      {(service.description || "No description available")
                        .split(",")
                        .map((item, index) => (
                          <li
                            key={index}
                            className="flex space-x-3 items-center"
                          >
                            <svg
                              className="h-5 w-5 text-cyan-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-base font-normal text-gray-500 dark:text-gray-400 items-center">
                              {item.trim()}
                            </span>
                          </li>
                        ))}
                    </div>

                    <div className="mt-auto flex justify-end">
                      <Button
                        as={Link}
                        to="/create-booking"
                        className="inline-flex justify-center rounded-lg bg-cyan-600 px-5 py-1 md:py-2.5 text-sm font-medium text-white hover:bg-cyan-700"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* product Section */}
      <section id="product" className="px-6 py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">Product</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
            <span className="ml-3 text-lg font-semibold text-blue-600">
              Loading...
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="w-full max-w-3xs rounded-xl xl:max-w-xs h-[450px] xl:h-[500px] flex flex-col justify-between"
              >
                <img
                  src={product.image_product}
                  alt={product.name}
                  className="h-[220px] object-contain rounded-t-md"
                />

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <a href="#">
                    <h5 className="min-h-[56px] text-md sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h5>
                  </a>
                  <div className="mb-5 mt-2.5 flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                      4.9
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(product.price / 1000)}k
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBuyNow(product.link_product);
                      }}
                      className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-black text-white py-12">
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
              <li>
                <a
                  href="#booking"
                  className="transition-all duration-200 hover:text-black hover:font-bold"
                >
                  Booking
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="transition-all duration-200 hover:text-black hover:font-bold"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="transition-all duration-200 hover:text-black hover:font-bold"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#product"
                  className="transition-all duration-200 hover:text-black hover:font-bold"
                >
                  Product
                </a>
              </li>
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
