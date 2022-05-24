import React, { useRef, useState, useCallback, useEffect } from 'react';
import Cropper from '../components/cropper/Cropper'
import '../css/perspective_fixer.css';
import '../css/App.css';
import '../css/button.css';


//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"
function PerspectiveFixer (props){

  const [cropState, setCropState] = useState()
  const [getImage, setGetImage] = useState(false)
  const cropperRef = useRef()
  const [isCropped, setIsCropped] = useState(false);

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  function setBaseImage(image) {
    props.onSetBaseImage(image);
  }

  const doSomething = async () => {
    if (!isCropped) {
      try {
        const res = await cropperRef.current.done({ preview: true })
        console.log(res)
        props.baseImage.src = document.getElementById("perspective-fixer").toDataURL();
        setBaseImage(props.baseImage);
        setIsCropped(true);
      } catch (e) {
        console.log('error', e)
      }
    }
  }

  function goBack() {
    setIsCropped(false);
    props.onGoBack("SplashScreen");
  }
  
  function handleSceneChange() {
    setBaseImage(props.baseImage);
    setIsCropped(false);
    props.onSceneChange("MainScreen");
  }

  function show() {
    return props.activeScene === "PerspectiveFixer";
  }

  if (show()) {
    return (
      <div className="App">

          <header className="header">

            <div className="header_row">

              <div className = "header_column left">
                <button className="waves-effect waves-light btn-large back-button" id="button-container" onClick={goBack}><i className="material-icons"><span>arrow_back</span></i></button>
              </div>
            
              <div className= "header_column middle" id="title">Normal Map Generator</div>
            
            </div>
          </header> 

          <div className="main_body">
            <div className = "centered">
              <Cropper
                ref={cropperRef}
                image={props.baseImage.src}
                onChange={onChange}
                onDragStop={onDragStop}
                maxWidth={500}
                maxHeight={700}
              />
            </div>
            
            
          
          <div className="BtnBtm">

            <button className="waves-effect waves-light btn-large continue" id="button-container" onClick={doSomething}>Crop</button>
            <button className="waves-effect waves-light btn-large continue" id="button-container" onClick={handleSceneChange}>Continue</button>
          </div>  
          </div>                  
      </div>
    );
  } else {
    return null;
  }
}

export default PerspectiveFixer;