import React, { Component } from "react";
import { Image, Transformation } from 'cloudinary-react';



class CloudinaryUploadWidget extends Component {
    
    componentDidMount() {
        const myWidget = window.cloudinary.createUploadWidget({
          cloudName: 'dlzj22j8a',
          uploadPreset: 'imgUploadPreset'
        }, (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
          }
        });
        document.getElementById('upload_widget').addEventListener('click', () => {
          myWidget.open();
        }, false);
      }

      render() {
        return (
        <div>
          <button id="upload_widget" className="cloudinary-button">
            Upload
          </button>
          <Image cloudName="dlzj22j8a" publicId="your-public-id">
        <Transformation width="300" crop="scale" />
      </Image>
          </div>
          
        );
      }
      
}

export default CloudinaryUploadWidget;
