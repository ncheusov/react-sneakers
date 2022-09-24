import { useState } from 'react';

import Card from './components/Card';
import Header from './components/Header';
import Drawer from './components/Drawer';



function App() {
    const [items, setItems] = useState([]);
    const [cartOpened, setCartOpened] = useState(false);

    fetch('https://632f8112b56bd6ac45b0d2f1.mockapi.io/items')
        .then(res => {
            return res.json();
        })
        .then(json => {
            console.log(json);
        });

    return (
        <div className='wrapper clear'>
            {cartOpened && <Drawer onClickClose={() => setCartOpened(false)} />}
            <Header
                onClickCart={() => setCartOpened(true)}
            />
            <div className="content p-40">
                <div className='d-flex align-center justify-between mb-40'>
                    <h1>Все кроссовки</h1>
                    <div className="search-block d-flex">
                        <img src="img/search.svg" alt="Search" />
                        <input placeholder='Поиск' />
                    </div>
                </div>

                <div className="d-flex">
                    {items.map(({ title, price, imageUrl }) => (
                        <Card
                            title={title}
                            price={price}
                            imageUrl={imageUrl}
                            onCickFavorite={() => console.log('Добавили в закладки')}
                            onClickPlus={() => console.log('Нажали плюс')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;