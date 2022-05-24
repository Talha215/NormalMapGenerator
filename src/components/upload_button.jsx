import React from 'react';

import '../css/button.css';

const UploadButton = (props) => {

  return (
    <label className="waves-effect waves-light btn-large" id="button-container">
      <input style={{ color: props.color }} id="button-display" type="file" accept="image/*" onChange={props.changeFunc} />
      Upload Texture
    </label>
  )
};

export default UploadButton