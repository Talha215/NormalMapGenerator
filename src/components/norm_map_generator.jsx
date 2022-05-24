import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {Canvas as ThreeCanvas} from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader as meshLoader } from '@react-three/fiber'
import * as THREE from 'three';
import Box from "../components/shapes/box"
import HdrFile from "../resources/sky.hdr"
import '../css/norm_map_generator.css';

import SliderWrapper from './slider_wrapper';
import Mesh from './shapes/mesh';

let baseImgMat = null //Stores the unprocessed img.
let srcImgMat = null
let sobelxData = null
let sobelyData = null
let canvas = null
let ctx = null
let canvasData = null //TODO::This step may not be needed.
let imgSize = [0,0]
let orgSize = [0,0]
let dZ = 1
let globalBlurAmnt = 0;

const img = new Image()
const normalMap = new Image()


function NrmMapGenCanvas(props, ref){
    
    // let Caman = window.Caman
    let cv = window.cv //Load opencv.
    
    const RegCanvas = useRef() //React ref to get the canvas.
    const HDCanvas = useRef()
    const isRenderHighRes = useRef(false);

    const [intensity, setIntensity] = useState(50/5000); //Slider State
    const [detail, setDetail] = useState(1); //Slider State
    const [blurAmount, setBlurAmount] = useState(0)
    const [firstRender, setRendered] = useState(true)
    const [model, setModel] = useState(undefined)
    const [modelType, setModelType] = useState("box")


    /**
     * Pretty sure there is a shorter way to write this.
     */
    function getBestSize(){
        let targetSize = 1000;
        if(img.width > img.height && img.width > targetSize){
            // let ratio = img.width/img.height
            let rescaleFactor = img.width / targetSize
            imgSize[0] = img.width / rescaleFactor
            imgSize[1] = img.height / rescaleFactor
        }
        else if(img.height > targetSize){
            let rescaleFactor = img.height / targetSize
            imgSize[0] = img.width / rescaleFactor
            imgSize[1] = img.height / rescaleFactor
        }
        else{
            let rescaleFactor = targetSize / img.width 
            imgSize[0] = img.width * rescaleFactor
            imgSize[1] = img.height * rescaleFactor
        }
    }

    //Generate a normal map from the image loaded on the canvas.
    //TODO::If not fast enough, convert sobels to img data.
    function GenerateNormalMap() {
        if(isRenderHighRes.current){
            canvas = HDCanvas.current
        }
        else{
            canvas = RegCanvas.current
        }
        ctx = canvas.getContext("2d")
        baseImgMat = cv.imread(img) //base img
        srcImgMat = baseImgMat //base img
        orgSize[0] = img.width
        orgSize[1] = img.height

        if(isRenderHighRes.current){
            imgSize[0] = orgSize[0]
            imgSize[1] = orgSize[1]
        }
        else{
            getBestSize()
            let dsize = new cv.Size(imgSize[0], imgSize[1]);
            cv.resize(srcImgMat, srcImgMat, dsize, 0, 0, cv.INTER_AREA);
        }
        

        let sobelxCVMat = new cv.Mat();
        let sobelyCVMat = new cv.Mat();

        //Convert to grayscale.
        cv.cvtColor(srcImgMat, srcImgMat, cv.COLOR_RGB2GRAY, 0);

        //Blur image.
        let ksize = new cv.Size(2, 2);
        let anchor = new cv.Point(-1, -1);
        cv.blur(srcImgMat, srcImgMat, ksize, anchor, cv.BORDER_DEFAULT);

        //Compute sobel in the X direction
        cv.Sobel(srcImgMat, sobelxCVMat, -1, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelxCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, imgSize[0], imgSize[1]);
        sobelxData = canvasData.data.slice();

        //Compute sobel in the Y direction
        cv.Sobel(srcImgMat, sobelyCVMat, -1, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelyCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, imgSize[0], imgSize[1]);
        sobelyData = canvasData.data.slice();

        updateNormalMap()
        // srcImg.delete(); sobelxCVMat.delete(); sobelyCVMat.delete();
    }

    //TODO::Clean this
    dZ = 1.0/ intensity * (1.0 + Math.pow(2.0, detail))
    function updateNormalMap() {
        //Loop through the pixels and calculate the RGB colors. This is where the normal map is "created".
        let dX = 0
        let dY = 0
        let length = 0

        for (let i = 0; i < canvasData.data.length; i += 4) {

            dX = sobelxData[i]
            dY = sobelyData[i]

            length = Math.sqrt(dX * dX + dY * dY + dZ * dZ)
            dX = dX / length;
            dY = dY / length;

            canvasData.data[i] = (dX * 0.5 + 0.5) * 255.0; //red
            canvasData.data[i + 1] = (dY * 0.5 + 0.5) * 255.0; //green
            canvasData.data[i + 2] = (dZ * 255.0); //blue
        }
        ctx.putImageData(canvasData, 0, 0, 0, 0, imgSize[0], imgSize[1])
        blurUpdate()
        normalMap.src = canvas.toDataURL("image/jpeg", 0.5);
    }


    //Blurs the canvas contents.
    function blurUpdate(){
        ctx.filter = `blur(${globalBlurAmnt}px)`;
        ctx.putImageData(canvasData, 0, 0, 0, 0, imgSize[0], imgSize[1])
        ctx.drawImage(canvas, 0, 0);
    }

    //Updates the normal map on slider change.
    function onIntensityChange(event){
        setIntensity(event.target.value);
        updateNormalMap()
    }

    //Updates the normal map on slider change.
    function onLevelChange(event){
        setDetail(event.target.value * -1); 
        updateNormalMap()
    }

    function loadModel(event){
        if (event.target.files && event.target.files[0]) {
        const url = URL.createObjectURL(event.target.files[0]);
        setModel(url)
        setModelType("custom");
        }
    }

    useImperativeHandle(ref, () => ({
        GenerateNormalMap,
        isRenderHighRes
    }), [])

    // Makes sure to update the canvas on intensity change
    useEffect(() => {
        if(firstRender == true){
            img.src = props.baseImage.src;
            GenerateNormalMap()
            setRendered(false);
        }
        updateNormalMap()
     },[intensity, detail, blurAmount])

   

    //HTML elements of this component.
    return (
        <div id="canvas-container">

            <div className="grid_items">
                <div className="grid_item">
                    <canvas id="normal-canvas" ref={RegCanvas} width="250" height="250"></canvas>
                    <canvas id="highres-canvas" ref={HDCanvas} width="250" height="250"></canvas>
                </div>

                <div className="grid_item" id="slider-container">
                    <SliderWrapper name_value="Intensity" min_value={0.00001} max_value={0.08} step_value={0.0001} default_value={0.01} funcforthis={(event) => { onIntensityChange(event) }} />
                    <SliderWrapper name_value="Detail" min_value={-10} max_value={15} step_value={0.1} default_value={1} funcforthis={(event) => { onLevelChange(event) }} />
                    <SliderWrapper name_value="Blur" min_value={0} max_value={13} step_value={0.0001} default_value={0} funcforthis={(event) => { setBlurAmount(event.target.value); globalBlurAmnt = event.target.value; blurUpdate(); }} />
                </div>

                <div className="grid_item" id="three-container">

                    <div id="model-selector-container">
                    <div className="custom-loader">
                        <label className="model-picker waves-effect waves-light" id="top-selector">
                            <input id="button-display" type="file" onChange={loadModel} />
                            Load Custom Model
                        </label>
                    </div>
                        <label className="model-picker waves-effect waves-light"  id="left-selector" onClick={() => { setModelType("box") }}>Cube</label>
                        <label className="model-picker waves-effect waves-light" id="center-selector" onClick={() => { setModelType("sphere") }}>Sphere</label>
                        <label className="model-picker waves-effect waves-light"  id="right-selector" onClick={() => { setModelType("torus") }}>Torus</label>
                    </div>


                    <div className="three-canvas">
                        <ThreeCanvas>
                            <OrbitControls enableZoom={true} />
                            <pointLight position={[-20, 30, 10]} />
                            <pointLight position={[30, -40, 50]} />
                            <pointLight position={[20, -10, -30]} />
                            <Suspense fallback={null}>
                                <Mesh modelType={modelType} model={model} normalMap={normalMap.src}></Mesh>
                                <Environment
                                    background={true}
                                    files={HdrFile} />
                            </Suspense>
                        </ThreeCanvas>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(NrmMapGenCanvas)
