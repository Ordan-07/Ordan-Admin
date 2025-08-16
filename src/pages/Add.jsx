import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)
  const [image5,setImage5] = useState(false)
  const [image6,setImage6] = useState(false)
  const [image7,setImage7] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [detailedDescription, setDetailedDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Men");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [sizeStock, setSizeStock] = useState({});

   const handleSizeToggle = (size) => {
     setSizes(prev => {
       const newSizes = prev.includes(size) 
         ? prev.filter(item => item !== size) 
         : [...prev, size];
       
       // Update sizeStock to include/exclude the size
       setSizeStock(prevStock => {
         const newStock = { ...prevStock };
         if (newSizes.includes(size)) {
           newStock[size] = newStock[size] || 0;
         } else {
           delete newStock[size];
         }
         return newStock;
       });
       
       return newSizes;
     });
   };

   const handleStockChange = (size, value) => {
     setSizeStock(prev => ({
       ...prev,
       [size]: parseInt(value) || 0
     }));
   };

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("detailedDescription",detailedDescription)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append("sizeStock",JSON.stringify(sizeStock))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)
      image4 && formData.append("image5",image5)
      image4 && formData.append("image6",image6)
      image4 && formData.append("image7",image7)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setDetailedDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setImage5(false)
        setImage6(false)
        setImage7(false)
        setPrice('')
        setSizes([])
        setSizeStock({})
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
            <label htmlFor="image5">
              <img className='w-20' src={!image5 ? assets.upload_area : URL.createObjectURL(image5)} alt="" />
              <input onChange={(e)=>setImage5(e.target.files[0])} type="file" id="image5" hidden/>
            </label>
            <label htmlFor="image6">
              <img className='w-20' src={!image6 ? assets.upload_area : URL.createObjectURL(image6)} alt="" />
              <input onChange={(e)=>setImage6(e.target.files[0])} type="file" id="image6" hidden/>
            </label>
            <label htmlFor="image7">
              <img className='w-20' src={!image7 ? assets.upload_area : URL.createObjectURL(image7)} alt="" />
              <input onChange={(e)=>setImage7(e.target.files[0])} type="file" id="image7" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea 
            onChange={(e)=>setDescription(e.target.value)} 
            value={description} 
            className='w-full max-w-[500px] px-3 py-2 border rounded-md' 
            rows="4"
            placeholder='Write detailed product description here...' 
            required
          />
          <p className='text-xs text-gray-500 mt-1'>Write a comprehensive description that will help customers understand the product features, materials, and benefits.</p>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Detailed Description (for review section)</p>
          <textarea 
            onChange={(e)=>setDetailedDescription(e.target.value)} 
            value={detailedDescription} 
            className='w-full max-w-[500px] px-3 py-2 border rounded-md' 
            rows="4"
            placeholder='Write detailed product information for the review section...' 
          />
          <p className='text-xs text-gray-500 mt-1'>This description will appear in the review section and can be different from the main product description.</p>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Product Type</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
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

            <div>
              <p className='mb-2'>Product Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
            </div>

        </div>

        <div>
          <p className='mb-2'>Product Sizes & Stock</p>
          <div className='flex flex-wrap gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className='flex flex-col items-center gap-2'>
                <div onClick={() => handleSizeToggle(size)}>
                  <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>{size}</p>
                </div>
                {sizes.includes(size) && (
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={sizeStock[size] || ''}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                    className='w-16 px-2 py-1 text-center border text-sm'
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>
  )
}

export default Add