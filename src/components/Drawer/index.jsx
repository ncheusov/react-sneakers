import { useState } from "react";
import axios from "axios";

import Info from "../Info";
import { _apiUrl } from "../../App";
import { useCart } from "../../hooks/useCart";

import styles from './Drawer.module.scss';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClickClose, onRemove, items = [], opened }) {
    const { cartItems, setCartItems, totalPrice } = useCart();
    const [isOrderProcessed, setIsOrderProcessed] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onClickOrder = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(`${_apiUrl}orders`, {
                items: cartItems,
            });
            setOrderId(data.id);
            setIsOrderProcessed(true);
            setCartItems([]);

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await axios.delete(`${_apiUrl}cart` + item.id);
                await delay(1000);
            };
        } catch (error) {
            alert("Не удалось создать заказ :(")
        }
        setIsLoading(false);
    };

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
            <div className={styles.drawer}>
                <h2 className='d-flex justify-between mb-30'>
                    Корзина
                    <img
                        className='cu-p'
                        onClick={onClickClose}
                        src="img/btn-remove.svg"
                        alt="Close"
                    />
                </h2>

                {items.length > 0 ? (
                    <div className="d-flex flex-column flex">
                        <div className="items">
                            {items.map((obj) => (
                                <div
                                    key={obj.id}
                                    className="cartItem d-flex align-center mb-20">
                                    <div
                                        style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                        className="cartItemImg">
                                    </div>
                                    <div className='mr-20 flex'>
                                        <p className='mb-5'>{obj.title}</p>
                                        <b>{obj.price} руб.</b>
                                    </div>
                                    <img
                                        onClick={() => onRemove(obj.id)}
                                        className='removeBtn'
                                        src="img/btn-remove.svg"
                                        alt="Remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='cartTotalBlock'>
                            <ul>
                                <li>
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>{totalPrice} руб.</b>
                                </li>
                                <li>
                                    <span>Налог 5%:</span>
                                    <div></div>
                                    <b>{totalPrice / 100 * 5} руб.</b>
                                </li>
                            </ul>
                            <button
                                disabled={isLoading}
                                onClick={onClickOrder}
                                className='greenButton'>
                                Оформить заказ <img src="img/arrow.svg" alt="Arrow" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Info
                        title={
                            isOrderProcessed
                                ? "Заказ оформлен"
                                : "Корзина пустая"
                        }
                        description={
                            isOrderProcessed
                                ? `Ваш заказ №${orderId} скоро будет передан курьерской доставке`
                                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
                        }
                        image={
                            isOrderProcessed
                                ? "img/complete-order.jpg"
                                : "img/empty-cart.jpg"
                        }
                    />
                )}
            </div>
        </div>
    );
}

export default Drawer;