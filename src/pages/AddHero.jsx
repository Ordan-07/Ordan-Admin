import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AddHero = ({ token }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("buttonText", buttonText);
    formData.append("image", image);

    try {
      const res = await axios.post(`${backendUrl}/api/hero/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token
        }
      });
      toast.success(res.data.message);
      setTitle(''); setSubtitle(''); setButtonText(''); setImage(null);
    } catch (err) {
      toast.error("Error uploading slide");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" required />
      {/* <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Button Text" required /> */}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Upload Slide</button>
    </form>
  );
};

export default AddHero;
