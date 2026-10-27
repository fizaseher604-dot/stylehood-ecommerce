
import { useCallback, useEffect, useState } from "react";
import { ShopContext } from "./ShopContextDefinition";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Named export, so other files can import ShopContext from this file
export { ShopContext };

const ShopContextProvider = (props) => {
    const currency = "PKR";
    const delivery_fee = 200;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const [products, setProducts] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );

    const navigate = useNavigate();

    // Add product to cart
    // Add product to cart — instant UI update + success toast
const addToCart = async (itemId, size, quantity = 1) => {
    if (!size) {
        toast.error("Select Product size");
        return;
    }

    const amount = Number(quantity);

    if (!Number.isInteger(amount) || amount < 1) {
        toast.error("Please select a valid quantity");
        return;
    }

    if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
    }

    // Optimistically update the cart immediately
    setCartItem((previousCart) => {
        const updatedCart = structuredClone(previousCart);

        if (!updatedCart[itemId]) {
            updatedCart[itemId] = {};
        }

        updatedCart[itemId][size] =
            (Number(updatedCart[itemId][size]) || 0) + amount;

        return updatedCart;
    });

    // Show success feedback immediately
    toast.success("Product added to cart!", {
        toastId: `cart-${itemId}-${size}`,
    });

    try {
        const response = await axios.post(
            `${backendUrl}/api/cart/add`,
            { itemId, size, quantity: amount },
            { headers: { token } }
        );

        if (response.data.success) {
            // Sync with the server's latest cart if it provides one
            if (response.data.cartData) {
                setCartItem(response.data.cartData);
            }
        } else {
            // Roll back the optimistic update if the server rejects it
            await loadUserCart(token);
            toast.error(
                response.data.message || "Unable to add product"
            );
        }
    } catch (error) {
        console.error("Add To Cart Error:", error);

        // Restore the cart from the server after a failed request
        await loadUserCart(token);

        toast.error(
            error.response?.data?.message ||
                "Unable to add product to cart"
        );
    }
};

  // Fetch cart data with loading state
const loadUserCart = useCallback(
    async (currentToken, showError = false) => {
        setCartLoading(true);

        if (!currentToken) {
            setCartItem({});
            setCartLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { token: currentToken } }
            );

            if (response.data.success) {
                setCartItem(response.data.cartData || {});
            } else {
                setCartItem({});

                if (showError) {
                    toast.error(
                        response.data.message || "Unable to load cart"
                    );
                }
            }
        } catch (error) {
            console.error("Load Cart Error:", error);

            if (showError) {
                toast.error(
                    error.response?.data?.message ||
                        "Unable to load your cart"
                );
            }
        } finally {
            setCartLoading(false);
        }
    },
    [backendUrl]
);

    // Refresh cart
    const refreshCart = useCallback(async () => {
        await loadUserCart(token, true);
    }, [loadUserCart, token]);

    // Get total cart quantity
    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItem) {
            for (const size in cartItem[itemId]) {
                totalCount += Number(cartItem[itemId][size]) || 0;
            }
        }

        return totalCount;
    };

    // Update product quantity
    const updateQuantity = async (itemId, size, quantity) => {
        const amount = Number(quantity);

        if (!Number.isInteger(amount) || amount < 0) {
            toast.error("Invalid quantity");
            return;
        }

        if (!cartItem[itemId]) {
            return;
        }

        const previousCart = structuredClone(cartItem);
        const updatedCart = structuredClone(cartItem);

        if (amount === 0) {
            delete updatedCart[itemId][size];

            if (Object.keys(updatedCart[itemId]).length === 0) {
                delete updatedCart[itemId];
            }
        } else {
            updatedCart[itemId][size] = amount;
        }

        setCartItem(updatedCart);

        if (!token) {
            toast.error("Please login first");
            setCartItem(previousCart);
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, size, quantity: amount },
                { headers: { token } }
            );

            if (!response.data.success) {
                setCartItem(previousCart);
                toast.error(
                    response.data.message || "Unable to update cart"
                );
                return;
            }

            if (response.data.cartData) {
                setCartItem(response.data.cartData);
            }
        } catch (error) {
            console.error("Update Cart Error:", error);
            setCartItem(previousCart);
            toast.error(
                error.response?.data?.message ||
                    "Unable to update cart"
            );
        }
    };

    // Calculate cart amount
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItem) {
            const itemInfo = products.find(
                (product) => product._id === itemId
            );

            if (!itemInfo) continue;

            for (const size in cartItem[itemId]) {
                const quantity = Number(cartItem[itemId][size]) || 0;

                if (quantity > 0) {
                    totalAmount += Number(itemInfo.price) * quantity;
                }
            }
        }

        return totalAmount;
    };

    // Load products when app starts
    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/product/list`
                );

                if (!isMounted) return;

                if (response.data.success) {
                    setProducts(response.data.products || []);
                } else {
                    toast.error(
                        response.data.message || "Failed to load products"
                    );
                }
            } catch (error) {
                if (!isMounted) return;

                console.error("Product Fetch Error:", error);
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load products"
                );
            } finally {
                if (isMounted) {
                    setProductsLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [backendUrl]);

    // Sync cart when token changes
useEffect(() => {
    if (!token) {
        localStorage.removeItem("token");
        setCartItem({});
        setCartLoading(false);
        return;
    }

    localStorage.setItem("token", token);

    loadUserCart(token);
}, [token, loadUserCart]);

    // Context values
    const value = {
        products,
        productsLoading,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        setCartItem,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        refreshCart,
        cartLoading,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
