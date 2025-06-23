import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { Card, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import bgProfile from "../../assets/bgProfile.jpg";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../service/bookings";

export const Route = createFileRoute("/profile/")({
  component: ProfileComponent,
});

function ProfileComponent() {
  const { user,token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

    const { data: bookings = [] } = useQuery({
    queryKey: ["getBookings"],
    queryFn: getBookings,
    enabled: !!token,
  });

const userBookings = bookings.filter((b) =>
  b.user_id === user?.id &&
  ["booked", "done", "canceled"].includes(b.status)
);

const totalBooking = userBookings.length;



  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

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
      style={{
        backgroundImage: `url(${bgProfile})`,
      }}
    >
      <Card className="w-full max-w-lg p-4 text-black !bg-white border-3 !border-gray-300">
        <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <div className="flex flex-col justify-center items-center col-span-3 mb-8">
            <img
              src={
                !user.profile_picture ||
                user.profile_picture === "null" ||
                user.profile_picture === null
                  ? "https://i.pinimg.com/736x/25/a3/3f/25a33f3b84b18d51305822ee72dfcbff.jpg"
                  : user.profile_picture
              }
              alt="User avatar"
              referrerPolicy="no-referrer"
              className="w-35 h-35 object-cover rounded-full border-2 border-black"
            />
          </div>
          
        </div>
        <hr />
        <InfoRow label="Name" value={user?.name || ""} />
        <hr />
        <InfoRow label="Email" value={user?.email || ""} />
        <hr />
        <InfoRow label="Phone" value={user?.phone || ""} />
        <hr />
<InfoRow label="Total Booking" value={totalBooking.toString()} />
        <hr />

        <div className="flex justify-end mt-6 gap-4">
          <Button as={Link} to="/profile/edit" pill>Edit</Button>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center py-2">
      <p className="font-medium">{label}</p>
      <p className="col-span-2 ">: {value}</p>
    </div>
  );
}
