import axios from 'axios';
import { createContext,useEffect,useState } from 'react';
import { usePostContext } from '../PostContext/PostContext';
import { useAuthContext } from '../AuthContext/AuthContext';

export const CartContext = createContext();

const CartContextProvider = (props) =>{
    const [cartItems, setcartItems] = useState({})
    const [token, settoken] = useState('')
    const {url} = usePostContext()
    const { authUser } = useAuthContext()
    const { fetchPostList,posts } = usePostContext()
    // console.log("auth",authUser);
    

    const addItemToCart = async (itemId) => {
        console.log("itemId", itemId);
        
        // Update cart items
        if (!cartItems[itemId]) {
            setcartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    
        try {
            // Make the POST request
            await axios.post(`${url}/api/cart/add/${authUser._id}`, { itemId });  
            console.log("authUserID",authUser._id);
                  
        } catch (error) {
            // Log the error to the console
            console.error("Error adding item to cart:", error);
            // You can also log specific properties of the error
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
        }
    };

    const removeItemFromCart = async (itemId) => {
        setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        await axios.post(`${url}/api/cart/remove/${authUser._id}`, { itemId });  
    }

    const fetchCartData = async () => {
        try {
            const response = await axios.post(`${url}/api/cart/get/${authUser._id}`, {});
            
            // Assuming response.data.cartData is the object you want
            const cartData = response.data.cartData; 
            
            setcartItems(cartData);
            
            // Log the entire data object
            // console.log("data", response.data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0 ) {
                let itemInfo =  posts.find((product) => product._id === item );
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }
    
    // console.log("dataherer",cartItems);

    useEffect(() => {
        async function loadData() {
            await fetchPostList();
            if (localStorage.getItem('user-info')) {
                settoken(localStorage.getItem('user-info'))
                await fetchCartData(localStorage.getItem('user-info'))
            }
        }
        loadData()
    }, [])
    
    

    const contextValue = {
        cartItems,
        addItemToCart,
        removeItemFromCart,
        fetchCartData,
        getTotalCartAmount,
        token,
    }

    return(
        <CartContext.Provider value={contextValue}>
            {props.children}
        </CartContext.Provider>
    )
}

export default CartContextProvider