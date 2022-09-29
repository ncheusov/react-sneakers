import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from './components/Card';
import Header from './components/Header';
import Drawer from './components/Drawer';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
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

    useEffect(() => {
        axios.get(`${_apiUrl}items`)
            .then((res) => {
                setItems(res.data);
            });
        axios.get(`${_apiUrl}cart`)
        .then((res) => {
            setCartItems(res.data);
        });
    }, []);

    return (
        <div className='wrapper clear'>
            {cartOpened &&
                 <Drawer 
                    items={cartItems} 
                    onClickClose={() => setCartOpened(false)} 
                    onRemove={onRemoveItem}
                 />
            }
            <Header onClickCart={() => setCartOpened(true)} />
            <div className="content p-40">
                <div className='d-flex align-center justify-between mb-40'>
                    <h1>
                        {searchValue
                            ? `Поиск по запросу: "${searchValue}"`
                            : 'Все кроссовки'
                        }
                    </h1>
                    <div className="search-block d-flex">
                        <img src="img/search.svg" alt="Search" />
                        {searchValue && (
                            <img
                                onClick={() => setSearchValue('')}
                                className='clear cu-p'
                                onChange={onChangeSearchInput}
                                src="/img/btn-remove.svg"
                                alt="Clear"
                            />
                        )}
                        <input
                            onChange={onChangeSearchInput}
                            value={searchValue}
                            placeholder='Поиск'
                        />
                    </div>
                </div>

                <div className="d-flex flex-wrap">
                    {items
                        .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
                        .map((item, index) => (
                            <Card
                                key={index}
                                title={item.title}
                                price={item.price}
                                imageUrl={item.imageUrl}
                                onClickFavorite={() => console.log('Добавили в закладки')}
                                onPlus={(obj) => onAddToCart(obj)}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default App;