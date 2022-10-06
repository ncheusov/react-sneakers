import { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);

    const _apiUrl = 'https://632f8112b56bd6ac45b0d2f1.mockapi.io/';

    const onAddToCart = (obj) => {
        axios.post(`${_apiUrl}cart`, obj);
        setCartItems(prev => [...prev, obj]);
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const onRemoveItem = (id) => {
        axios.delete(`${_apiUrl}cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = (obj) => {
        axios.post(`${_apiUrl}favorites`, obj);
        setFavorites(prev => [...prev, obj]);
    };

    useEffect(() => {
        axios.get(`${_apiUrl}items`)
            .then((res) => {
                setItems(res.data);
            });
        axios.get(`${_apiUrl}cart`)
            .then((res) => {
                setCartItems(res.data);
            });
        axios.get(`${_apiUrl}favorites`)
            .then((res) => {
                setFavorites(res.data);
            });
    }, []);

    return (
        <div className='wrapper clear'>
            {cartOpened &&
                (<Drawer
                    items={cartItems}
                    onClickClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                />)
            }
            <Header onClickCart={() => setCartOpened(true)} />

            <Route path='/' exact>
                <Home
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onChangeSearchInput={onChangeSearchInput}
                    items={items}
                    onAddToFavorite={onAddToFavorite}
                    onAddToCart={onAddToCart}
                />
            </Route>

            <Route path='/favorites' exact>
                <Favorites items={favorites} />
            </Route>
        </div>
    );
}

export default App;