export const getUrlPayment = async (id) => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/payments/${id}`;

    const response = await fetch(url, {
        headers: {
            authorization: `Bearer ${token}`,
        },
        method: "GET",
    });

    // get data
    const result = await response.json();
    console.log("result : ",result)
    if (!result?.success) {
        throw new Error(result?.errors);
    }

    return result?.data;
};

export const getPayments = async () => {
    const token = localStorage.getItem("token");

    let url = `${import.meta.env.VITE_API_URL}/payments`;

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