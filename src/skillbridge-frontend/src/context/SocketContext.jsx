import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const getSocketUrl = () => {
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    return apiUrl.replace(/\/api\/v1\/?$/, "");
};

export function SocketProvider({ children }) {
    const { isAuthenticated, accessToken } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [toast, setToast] = useState(null);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const socketUrl = getSocketUrl();
        const newSocket = io(socketUrl, {
            auth: {
                token: accessToken
            },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        newSocket.on("notification:new", (notification) => {
            // Trigger in-app live toast
            setToast({
                id: notification._id || Date.now(),
                message: notification.message || "You have a new notification",
                timestamp: new Date()
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, accessToken]);

    // Auto-dismiss toast after 5 seconds
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            setToast(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                toast,
                closeToast
            }}
        >
            {children}

            {/* Real-time Notification Toast Notification */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        zIndex: 9999,
                        minWidth: "300px",
                        maxWidth: "420px",
                        backgroundColor: "#2C2C2C",
                        color: "#FFFFFF",
                        padding: "16px 20px",
                        borderRadius: "10px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                        borderLeft: "5px solid #D1C7BD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        animation: "slideInToast 0.3s ease-out",
                        fontFamily: "inherit"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <span style={{ fontSize: "20px" }}>🔔</span>
                        <div>
                            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#D1C7BD", fontWeight: 600 }}>
                                Live Notification
                            </div>
                            <div style={{ fontSize: "14px", marginTop: "2px", lineHeight: "1.4" }}>
                                {toast.message}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={closeToast}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#A69F91",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "4px",
                            lineHeight: 1
                        }}
                        aria-label="Close notification"
                    >
                        ✕
                    </button>
                </div>
            )}
        </SocketContext.Provider>
    );
}
