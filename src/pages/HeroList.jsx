import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const HeroList = ({ token }) => {
  const [slides, setSlides] = useState([]);
  const [editSlide, setEditSlide] = useState(null);

  const fetchSlides = async () => {
    const res = await axios.get(`${backendUrl}/api/hero/all`);
    setSlides(res.data.data);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/hero/delete/${id}`);
      toast.success(res.data.message);
      fetchSlides();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editSlide.title);
    formData.append('subtitle', editSlide.subtitle);
    // formData.append('buttonText', editSlide.buttonText);
    if (editSlide.imageFile) formData.append('image', editSlide.imageFile);

    try {
      const res = await axios.put(`${backendUrl}/api/hero/update/${editSlide._id}`, formData, {
        headers: { token },
      });
      toast.success(res.data.message);
      setEditSlide(null);
      fetchSlides();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Hero Slides</h2>

      {slides.map(slide => (
        <div key={slide._id} className="border p-4 mb-4">
          <img src={`${backendUrl}/uploads/${slide.image}`} className="w-32 mb-2" alt="slide" />
          <h3 className="font-semibold">{slide.title}</h3>
          <p>{slide.subtitle}</p>
          <p className="text-sm text-gray-500">{slide.buttonText}</p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditSlide(slide)} className="text-gray-600">Edit</button>
            <button onClick={() => handleDelete(slide._id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}

      {editSlide && (
        <form onSubmit={handleEdit} className="border p-4 mt-6">
          <h3 className="font-semibold mb-2">Edit Slide</h3>
          <input value={editSlide.title} onChange={e => setEditSlide({ ...editSlide, title: e.target.value })} placeholder="Title" required />
          <input value={editSlide.subtitle} onChange={e => setEditSlide({ ...editSlide, subtitle: e.target.value })} placeholder="Subtitle" required />
          {/* <input value={editSlide.buttonText} onChange={e => setEditSlide({ ...editSlide, buttonText: e.target.value })} placeholder="Button Text" required /> */}
          <input type="file" onChange={e => setEditSlide({ ...editSlide, imageFile: e.target.files[0] })} />
          <div className="flex gap-2 mt-3">
            <button type="submit" className="bg-black text-white px-3 py-1">Update</button>
            <button type="button" onClick={() => setEditSlide(null)} className="text-gray-500">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HeroList;
