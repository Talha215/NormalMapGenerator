import React from 'react';

import '../css/splash_screen.css';
import UploadButton from '../components/upload_button';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function SplashScreen(props) {

  function handleSceneChange() {
    props.onSceneChange();
  }

  function setBaseImage(image) {
    props.onSetBaseImage(image);
  }

  function show() {
    return props.activeScene === "SplashScreen";
  }

  function onImageSelect(event){
    
    //Converts the loaded "thing" into an img.
    if (event.target.files && event.target.files[0]) {
      props.baseImage.src = URL.createObjectURL(event.target.files[0]);
      setBaseImage(props.baseImage);
    }

    //onload is used to make sure that the img is fully loaded before any processing.
    props.baseImage.onload = function () {
      handleSceneChange();
    }
  }

 
  if (show()) {
    return (
      <div className="main-container">
        <h2 id="splash-title">Normal Map Generator</h2>
        <p id="splash-text">To begin, upload a texture</p>
        
        
        <div>
          <UploadButton changeFunc={onImageSelect}></UploadButton>
        </div>
      </div>
    );
  } else {
    return null;
  }
  
}

export default SplashScreen;