import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        const originalRequest = error.config;

        if (
            originalRequest?.url?.includes("/users/login") ||
            originalRequest?.url?.includes("/users/refresh-token")
        ) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            const refreshToken =
                localStorage.getItem("refreshToken");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {

                const response = await axios.post(
                    `${API_BASE_URL}/users/refresh-token`,
                    {
                        refreshToken
                    }
                );

                const newAccessToken =
                    response.data.data.accessToken;
                const newRefreshToken =
                    response.data.data.refreshToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                if (newRefreshToken) {
                    localStorage.setItem(
                        "refreshToken",
                        newRefreshToken
                    );
                }

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;