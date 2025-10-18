import { useEffect, useCallback } from "react";
import { useLocationStore } from "@/context/userStore";

export const useLocationService = () => {
    const {
        coords,
        address,
        loading,
        permission,
        setCoords,
        setAddress,
        setLoading,
        setPermission
    } = useLocationStore();

    const fetchAddressFromCoords = useCallback(async (lat: number, lon: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            const addressData = data?.address || {};

            const city =
                addressData.city ||
                addressData.town ||
                addressData.village ||
                addressData.county ||
                addressData.state ||
                "";

            const street =
                addressData.road ||
                addressData.neighbourhood ||
                addressData.suburb ||
                addressData.quarter ||
                "";

            const locationText = [street, city].filter(Boolean).join(", ");
            setAddress(locationText || "Manzil topilmadi");
        } catch (error) {
            console.error("Manzilni aniqlashda xatolik:", error);
            setAddress("Manzil topilmadi");
        }
    }, [setAddress]);

    const fetchLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setAddress("Geolocation qo'llab-quvvatlanmaydi");
            setPermission('denied');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lon: longitude });
                setPermission('granted');

                // Immediately fetch address when we get coordinates
                await fetchAddressFromCoords(latitude, longitude);
                setLoading(false);
            },
            (error) => {
                console.warn("Geolocation error:", error);
                setPermission('denied');
                setAddress("Joylashuv aniqmas");
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    }, [setCoords, setAddress, setLoading, setPermission, fetchAddressFromCoords]);

    const checkPermissionAndFetch = useCallback(async () => {
        if (!navigator.permissions) {
            // Fallback for browsers that don't support permissions API
            if (!coords) {
                fetchLocation();
            }
            return;
        }

        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

            setPermission(permissionStatus.state);

            // If permission is granted and we don't have coordinates, fetch immediately
            if (permissionStatus.state === 'granted' && !coords) {
                fetchLocation();
            }

            // Listen for permission changes
            permissionStatus.onchange = () => {
                setPermission(permissionStatus.state);
                if (permissionStatus.state === 'granted' && !coords) {
                    fetchLocation();
                }
            };
        } catch (error) {
            console.warn("Permission check failed:", error);
            // Fallback to direct fetch if permission check fails
            if (!coords) {
                fetchLocation();
            }
        }
    }, [coords, fetchLocation, setPermission]);

    useEffect(() => {
        checkPermissionAndFetch();
    }, [checkPermissionAndFetch]);

    return {
        coords,
        address,
        loading,
        permission,
        fetchLocation,
        refetchAddress: () => coords && fetchAddressFromCoords(coords.lat, coords.lon),
    };
};
