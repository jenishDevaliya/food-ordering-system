import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useNavigate, useParams } from 'react-router-dom';
import CancelOrderModal from '../components/CancelOrderModal';

const OrderDetails = () => {
  const userId = localStorage.getItem('userId');
  const [orderItems, setOrderItems] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [total, setTotal] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const handleCloseCancelModal = () => setShowCancelModal(false);
  const navigate = useNavigate();
  const { order_number } = useParams();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://127.0.0.1:8000/api/orders/by_order_number/${order_number}/`)
      .then((res) => res.json())
      .then((data) => {
        setOrderItems(data);
        const totalAmount = data.reduce((sum, item) =>   sum + (item.food?.item_price || 0) * (item.quantity || 0), 0 );
        setTotal(totalAmount);
      });
    
    fetch(`http://127.0.0.1:8000/api/order_address/${order_number}/`)
      .then((res) => res.json())
      .then((data) => {
        setOrderAddress(data);
      });
  
  
    }, [order_number]);
 
 
 
 
  return (
  <PublicLayout>
      <div className="container py-5">
        <h3 className="mb-4 text-primary">
          <i className="fas fa-receipt me-2"></i> Order #{order_number} Details
        </h3>

        <div className="row">
          <div className="col-md-8">
            {orderItems.map((item, index) => (
              <div key={index} className="card mb-3 shadow-sm border-0 rounded-3">
                <div className="row">
                  <div className="col-md-4">
                    <img src={`http://127.0.0.1:8000${item.food.image}`} className="img-fluid rounded-start" style={{minHeight: '200px',height: '250px',width: '100%',}}/>
                  </div>
                  <div className="col-md-8 p-3">
                    <h5 className="fw-semibold">{item.food.item_name} <span className="text-muted"> ({item.food.item_quantity}) </span>
                    </h5>
                    <p>{item.food.item_description}</p>
                    <p><strong>Price:</strong> ₹{item.food.item_price}</p>
                    <p><strong>Quantity:</strong>{item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
         <div className="col-md-4">
            {orderAddress && (
              <div className="card mb-3 shadow-sm border-0 bg-light p-3">
                <h5 className="fw-semibold mb-3">
                  <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                  Delivery Details
                </h5>
                <p> <strong>Date:</strong>{new Date(orderAddress.order_time).toLocaleString()}</p>
                <p><strong>Address:</strong> {orderAddress.address}</p>
                <p> <strong>Status:</strong> {orderAddress.order_final_status ||'Waiting for Restaurant Confirmation'}</p>
                <p><strong>Payment Mode:</strong> <span className="badge bg-info text-dark ms-2">{orderAddress?.payment_mode || "COD"}</span></p>
                <p><strong>Total:</strong> ₹ {total} </p>

                <a href={`http://127.0.0.1:8000/api/invoice/${order_number}/`} target="_blank" className="btn btn-primary w-100 my-2">
                  <i className="fas fa-file-invoice me-2"></i> Invoice
                </a>

                {orderAddress && (
                  <>
                     <CancelOrderModal
                     show={showCancelModal}
                     handleClose={handleCloseCancelModal}
                     orderNumber={order_number}
                     paymentMode={orderAddress.payment_mode}
                    />


                     {(orderAddress.order_final_status === null ||
                      orderAddress.order_final_status === 'Order Confirmed' ||
                      orderAddress.order_final_status === 'Food Being Prepared') ? 
                      (
                        <a onClick={()=> setShowCancelModal(true)} className="btn btn-danger w-100">
                  <i className='fas fa-times-circle me-2'></i> Cancel Order
                </a>
                      ): (
                         <p className="text-danger mt-2">
                           Order cannot be cancelled (Curreent Status: {orderAddress.order_final_status})
                         </p>
                        

                      )}


                  
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetails;
