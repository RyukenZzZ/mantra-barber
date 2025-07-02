import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Label, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Tambahkan ini
import { useMutation } from "@tanstack/react-query"; // pastikan sudah terpasang
import { useGoogleLogin } from "@react-oauth/google"; // pastikan sudah terpasang
import { toast } from "react-toastify"; // jika pakai react-toastify
import { useEffect, useState } from "react"; // jika belum ter-import
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { login, googleLogin } from "../service/auth"; // sesuaikan path
import { setToken, setUser } from "../redux/slices/auth"; // sesuaikan path

import googleLogo from "../assets/G-google.png";
import mantraLogo from "../assets/mantraLogo.PNG";
import bgBarber from "../assets/bg-booking6.JPG";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const dispatch = useDispatch(); // ✅
  const navigate = useNavigate();

  const { token,user } = useSelector((state) => state.auth); // ✅ ambil token dari redux state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleLoginMutation({ access_token: tokenResponse.access_token });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Google login failed!");
    },
  });

  const { mutate: googleLoginMutation, isLoading: isGoogleLoggingIn } =
    useMutation({
      mutationFn: (request) => googleLogin(request),
      onSuccess: (data) => {
        dispatch(setToken(data?.token));
        toast.success(data?.message || "Google login successful!"); // ✅ Sukses
        navigate({ to: "/" });
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Google login failed!";
        toast.error(message); // ✅ Error
      },
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

  const { mutate: loginUser, isLoading: isLoggingIn } = useMutation({
    mutationFn: (body) => login(body),
    onSuccess: (data) => {
      dispatch(setToken(data?.token));
      dispatch(setUser(data?.user)); // ✅ simpan user (jika kamu punya reducer-nya)
      console.log(data.user)
      toast.success(data?.message || "Login successful!"); // ✅ Tampilkan pesan sukses
      // Redirect berdasarkan role
    if (data?.user?.role === "admin") {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/" });
    }
  },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Login failed!";
      console.log(err);
      toast.error(message); // ✅ Tampilkan pesan error
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || isLoggingIn) return; // ⛔ mencegah spam klik manual

    setIsSubmitting(true);

    const body = {
      email,
      password,
    };

    loginUser(body, {
      onSettled: () => {
        setIsSubmitting(false); // ✅ apapun hasilnya, aktifkan kembali button
      },
    });
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(${bgBarber})`,
      }}
    >
      <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-row justify-center items-center mb-5">
          <Link to="/">
            <img
              src={mantraLogo}
              alt="MantraBarber Logo"
              className="w-30 h-20 cursor-pointer"
            />
          </Link>{" "}
        </div>

        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-black">
            Sign in to your Account
          </h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email" color="!gray">
              Your Email
            </Label>
            <TextInput
              id="email"
              type="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // ✅ handle input
            />
          </div>

          <div>
            <Label htmlFor="password" color="gray">
              Password
            </Label>
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"} // toggle type
              placeholder="*************"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Button
            type="submit"
            id="submit"
            disabled={isSubmitting || isLoggingIn}
          >
            {isSubmitting || isLoggingIn
              ? "Logging in..."
              : "Log in to your account"}
          </Button>

          <Button
            type="button"
            color="light"
            onClick={() => handleGoogleLogin()} // ✅ trigger Google login
            disabled={isGoogleLoggingIn} // ⬅️ disini
            className="flex items-center justify-center gap-2 border border-gray-300"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            {isGoogleLoggingIn ? "Signing in..." : "Sign in with Google"}
          </Button>

          <p className="text-sm text-center text-black mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
