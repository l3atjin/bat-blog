import React, { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'

export default function ImageLabeler() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageURL] = useState("");

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  useEffect(() => {
    if (image) {
      const newURL = URL.createObjectURL(image);
      console.log("new URL", newURL);
      setImageURL(newURL);
    }
  }, [image])
  

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      <Image
        src={imageUrl}
        alt="Uploaded Picture"
      />
    </div>
  )
}
