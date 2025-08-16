import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Settings = ({ token }) => {
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [loading, setLoading] = useState(false);

  // Fetch current delivery fee
  const fetchDeliveryFee = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings/delivery-fee');
      if (response.data.success) {
        setDeliveryFee(response.data.deliveryFee);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch delivery fee');
    }
  };

  // Update delivery fee
  const updateDeliveryFee = async () => {
    if (!deliveryFee || deliveryFee < 0) {
      toast.error('Please enter a valid delivery fee amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/settings/update-delivery-fee',
        { deliveryFee: Number(deliveryFee) },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Delivery fee updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update delivery fee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryFee();
  }, []);

  return (
    <div className='p-6'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Settings</h1>
        
        {/* Delivery Fee Section */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Delivery Charges</h2>
          <p className='text-gray-600 mb-4'>
            Set the delivery fee that will be applied to all orders. This amount will be added to the cart total.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 items-end'>
            <div className='flex-1'>
              <label className='block text-sm font-medium mb-2'>Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter delivery fee"
              />
            </div>
            <button
              onClick={updateDeliveryFee}
              disabled={loading}
              className='px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Updating...' : 'Update Fee'}
            </button>
          </div>
          
          <div className='mt-4 p-3 bg-gray-50 rounded-md'>
            <p className='text-sm text-gray-600'>
              <strong>Current Setting:</strong> ₹{deliveryFee} delivery fee will be applied to all orders
            </p>
          </div>
        </div>

        {/* Additional Settings can be added here */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Additional Settings</h2>
          <p className='text-gray-600'>
            More configuration options will be available here in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 