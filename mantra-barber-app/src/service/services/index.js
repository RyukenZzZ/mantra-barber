export const getServices = async (name) => {
    const token = localStorage.getItem("token");
    let params = {};
    if (name) {
        params.name = name;
    }
    let url =
        `${import.meta.env.VITE_API_URL}/services` +
        new URLSearchParams(params);

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

export const getDetailServices = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/services/${id}`;

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

export const createService = async (request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("description", request.description);
    formData.append("price", request.price);

    if (request.image) {
        formData.append("profile_picture", request.image);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
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

export const updateService = async (id, request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("description", request.description);
    formData.append("price", request.price);
    if (request.image) {
        formData.append("profile_picture", request.image);
    }
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/${id}`,
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

export const deleteService = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/services/${id}`;

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