import React, {useState} from 'react';

import '../css/App.css';

import SplashScreen from '../scenes/splash_screen';
import PerspectiveFixer from '../scenes/perspective_fixer';
import MainScreen from '../scenes/main_screen';


const Main = ({ activeScene, goBack, handleSceneChange, baseImage, setBaseImage }) => (
  <React.Fragment>
    <SplashScreen activeScene={activeScene} onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage} onSetBaseImage={setBaseImage} />
    <PerspectiveFixer activeScene={activeScene}  onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage} onSetBaseImage={setBaseImage} />
    <MainScreen activeScene={activeScene}  onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage} onSetBaseImage={setBaseImage} />
  </React.Fragment>
);

function App(props) {

  const [activeScene, setactiveScene] = useState("SplashScreen")
  const [image, setImage] = useState(new Image())

  function handleSceneChange() {
    let { name } = "";
    if (activeScene === "SplashScreen") {
      name = "PerspectiveFixer";
    } else {
      name = "MainScreen";
    }

    setactiveScene(name);
  }

  function goBack() {
    let { name } = "";
    if (activeScene === "MainScreen") {
      name = "PerspectiveFixer";
    } else {
      name = "SplashScreen";
    }

    setactiveScene(name);
  }

  function setBaseImage(image) {
    setImage(image);
  }

  return (
    <div className="App">
      <Main activeScene={activeScene} goBack={goBack} handleSceneChange={handleSceneChange} baseImage={image} setBaseImage={setBaseImage} />
    </div>
  );
}


export default App;
