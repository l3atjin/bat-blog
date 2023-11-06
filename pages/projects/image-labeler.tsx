import React, { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Layout from '../../components/layout';
import styles from './image-labeler.module.css';
// import { SECRET_KEY } from '@env'
// import { ACCESS_KEY_ID } from '@env'

export default function ImageLabeler() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageURL] = useState("");
  const [label, setLabel] = useState(null);
  const [labels, setLabels] = useState([]);

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
        const jsonData = JSON.parse(data.Body.toString('utf-8'));
        console.log(jsonData);
        setLabels(jsonData)
      }

    });
  }

  // Sets the labels given an json object
  const updateLabels = (data) => {
    const newLabels = data.map( (el) => {
      return el["Name"]
    })
    setLabels(newLabels);
  }

  // Uploads the input image to S3 bucket, then calls for the label
  const uploadImage = (params) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image: ', err);
      } else {
        console.log('Image uploaded successfully. Image URL:', data.Location);

        // retrieve the image label txt file from the same Bucket
        const fileName = image.name.split(".")[0] + ".json"
        console.log("json file", fileName);
        const paramsRetrieve = {
          Bucket: "image-labeler-demo", 
          Key: fileName
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
    <Layout>
      <h1>Image Labeler Demo</h1>
      <h3>Instructions: Upload an image of your choice (.png or .jpg)</h3>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      {image && <Image src={imageUrl} width={300} alt="Uploaded Picture"/>}
      {labels && <h2 className={styles.label_header}>Top labels are:</h2>}
      <div className={styles.horizontal_labels}>
        {
          labels && labels.map((label) => (
            <p key={label["Name"]}>{label["Name"]}({Math.round(label["Confidence"] * 100) / 100}%)</p>
          ))
        }
      </div>
    </Layout>
  )
}
