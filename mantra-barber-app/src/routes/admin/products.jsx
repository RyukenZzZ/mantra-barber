import { createFileRoute } from "@tanstack/react-router";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../service/products";
import { useState } from "react";
import { FileInput, HelperText } from "flowbite-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const Route = createFileRoute("/admin/products")({
  component: ProductsComponent,
});

function ProductsComponent() {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
    enabled: !!token,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    tokopedia_link: "",
    image_url: null,
  });

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      tokopedia_link: "",
      image_url: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url") {
      setForm((prev) => ({ ...prev, image_url: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { mutate: createNewProduct, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan");
      queryClient.invalidateQueries(["getProducts"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menambahkan produk");
    },
  });

  const { mutate: mutateUpdateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui");
      queryClient.invalidateQueries(["getProducts"]);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal memperbarui produk");
    },
  });

  const { mutate: mutateDeleteProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Produk berhasil dihapus");
      queryClient.invalidateQueries(["getProducts"]);
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menghapus produk");
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);

    if (form.id) {
      const { id, ...data } = form;
      mutateUpdateProduct({ id, data });
    } else {
      createNewProduct(form);
    }
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    setForm({
      id: product.id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      tokopedia_link: product.tokopedia_link || "",
      image_url: null, // file input tidak bisa preload file, harus upload ulang
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Produk ini?",
      text: "Produk yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      mutateDeleteProduct(id);
    }
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
        <h1 className="text-2xl font-bold">Daftar Produk</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Tambah Produk
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 form-light">
              <div>
                <label className="block mb-1 font-medium">Nama Produk</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Masukkan nama produk"
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
                  placeholder="Deskripsikan produk yang ditawarkan"
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
                  placeholder="Masukkan Harga Produk"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Link</label>
                <input
                  type="text"
                  name="tokopedia_link"
                  placeholder="Masukkan Link E-Commerce barang tersebut"
                  value={form.tokopedia_link}
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
                  id="image"
                  name="image_url"
                  onChange={handleChange}
                  className="w-full !bg-white !text-black"
                />
                <HelperText className="mt-1 text-sm text-gray-600">
                  PNG atau JPG. Jika tidak diubah, gambar lama tetap digunakan.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            {product.image_url ? (
              <div className="flex items-center justify-center bg-gray-200 h-40 w-full">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-500 text-sm">
                {product.name}
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-blue-600 font-bold">
                Rp {product.price.toLocaleString()}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="text-blue-600 text-2xl hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 text-2xl hover:text-red-800"
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
