import React, { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
// import { SECRET_KEY } from '@env'
// import { ACCESS_KEY_ID } from '@env'

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

      // upload to AWS
      
      const bucketRegion = "us-east-2"
      const bucketName = "image-labeler-demo"
      const IdentityPoolId = "us-east-2:3b086e39-d442-4ab0-9f97-ca03cfa89d0f"
      const AWS = require('aws-sdk');

      AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
          })
      });

      var s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: {Bucket: bucketName}
      });
    
      const params = {
        Bucket: bucketName,
        Key: image.name,
        Body: image
      };
      
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading image: ', err);
        } else {
          console.log('Image uploaded successfully. Image URL:', data.Location);
        }
      });
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
