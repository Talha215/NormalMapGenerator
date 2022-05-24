import React, { useRef, useState} from 'react';

import '../css/App.css';
import '../css/button.css';
import NrmMapGenCanvas from "../components/norm_map_generator";
import DownloadButton from '../components/download_button';
import UploadButton from '../components/upload_button';


//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function MainScreen (props){

  function handleSceneChange() {
    props.onSceneChange();
  }

  function goBack() {
    props.onGoBack("PerspectiveFixer");
  }

  const generatorRef = useRef()
  const [isImageLoaded, setIsImageLoaded] = useState(0) 

  //Triggers a high resolution render on the high res canvas.
  const renderHighRes = () => {
    generatorRef.current.isRenderHighRes.current = true;
    generatorRef.current.GenerateNormalMap()
    generatorRef.current.isRenderHighRes.current = false;
    generatorRef.current.GenerateNormalMap()
  }

  function show() {
    return props.activeScene === "MainScreen";
  }

  if (show()) {
    return (

      <div className="App">

         <header className="header">
          <div className="header_row">

            <div className = "header_column left">
              <button className="waves-effect waves-light btn-large back-button" id="button-container" onClick={goBack}><i className="material-icons"><span>arrow_back</span></i></button>
            </div>


            <div className = "header_column middle" id="title">Normal Map Generator</div>
          </div>
            
          </header>
        
          <div className = "main_body">
          <div>
              <NrmMapGenCanvas baseImage={props.baseImage} setImageLoaded={setIsImageLoaded} ref={generatorRef}></NrmMapGenCanvas>
          </div>

          <div className="BtnBtm">
            <DownloadButton renderHighRes={renderHighRes} baseImage={props.baseImage}></DownloadButton>
          </div> 


          </div>
      </div>
    );
  } else {
    return null;
  }
}

export default MainScreen;