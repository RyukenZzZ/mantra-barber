export const login = async (request) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        body: JSON.stringify(request),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // get the data if fetching succeed!
    const result = await response.json();
    if (!result?.success) {
        throw new Error(result?.message);
    }

    return result?.data;
};

export const googleLogin = async (request) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/login`, {
        body: JSON.stringify(request),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // get the data if fetching succeed!
    const result = await response.json();
    if (!result?.success) {
        throw new Error(result?.message);
    }

    return result?.data;
};

export const register = async (request) => {
    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("email", request.email);
    formData.append("password", request.password);
    formData.append("phone",request.phone);
    formData.append("profile_picture", request.profilePicture);

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
            method: "POST",
            body: formData,
        }
    );

    // get the data if fetching succeed!
    const result = await response.json();
    if (!result?.success) {
        throw new Error(result?.errors);
    }

    return result?.data;
};

export const profile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );

    // get data
    const result = await response.json();
    if (!result?.success) {
        throw new Error(result?.message);
    }

    return result?.data;
};

export const updateProfile = async (request) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("email", request.email);
    formData.append("phone", request.phone);
    if (request.profile_picture) {
        formData.append("profile_picture", request.profile_picture);
    }
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
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