import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from "./context";

export const _apiUrl = 'https://632f8112b56bd6ac45b0d2f1.mockapi.io/';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onAddToCart = (obj) => {
        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(`${_apiUrl}cart/${obj.id}`);
            setCartItems((prev) => prev.filter(item => Number(item.id) !== Number(obj.id)));
        } else {
            axios.post(`${_apiUrl}cart`, obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const onRemoveItem = (id) => {
        axios.delete(`${_apiUrl}cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => favObj.id === obj.id)) {
                axios.delete(`${_apiUrl}favorites/${obj.id}`);
                setFavorites((prev) => prev.filter(item => Number(item.id) !== Number(obj.id)));
            } else {
                const { data } = await axios.post(`${_apiUrl}favorites`, obj);
                setFavorites(prev => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалалось добавить в закладки');
        }

    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.id) === Number(id));
    };

    useEffect(() => {
        async function fetchData() {
            const cartResponse = await axios.get(`${_apiUrl}cart`);
            const favoritesResponse = await axios.get(`${_apiUrl}favorites`);
            const itemsResponse = await axios.get(`${_apiUrl}items`);

            setIsLoading(false);

            setCartItems(cartResponse.data);
            setFavorites(favoritesResponse.data);
            setItems(itemsResponse.data);
        }

        fetchData();
    }, []);

    return (
        <AppContext.Provider value={{ 
            items, 
            cartItems, 
            favorites, 
            isItemAdded, 
            onAddToFavorite,
            setCartOpened,
            setCartItems
        }}>
            <div className='wrapper clear'>
                {cartOpened &&
                    (<Drawer
                        items={cartItems}
                        onClickClose={() => setCartOpened(false)}
                        onRemove={onRemoveItem}
                    />)
                }
                <Header onClickCart={() => setCartOpened(true)} />

                <Routes>
                    <Route exact path='/'
                        element={
                            <Home
                                cartItems={cartItems}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onChangeSearchInput={onChangeSearchInput}
                                items={items}
                                onAddToFavorite={onAddToFavorite}
                                onAddToCart={onAddToCart}
                                isLoading={isLoading}
                            />
                        }
                    />

                    <Route exact path='/favorites'element={<Favorites/>}/>
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;