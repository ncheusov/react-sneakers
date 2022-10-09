import { useContext } from 'react';

import AppContext from '../context';

function Info({ title, image, description }) {
    const { setCartOpened } = useContext(AppContext);

    return (
        <div className="cartEmpty d-flex align-center justify-center flex-column flex">
            <img
                className="mb-20"
                src={image}
                width="120px"
                alt="Empty cart"
            />
            <h2>{title}</h2>
            <p className="opacity-6">{description}</p>
            <button onClick={() => setCartOpened(false)} className="greenButton">
                <img src="img/arrow.svg" alt="Arrow" />
                Вернуться назад
            </button>
        </div>
    );
}

export default Info; 