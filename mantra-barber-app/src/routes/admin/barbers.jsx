import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "flowbite-react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  getBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
} from "../../service/barbers";
import { getBookings } from "../../service/bookings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FileInput, HelperText } from "flowbite-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const Route = createFileRoute("/admin/barbers")({
  component: BarbersComponent,
});

function BarbersComponent() {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ["getBarbers"],
    queryFn: getBarbers,
    enabled: !!token,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["getBookings"],
    queryFn: getBookings,
    enabled: !!token,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
const [form, setForm] = useState({
  id: null,
  name: "",
  bio: "",
  photo_url: null,
  is_active: true,  
});

  const { mutate: createNewBarber, isPending: isCreating } = useMutation({
    mutationFn: (request) => createBarber(request),
    onSuccess: () => {
      toast.success("Barber Created Successfully!");
      queryClient.invalidateQueries(["getBarbers"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create barber");
    },
  });

  const { mutate: mutateUpdateBarber, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateBarber(id, data),
    onSuccess: () => {
      toast.success("Barber Updated Successfully!");
      queryClient.invalidateQueries(["getBarbers"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update barber");
    },
  });

  const { mutate: mutateDeleteBarber } = useMutation({
    mutationFn: (id) => deleteBarber(id),
    onSuccess: () => {
      toast.success("Barber Deleted Successfully!");
      queryClient.invalidateQueries(["getBarbers"]);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete barber");
    },
  });

  const isSubmitting = isCreating || isUpdating;

  function resetForm() {
    setForm({
      id: null,
      name: "",
      bio: "",
      photo_url: null,
      is_active: true,
    });
  }

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "photo_url") {
      setForm((prev) => ({ ...prev, photo_url: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      const { id, ...data } = form;
      mutateUpdateBarber({ id, data });
    } else {
      createNewBarber(form);
    }
  };

  const handleEdit = (id) => {
    const barber = barbers.find((b) => b.id === id);
    if (!barber) return;

    setForm({
      id: barber.id,
      name: barber.name || "",
      bio: barber.bio || "",
      photo_url: null,
      is_active: barber.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Barber ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        mutateDeleteBarber(id);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Barber</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Tambah Barber
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Edit Barber" : "Tambah Barber"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 form-light">
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Masukan Nama Barber"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bio</label>
                <textarea
                  name="bio"
                  placeholder="Masukan Bio Barber"
                  value={form.bio}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Gambar (Opsional)
                </label>
                <FileInput
                  id="file-upload"
                  name="photo_url"
                  onChange={handleChange}
                  className="w-full !bg-white !text-black"
                />
                <HelperText className="mt-1 text-sm !text-gray-600">
                  PNG atau JPG.
                </HelperText>
              </div>
              <div className="select-none">
                <label className="block mb-1 font-medium">Status</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
                    }
                    className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${
                      form.is_active ? "bg-green-500" : "bg-gray-300"
                    }`}
                    aria-pressed={form.is_active}
                  >
                    <span
                      className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                        form.is_active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="font-semibold text-gray-700">
                    {form.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
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
        {barbers.map((barber) => {
          const totalCustomers = bookings.filter(
            (b) => b.barber_id === barber.id && b.status === "done"
          ).length;

          return (
            <div
              key={barber.id}
              className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden"
            >
              {barber.photo_url ? (
                <img
                  src={barber.photo_url}
                  alt={barber.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-32 w-full flex items-center justify-center text-gray-400 text-3xl">
                  {barber.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold">{barber.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {barber.bio}
                </p>

                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Telah melayani: {totalCustomers} customer
                </p>

                <Badge
                  color={barber.is_active ? "success" : "failure"}
                  icon={barber.is_active ? FaCheckCircle : FaTimesCircle}
                  className="text-sm font-semibold inline-flex items-center gap-1 px-3 py-1 mt-4"
                >
                  {barber.is_active ? "Aktif" : "Tidak Aktif"}
                </Badge>
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    title="Edit Barber"
                    onClick={() => handleEdit(barber.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Hapus Barber"
                    onClick={() => handleDelete(barber.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
