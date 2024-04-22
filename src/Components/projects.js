import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AsciiRenderer, OrbitControls } from "@react-three/drei";
import { useState, useMemo} from 'react';
import * as THREE from 'three';
import tone from '../threeTone.jpg'

const texture = await new THREE.TextureLoader().loadAsync(tone)
texture.minFilter = texture.magFilter = THREE.NearestFilter

function Box () {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial roughness={0.2} metalness={.1} color={'hotpink'}/> 
    </mesh>
  )
}

function TorusOutline(){
  const ref = React.useRef()
  const data = useMemo(
    () => ({
      uniforms: {
        Ka: { value: new THREE.Vector3(1, 1, 1) },
        Kd: { value: new THREE.Vector3(1, 1, 1) },
        Ks: { value: new THREE.Vector3(1, 1, 1) },
        LightIntensity: { value: new THREE.Vector4(0.5, 0.5, 0.5, 1.0) },
        LightPosition: { value: new THREE.Vector4(0.0, 2000.0, 0.0, 1.0) },
        Shininess: { value: 200.0 }
      },
      fragmentShader,
      vertexShader,
      side: THREE.BackSide
    }),
    []
  )
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2))

  return (
    <instancedMesh args={[null, null, 10]} ref={ref}>
      <torusKnotGeometry args={[7, 3.2, 100, 16]}></torusKnotGeometry>
      <shaderMaterial attach="material" {...data} />
    </instancedMesh>
  );
};

function TorusKnotToon(){
  const ref = React.useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2))
  return (
    <instancedMesh args={[null, null, 10]} ref={ref}>
      <torusKnotGeometry args={[7, 3, 100, 16]}></torusKnotGeometry>
      <meshToonMaterial color="white" gradientMap={texture}/>
    </instancedMesh>
  );
};

function TorusKnot(){
  const ref = React.useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2))
  return (
    <instancedMesh args={[null, null, 10]} ref={ref}>
      <torusKnotGeometry args={[7, 3, 100, 16]}></torusKnotGeometry>
      <meshPhongMaterial color="tomato" />
    </instancedMesh>
  );
}

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(1,1,1,0);
}`

const vertexShader = `
  void main() {
    vec3 newPosition = position + normal * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

export const ProjectsPage = () => {
  const [toonOn, setToonOn] = useState(false)
  const [asciiOn, setAsciiOn] = useState(false)

  const toonChange = () => {
    setToonOn(!toonOn)
  }
  const AsciiChange = () => {
    setAsciiOn(!asciiOn)
  }

  return (
    <>
    <div styles="z-index: 9999">
    <label>
      <input 
        type = "checkbox"
        checked={toonOn}
        onChange={toonChange} 
      />
      Toon
    </label>
    <label>
      <input 
        type = "checkbox"
        checked={asciiOn}
        onChange={AsciiChange} 
      />
      Ascii
    </label>
    </div>
    <div style={{height:"100vh" , width:"100vw", position: "absolute"}} styles="z-index: 0">

      <Canvas alpha={true} camera={{position: [0, 25, 0] }} styles="z-index: 0" >
        <OrbitControls />
        <color attach="background" args={['black']} />
        {asciiOn && <AsciiRenderer fgColor="white" bgColor="transparent"/>}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1}/>
        {toonOn && <TorusKnotToon />}
        {toonOn && <TorusOutline/>}
        {!toonOn && <TorusKnot/>}
      </Canvas>
    </div>
    </>
  )
}

export default ProjectsPage;
