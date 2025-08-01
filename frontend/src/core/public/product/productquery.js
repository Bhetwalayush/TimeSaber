import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Query to fetch all products
export const useGetprod = () => {
    return useQuery({
        queryKey: ["GET_PROD_LIST"],
        queryFn: () => {
            return axios.get("https://localhost:3000/api/items/");
        },
    });
};

// Filter products by subtype 'medical devices'
export const useGetDevicesProducts = () => {
    const { data, ...rest } = useGetprod();
    const filteredData = data?.data?.filter((item) => item.sub_item_type === "Our Favorites");
    return { data: filteredData, ...rest };
};

// Filter products by subtype 'baby care'
export const useGetBabyCareProducts = () => {
    const { data, ...rest } = useGetprod();
    const filteredData = data?.data?.filter((item) => item.sub_item_type === "Women Watch");
    return { data: filteredData, ...rest };
};

// Filter products by subtype 'woman care'
export const useGetWomanCareProducts = () => {
    const { data, ...rest } = useGetprod();
    const filteredData = data?.data?.filter((item) => item.sub_item_type === "Popular");
    return { data: filteredData, ...rest };
};

// Filter products by subtype 'men care'
export const useGetMenCareProducts = () => {
    const { data, ...rest } = useGetprod();
    const filteredData = data?.data?.filter((item) => item.sub_item_type === "Men Watch");
    return { data: filteredData, ...rest };
};



// Filter products by type 'first aid'
export const useGetFirstAidProducts = () => {
    const { data, ...rest } = useGetprod();
    const filteredData = data?.data?.filter((item) => item.sub_item_type === "New Arrials");
    return { data: filteredData, ...rest };
};

// Add to cart
export const useCartprod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["ADD_TO_CART"],
        mutationFn: async ({ itemId, quantity }) => {
            // Validation and logging
            if (!itemId || typeof quantity !== 'number' || quantity < 1) {
                console.error("Invalid cart payload:", { itemId, quantity });
                throw new Error("Invalid item or quantity for cart");
            }
            const payload = { items: [{ itemId, quantity }] };
            console.log("Cart payload:", payload);
            try {
                return await axios.post(
                    "https://localhost:3000/api/cart",
                    payload,
                    { withCredentials: true }
                );
            } catch (err) {
                if (err.response) {
                    console.error("Backend error:", err.response.data);
                }
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
        },
    });
};

// Add item to wishlist
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId }) =>
            axios.post(
                "https://localhost:3000/api/wishlist",
                { productId },
                { withCredentials: true }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
        },
    });
};

// Remove item from wishlist
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId }) =>
            axios.delete(`https://localhost:3000/api/wishlist/${productId}`, {
                withCredentials: true,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
        },
    });
};

// Fetch wishlist
export const useGetWishlist = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const { data } = await axios.get('https://localhost:3000/api/wishlist', {
                withCredentials: true
            });
            return data.wishlist;
        },
    });
};