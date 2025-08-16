import axios from 'axios'
import { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    price: '',
    category: '',
    subCategory: '',
    sizes: [],
    sizeStock: {},
    bestseller: false
  })

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Auto-refresh function
  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      fetchList();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  };

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const startEditing = (product) => {
    setEditingProduct(product._id)
    setEditForm({
      name: product.name,
      description: product.description,
      detailedDescription: product.detailedDescription || '',
      price: product.price.toString(),
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes || [],
      sizeStock: product.sizeStock || {},
      bestseller: product.bestseller || false
    })
  }

  const cancelEditing = () => {
    setEditingProduct(null)
    setEditForm({
      name: '',
      description: '',
      detailedDescription: '',
      price: '',
      category: '',
      subCategory: '',
      sizes: [],
      sizeStock: {},
      bestseller: false
    })
  }

  const handleSizeToggle = (size) => {
    setEditForm(prev => {
      const newSizes = prev.sizes.includes(size) 
        ? prev.sizes.filter(item => item !== size) 
        : [...prev.sizes, size];
      
      const newStock = { ...prev.sizeStock };
      if (newSizes.includes(size)) {
        newStock[size] = newStock[size] || 0;
      } else {
        delete newStock[size];
      }
      
      return {
        ...prev,
        sizes: newSizes,
        sizeStock: newStock
      };
    });
  };

  const handleStockChange = (size, value) => {
    setEditForm(prev => ({
      ...prev,
      sizeStock: {
        ...prev.sizeStock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const updateProduct = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update', 
        { 
          productId: editingProduct,
          name: editForm.name,
          description: editForm.description,
          detailedDescription: editForm.detailedDescription,
          price: editForm.price,
          category: editForm.category,
          subCategory: editForm.subCategory,
          sizes: JSON.stringify(editForm.sizes),
          sizeStock: JSON.stringify(editForm.sizeStock),
          bestseller: editForm.bestseller
        }, 
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
        cancelEditing();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }



  useEffect(() => {
    fetchList()
    // Start auto-refresh
    const cleanup = startAutoRefresh();
    return cleanup;
  }, [])

  return (
    <>
      <div className='flex justify-between items-center mb-2'>
        <p>All Products List</p>
        <button 
          onClick={fetchList} 
          className='px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700'
        >
          Refresh
        </button>
      </div>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div key={index}>
              {editingProduct === item._id ? (
                // Edit Form
                <div className='border p-4 bg-gray-50'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-1'>Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className='w-full px-3 py-2 border'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-1'>Price</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                        className='w-full px-3 py-2 border'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-1'>Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className='w-full px-3 py-2 border'
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-1'>Product Type</label>
                      <select
                        value={editForm.subCategory}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subCategory: e.target.value }))}
                        className='w-full px-3 py-2 border'
                      >
                        <option value="oversized_tshirt_male">Oversized T-Shirt (Male)</option>
                        <option value="hoodie_male">Hoodie (Male)</option>
                        <option value="hoodie_female">Hoodie (Female)</option>
                        <option value="compression_tshirt_male">Compression T-Shirt (Male)</option>
                        <option value="compression_tshirt_female">Compression T-Shirt (Female)</option>
                        <option value="compression_pants_male">Compression Pants (Male)</option>
                        <option value="compression_pants_female">Compression Pants (Female)</option>
                        <option value="joggers_male">Joggers (Male)</option>
                        <option value="joggers_female">Joggers (Female)</option>
                        <option value="leggings_female">Leggings (Female)</option>
                        <option value="crop_top_female">Crop Top (Female)</option>
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                      </select>
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium mb-1'>Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className='w-full px-3 py-2 border rounded-md'
                        rows="4"
                        placeholder='Write detailed product description here...'
                      />
                      <p className='text-xs text-gray-500 mt-1'>Write a comprehensive description that will help customers understand the product features, materials, and benefits.</p>
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium mb-1'>Detailed Description (for review section)</label>
                      <textarea
                        value={editForm.detailedDescription}
                        onChange={(e) => setEditForm(prev => ({ ...prev, detailedDescription: e.target.value }))}
                        className='w-full px-3 py-2 border rounded-md'
                        rows="4"
                        placeholder='Write detailed product information for the review section...'
                      />
                      <p className='text-xs text-gray-500 mt-1'>This description will appear in the review section and can be different from the main product description.</p>
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium mb-1'>Sizes & Stock</label>
                      <div className='flex flex-wrap gap-3'>
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <div key={size} className='flex flex-col items-center gap-2'>
                            <div onClick={() => handleSizeToggle(size)}>
                              <p className={`${editForm.sizes.includes(size) ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>{size}</p>
                            </div>
                            {editForm.sizes.includes(size) && (
                              <input
                                type="number"
                                min="0"
                                placeholder="Stock"
                                value={editForm.sizeStock[size] || ''}
                                onChange={(e) => handleStockChange(size, e.target.value)}
                                className='w-16 px-2 py-1 text-center border text-sm'
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='md:col-span-2 flex gap-2'>
                      <input
                        type="checkbox"
                        checked={editForm.bestseller}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bestseller: e.target.checked }))}
                        id='edit-bestseller'
                      />
                      <label htmlFor='edit-bestseller'>Bestseller</label>
                    </div>
                    <div className='md:col-span-2 flex gap-2'>
                      <button onClick={updateProduct} className='px-4 py-2 bg-green-600 text-white'>Update</button>
                      <button onClick={cancelEditing} className='px-4 py-2 bg-gray-600 text-white'>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                // Product Display
                <div className='grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
                  <img className='w-12' src={item.image[0]} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>{currency}{item.price}</p>
                  <div className='flex flex-wrap gap-1'>
                    {item.sizes && item.sizes.map((size, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded ${(item.sizeStock && item.sizeStock[size] > 0) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {size}: {item.sizeStock && item.sizeStock[size] ? item.sizeStock[size] : 0}
                      </span>
                    ))}
                  </div>
                  <div className='flex gap-2 justify-center'>
                    <button onClick={() => startEditing(item)} className='text-gray-600 cursor-pointer'>Edit</button>
                    <button onClick={() => removeProduct(item._id)} className='text-red-600 cursor-pointer'>X</button>
                  </div>
                </div>
              )}
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List