import React, {  } from 'react';

import '../css/button.css';

export default function DownloadButton(props) {

  function download_image() {
    
    props.renderHighRes() //This function gets passed in as a prop. When called, it triggers a high res render.
    var canvas = document.getElementById("highres-canvas");
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "NormalMap.png";
    anchor.click();
    anchor.href = props.baseImage.src;
    anchor.download = "Diffuse.png"
    anchor.click()
  }

  return (
    <label className="waves-effect waves-light btn-large" id="button-container" onClick={download_image}>
      Download Image
    </label>
  )
}