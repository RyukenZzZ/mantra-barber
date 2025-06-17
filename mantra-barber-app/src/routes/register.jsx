import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Label, TextInput } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { register as registerService } from "../service/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/slices/auth"; // sesuaikan path


export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { token,user } = useSelector((state) => state.auth)
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null, // kalau nanti mau unggah foto
  });

useEffect(() => {
    if (token) {
      if (user?.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]:
        id === "profilePicture" ? (files && files[0] ? files[0] : null) : value,
    }));
  };

  const { mutate: doRegister, isLoading } = useMutation({
    mutationFn: (body) => registerService(body),
    onSuccess: (data) => {
      dispatch(setToken(data?.token));
      toast.success(data?.message || "Register berhasil!");
      navigate({ to: "/" });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Register gagal!";
      toast.error(msg);
    },
  });

const handleSubmit = (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  if (form.password !== form.confirmPassword) {
    toast.error("Password dan konfirmasi tidak sama");
    return;
  }

  if (!/^\d+$/.test(form.phone)) {
    toast.error("Nomor telepon hanya boleh diisi angka");
    return;
  }

  setIsSubmitting(true); // set submitting true

  doRegister(
    {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      profilePicture: form.profilePicture,
    },
    {
      onSettled: () => {
        setIsSubmitting(false); // always reset
      },
    }
  );
};


  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1244833615/id/foto/ilustrasi-3d-interior-tempat-kerja-barbershop.jpg?s=2048x2048&w=is&k=20&c=SBl6XLkMdH2RqlVA6JR0NDPUmbJfCmIJ3efY166zq_I=")',
      }}
    >
      <div className="w-2/3 max-w-md bg-gray-800 bg-opacity-90 rounded-lg shadow-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            Create your Free Account
          </h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-white">
              Your Name
            </Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Put your name here"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-white">
              Your Phone Number
            </Label>
            <TextInput
              id="phone"
              type="tel"
              placeholder="08XXXXXXXXXX"
              required
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15} // opsional: batasi panjang nomor
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-white">
              Your Email
            </Label>
            <TextInput
              id="email"
              type="email"
              placeholder="example@gmail.com"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"} // toggle type
              placeholder="*************"
              required
              value={form.password}
              onChange={handleChange}
              rightIcon={() =>
                !showPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-gray-500"
                    fontSize={24}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-gray-500"
                    fontSize={24}
                  />
                )
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <TextInput
              id="confirmPassword"
              type={showPassword ? "text" : "password"} // toggle type
              placeholder="*************"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              rightIcon={() =>
                !showPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-gray-500"
                    fontSize={24}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-gray-500"
                    fontSize={24}
                  />
                )
              }
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            id="submit"
            disabled={ isSubmitting || isLoading}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
  {isSubmitting || isLoading ? "Creating..." : "Create an account"}
          </Button>

          <p className="text-sm text-center text-white mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
