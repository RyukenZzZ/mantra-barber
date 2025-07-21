import { createFileRoute } from "@tanstack/react-router";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../service/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FileInput, HelperText } from "flowbite-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Protected from "../../components/Auth/Protected";

export const Route = createFileRoute("/admin/services")({
    component: () => (
        <Protected roles={["admin"]}>
            <ServicesComponent />
        </Protected>
    ),
});

function ServicesComponent() {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["getServices"],
    queryFn: getServices,
    enabled: !!token,
  });

  // State untuk modal dan form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form untuk create/update
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    image_service: null,
  });

  // Mutation untuk create
  const { mutate: createNewService, isPending: isCreating } = useMutation({
    mutationFn: (request) => createService(request),
    onSuccess: () => {
      toast.success("Service Created Successfully!");
      queryClient.invalidateQueries(["getServices"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create service");
    },
  });

  // Mutation untuk update
  const { mutate: mutateUpdateService, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      toast.success("Service Updated Successfully!");
      queryClient.invalidateQueries(["getServices"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update service");
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const { mutate: mutateDeleteService } = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      toast.success("Service Deleted Successfully!");
      queryClient.invalidateQueries(["getServices"]);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete service");
    },
  });

  // Reset form ke kosong
  function resetForm() {
    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      image_service: null,
    });
  }

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_service") {
      setForm((prev) => ({ ...prev, image_service: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit form (create atau update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id) {
      // update
      const { id, ...data } = form;
      mutateUpdateService({ id, data });
    } else {
      // create new
      createNewService(form);
    }
  };

  // Handle tombol edit: buka modal dan isi form dengan data awal
  const handleEdit = (id) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;

    setForm({
      id: service.id,
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      image_service: null, // kalau mau, kamu bisa tampilkan gambar lama tapi FileInput harus tetap kosong karena file harus dipilih ulang
    });
    setIsModalOpen(true);
  };

  // Handle tombol delete (bisa kamu lengkapi sendiri)
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Service ini?",
      text: "Service yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        mutateDeleteService(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <span className="ml-3 text-lg font-semibold text-blue-600">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Layanan</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            resetForm(); // kosongkan form kalau tambah baru
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Tambah Service
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Edit Service" : "Tambah Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 form-light">
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Masukan Nama Service"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Deskripsi</label>
                <textarea
                  name="description"
                  placeholder="Deskripsikan service yang ditawarkan"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Harga</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Masukan Nominal Harganya"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium ">
                  Gambar (Opsional)
                </label>
                <FileInput
                  id="file-upload"
                  name="image_service"
                  onChange={handleChange}
                  className="w-full !bg-white !text-black"
                />
                <HelperText className="mt-1 text-sm !text-gray-600">
                  PNG atau JPG.
                </HelperText>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded text-white ${
                    isSubmitting
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" />
                      {form.id ? "Mengedit..." : "Menambah..."}
                    </div>
                  ) : form.id ? (
                    "Edit"
                  ) : (
                    "Tambah"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden"
          >
            {service.image_service ? (
              <img
                src={service.image_service}
                alt={service.name}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-32 w-full flex items-center justify-center text-gray-400 text-sm">
                {service.name}
              </div>
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-blue-600 font-bold">
                Rp {service.price.toLocaleString()}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(service.id)}
                  className="text-blue-600 hover:text-blue-800 text-2xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-800 text-2xl"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
