import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Spinner, TextInput, Label, FileInput, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import bgProfile from "../../assets/bgProfile.JPG";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../service/auth";
import { setUser } from "../../redux/slices/auth";
import { toast } from "react-toastify";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfileComponent,
});

function EditProfileComponent() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profile_picture: null,
      });
      setLoading(false);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      dispatch(setUser(data.data));
      toast.success("Update Successfully !!!")
      navigate({ to: "/profile" });
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-30"
      style={{ backgroundImage: `url(${bgProfile})` }}
    >
      <Card className="w-full max-w-lg p-6 text-black !bg-white border-3 !border-gray-300">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4 !text-black">
  <div className="flex flex-col gap-1">
    <Label className="!text-black" htmlFor="name">Name :</Label>
    <TextInput
      id="name"
      name="name"
      type="text"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </div>

  <div className="flex flex-col gap-1">
    <Label className="!text-black" htmlFor="email" value="Email">Email :</Label>
    <TextInput
      id="email"
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>

  <div className="flex flex-col gap-1">
    <Label className="!text-black" htmlFor="phone" value="Phone">Phone :</Label>
    <TextInput
      id="phone"
      name="phone"
      type="tel"
      value={formData.phone}
      onChange={handleChange}
    />
  </div>

  <div className="flex flex-col gap-1">
    <Label className="!text-black" htmlFor="profile_picture" value="Profile Picture">Profile Picture :</Label>
    <FileInput
      id="profile_picture"
      name="profile_picture"
      accept="image/*"
      onChange={handleChange}
    />
  </div>

  <div className="flex justify-end gap-4 mt-6">
    <Button type="submit" pill isProcessing={mutation.isPending}>
      Save Changes
    </Button>
    <Button color="gray" pill onClick={() => navigate({ to: "/profile" })}>
      Cancel
    </Button>
  </div>
</form>

      </Card>
    </div>
  );
}
