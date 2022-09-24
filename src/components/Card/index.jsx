import { useState, useEffect } from 'react';

import styles from './Card.module.scss';

function Card(props) {
    const { title, price, imageUrl } = props;
    const [isAdded, setIsAdded] = useState(false);

    const onClickPlus = () => {
        setIsAdded(!isAdded);
    };

    // useEffect(() => {
    //     console.log('Variable is changed')
    // });

    return (
        <div className={styles.card}>
            <div className={styles.favorite}>
                <img src="/img/heart-unliked.svg" alt="Unliked" />
            </div>
            <img width={133} height={112} src={imageUrl} alt="Sneaker" />
            <h5>{title}</h5>
            <div className='d-flex justify-between align-center'>
                <div className='d-flex flex-column'>
                    <span>Цена:</span>
                    <b>{price} руб.</b>
                </div>
                <img 
                    className={styles.plus}
                    onClick={onClickPlus} 
                    src={
                        isAdded 
                        ? "/img/rectangle-checked.svg" 
                        : "/img/btn-plus.svg"
                    }
                    alt="plus" 
                />
            </div>
        </div>
    );
}

export default Card;