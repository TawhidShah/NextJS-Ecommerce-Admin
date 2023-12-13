import { Layout } from "@/components";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const res = await axios.get("/api/orders");
      setOrders(res.data.orders);
    };

    getOrders();
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Paid</th>
            <th>Customer</th>
            <th>Order Date</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td className="max-w-[4rem] break-words">{order._id}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "Yes" : "No"}
                </td>
                <td>
                  {order.name}
                  <br />
                  {order.email}
                  <br />
                  {order.address}
                  <br />
                  {order.city}, {order.postcode}
                  <br />
                  {order.country}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.line_items.map((product) => (
                    <div key={product._id}>
                      {product.price_data.product_data.name}{" "}
                      <span className="text-sky-400">x {product.quantity}</span>{" "}
                      @ £{product.price_data.unit_amount / 100}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Orders;
