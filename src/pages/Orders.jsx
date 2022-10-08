import { useEffect, useState } from "react";
import axios from "axios";

import { _apiUrl } from "../App";
import Card from "../components/Card";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${_apiUrl}orders`);
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
                setIsLoading(false);
            } catch (error) {
                // alert('Error');
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="content p-40">
            <div className='d-flex align-center justify-between mb-40'>
                <h1>
                    Мои заказы
                </h1>
            </div>

            <div className="d-flex flex-wrap">
                {isLoading ? [...Array(10)] : orders.map((item, index) => (
                    <Card
                        key={index}
                        loading={isLoading}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}

export default Orders;