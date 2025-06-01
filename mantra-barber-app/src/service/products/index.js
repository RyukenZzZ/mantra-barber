export const getProducts = async (name) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/products`;

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


export const getDetailProducts = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/products/${id}`;

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

export const createProduct = async (request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("description", request.description);
    formData.append("price", request.price);
    formData.append("tokopedia_link", request.tokopedia_link);

    if (request.image_url) {
        formData.append("profile_picture", request.image_url);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
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

export const updateProduct = async (id, request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("description", request.description);
    formData.append("price", request.price);
    formData.append("tokopedia_link", request.tokopedia_link);
    if (request.image_url) {
        formData.append("profile_picture", request.image_url);
    }
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
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

export const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/products/${id}`;

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