export const getBarbers = async (name) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/barbers`;

   // Validasi: hanya tambahkan jika name adalah string dan tidak kosong
    if (typeof name === 'string' && name.trim() !== '') {
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


export const getDetailBarbers = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/barbers/${id}`;

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

export const createBarber = async (request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("bio", request.bio);
    formData.append("is_active", request.is_active);
    if (request.photo_url) {
        formData.append("photo_url", request.photo_url);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/barbers`, {
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

export const updateBarber = async (id, request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("bio", request.bio);
    formData.append("is_active", request.is_active);
    if (request.photo_url) {
        formData.append("photo_url", request.photo_url);
    }
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/barbers/${id}`,
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

export const deleteBarber = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/barbers/${id}`;

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