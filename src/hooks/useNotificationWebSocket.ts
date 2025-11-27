import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_TYPES_TO_REFETCH, type NotificationTypeToRefetch } from "@/api/notification";

interface UseNotificationWebSocketProps {
    userId: string | null;
    enabled?: boolean;
}

export const useNotificationWebSocket = ({
    userId,
    enabled = true
}: UseNotificationWebSocketProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId || !enabled) return;

        const socketUrl = `wss://api.azera.uz/ws/notifications/?type=user&id=${userId}`;
        const ws = new WebSocket(socketUrl);
        wsRef.current = ws;

       

        ws.onmessage = (event) => {

            try {
                // Parse the notification data to check the type
                const notificationData = JSON.parse(event.data);
                const notificationType = notificationData?.type;

                // Only refetch if the notification type is in our allowed list
                if (notificationType && NOTIFICATION_TYPES_TO_REFETCH.includes(notificationType as NotificationTypeToRefetch)) {
                    queryClient.invalidateQueries({ queryKey: ["notification"] });
                } else {
                }
            } catch (error) {
                console.error("❌ Error parsing notification data:", error);
                // If parsing fails, still refetch to be safe
                queryClient.invalidateQueries({ queryKey: ["notification"] });
            }
        };

        ws.onerror = (err) => {
            console.error("❌ WebSocket error:", err);
        };

        ws.onclose = () => {
        };

        return () => {
            ws.close();
        };
    }, [userId, enabled, queryClient]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return {
        isConnected: wsRef.current?.readyState === WebSocket.OPEN,
        closeConnection: () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        }
    };
};
