import React from "react";
import { useMemo } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Mesh(props) {

const normalMap = useLoader(TextureLoader, props.normalMap);

    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    const model = useLoader(OBJLoader, props.model)

    const geometry = useMemo(() => {
        let g;
        model.traverse((c) => {
          if (c.type === "Mesh") {
            const _c = c;
            g = _c.geometry;
          }
        });
        return g;
      }, [model]);


    if(props.modelType === "box"){
        normalMap.repeat.set(1,1)
        return(
        <mesh rotation={[90, 0, 20]}>
            <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
            <meshStandardMaterial normalMap={normalMap} color="#3b3b3b" roughness="0.33" />
        </mesh>
        );
    }
    else if(props.modelType === "sphere"){
        normalMap.repeat.set(4,4)
        return(
        <mesh rotation={[90, 0, 20]}>
            <sphereBufferGeometry attach="geometry" args={[3]} />
            <meshStandardMaterial normalMap={normalMap} color="#3b3b3b" roughness="0.33" />
        </mesh>
        )
    }
    else if(props.modelType === "torus"){
        normalMap.repeat.set(8,8)
        return(
        <mesh rotation={[90, 0, 20]}>
            <torusBufferGeometry attach="geometry" args={[2, 1, 16, 40]} />
            <meshStandardMaterial normalMap={normalMap} color="#3b3b3b" roughness="0.33" />
        </mesh>
        )
    }
    else{
        normalMap.repeat.set(8,8)
        return (
            <mesh geometry={geometry}>
                <meshStandardMaterial map={normalMap} normalMap={normalMap} color="#3b3b3b" roughness="0.33"/>
            </mesh >
        )
    }
}
