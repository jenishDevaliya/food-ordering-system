import React, { useState } from 'react';

const CancelOrderModal = ({ show, handleClose, orderNumber, paymentMode }) => {
  const [remark, setRemark] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!remark.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remark }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        let msg = result.message;
        if (paymentMode === 'online') {
          msg +=
            '\nSince you paid online, your amount will be refunded to your account within 2 days.';
        }
        setMessage(msg);
        setRemark('');
        setError('');
      } else {
        setError(result.message || 'Failed to cancel the order');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Order #{orderNumber}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            {message ? (
              <div className="alert alert-success">{message}</div>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Reason for Cancellation</label>
                    <textarea
                      className="form-control"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Enter reason here..."
                    />
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                      Close
                    </button>

                    <button type="submit" className="btn btn-danger">
                      Cancel Order
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
