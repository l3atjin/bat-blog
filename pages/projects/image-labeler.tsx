import React, { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
// import { SECRET_KEY } from '@env'
// import { ACCESS_KEY_ID } from '@env'

export default function ImageLabeler() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageURL] = useState("");
  const [label, setLabel] = useState(null);

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


  

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  // Polls the Bucket until the file specified in the params exist
  const pollForLabel = (params) => {
    s3.headObject(params, (err, data) => {
      if (err) {
        // If the object doesn't exist yet, retry after a delay
        setTimeout(() => pollForLabel(params), 1000); // You can adjust the polling interval as needed
        console.log("file doesnt exist yet. fetching again");
      } else {
        // The label file exists, fetch its content
        getLabel(params);
      }
    });
  };

  // GET request to S3 Bucket with params
  const getLabel = (params) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data.Body.toString('utf-8')); // successful response
        const newLabel = data.Body.toString('utf-8');
        setLabel(newLabel);
      }

    });
  }

  // Uploads the input image to S3 bucket, then calls for the label
  const uploadImage = (params) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image: ', err);
      } else {
        console.log('Image uploaded successfully. Image URL:', data.Location);

        // retrieve the image label txt file from the same Bucket
        const textFileName = image.name.split(".")[0] + ".txt"
        console.log("text file", textFileName);
        const paramsRetrieve = {
          Bucket: "image-labeler-demo", 
          Key: textFileName
        };
        
        pollForLabel(paramsRetrieve);
        
      }
    });
  }

  useEffect(() => {
    if (image) {
      const newURL = URL.createObjectURL(image);
      console.log("new URL", newURL);
      setImageURL(newURL);

      // upload to AWS
      const params = {
        Bucket: bucketName,
        Key: image.name,
        Body: image
      };

      uploadImage(params);
    }
    
  }, [image])

  
  

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      <Image
        src={imageUrl}
        alt="Uploaded Picture"
      />
      {label && <h2>Label: {label}</h2>}
    </div>
  )
}
