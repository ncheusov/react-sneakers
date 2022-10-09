import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import AppContext from "./context";

export const _apiUrl = 'https://632f8112b56bd6ac45b0d2f1.mockapi.io/';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onAddToCart = async (obj) => {
        try {
            const findItems = cartItems.find((item) => 
                Number(item.parentId) === Number(obj.id));
            if (findItems) {
                setCartItems((prev) => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
                await axios.delete(`${_apiUrl}cart/${findItems.id}`);
            } else {
                setCartItems((prev) => [...prev, obj]);
                const { data } = await axios.post(`${_apiUrl}cart`, obj);
                setCartItems((prev) => prev.map(item => {
                    if (item.parentId === data.parentId) {
                        return {
                           ...item,
                           id: data.id 
                        };
                    } 
                    return item;
                }));
            }
        } catch (error) {
            console.error(error, 'Ошибка при добавлении в корзину')
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const onRemoveItem = async (id) => {
        try {
            await axios.delete(`${_apiUrl}cart/${id}`);
            setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
        } catch (error) {
            console.error(error, 'Ошибка при удалении из корзины');
        }
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
        return cartItems.some((obj) => Number(obj.parentId) === Number(id));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    cartResponse, 
                    favoritesResponse, 
                    itemsResponse
                ] = await Promise.all([
                    axios.get(`${_apiUrl}cart`),
                    axios.get(`${_apiUrl}favorites`),
                    axios.get(`${_apiUrl}items`)
                ]);

                setIsLoading(false);

                setCartItems(cartResponse.data);
                setFavorites(favoritesResponse.data);
                setItems(itemsResponse.data);
            } catch (error) {
                console.error(error, 'Ошибка при запросе данных');
            }
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
            onAddToCart,
            setCartOpened,
            setCartItems
        }}>
            <div className='wrapper clear'>
                <Drawer
                    opened={cartOpened}
                    items={cartItems}
                    onClickClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                />
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

                    <Route exact path='/favorites' element={<Favorites />} />
                    <Route exact path='/orders' element={<Orders />} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;