import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Box(props){

const normalMap = useLoader(TextureLoader, props.normalMap);


  return (
    <mesh rotation={[90, 0, 20]}>
      <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
      <meshStandardMaterial normalMap={normalMap} color="#3b3b3b" roughness="0.33" />
    </mesh>
  );
}