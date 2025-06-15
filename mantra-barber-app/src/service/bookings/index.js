export const getBookings = async (name) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/bookings`;

  // Validasi: hanya tambahkan jika name adalah string dan tidak kosong
  if (typeof name === "string" && name.trim() !== "") {
    const params = new URLSearchParams({ name });
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }

  return result?.data;
};

export const getMyBookings = async () => {
  const token = localStorage.getItem("token");
  let url = `${import.meta.env.VITE_API_URL}/bookings/my-bookings`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  // get data
  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }

  return result?.data;
};

export const getDetailBookings = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/bookings/${id}`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  // get data
  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }

  return result?.data;
};

export const createBooking = async (request) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("barber_id", request.barber_id);
  formData.append("service_id", request.service_id);
  formData.append("booking_date", request.booking_date);
  formData.append("booking_time", request.booking_time);
  formData.append("cust_name", request.cust_name);
  formData.append("cust_phone_number", request.cust_phone_number);
  formData.append("cust_email", request.cust_email);
  if(request.source){
    formData.append("source",request.source);
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/Bookings`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: formData,
  });

  // get the data if fetching succeed!
  const result = await response.json();
  return result;
};

export const updateBookingById = async (id, request) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("barber_id", request.barber_id);
  formData.append("service_id", request.service_id);
  formData.append("booking_date", request.booking_date);
  formData.append("booking_time", request.booking_time);
  formData.append("cust_name", request.cust_name);
  formData.append("cust_phone_number", request.cust_phone_number);
  formData.append("cust_email", request.cust_email);
  if(request.source){
    formData.append("source",request.source);
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/Bookings/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: formData,
    }
  );

  // get the data if fetching succeed!
  const result = await response.json();
  return result;
};

export const deleteBookingById = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/Bookings/${id}`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });

  // get data
  const result = await response.json();
  return result;
};

export const cancelBooking = async (id) => {
  const token = localStorage.getItem("token");

  const url = `${import.meta.env.VITE_API_URL}/bookings/${id}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "cancelled" }),
  });

  const result = await response.json();

  if (!result?.success) {
    throw new Error(result?.message || "Gagal membatalkan booking");
  }

  return result?.data;
};
