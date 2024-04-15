import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AsciiRenderer, OrbitControls, shaderMaterial } from "@react-three/drei";
import ReactSelect from 'react-select';
import { useEffect, useState, useMemo} from 'react';
import * as THREE from 'three';

function Box () {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial roughness={0.2} metalness={.1} color={'hotpink'}/> 
    </mesh>
  )
}

function TorusKnot(){
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
      vertexShader
    }),
    []
  )
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2))

  return (
    <instancedMesh args={[null, null, 10]} ref={ref}>
      <torusKnotGeometry args={[7, 3, 100, 16]}></torusKnotGeometry>
      <meshPhongMaterial color="tomato" />
      <shaderMaterial attach="material" {...data} />
    </instancedMesh>
  );
};

const fragmentShader = `
  varying vec3 Normal;
  varying vec3 Position;

  uniform vec3 Ka;
  uniform vec3 Kd;
  uniform vec3 Ks;
  uniform vec4 LightPosition;
  uniform vec3 LightIntensity;
  uniform float Shininess;

  vec3 phong() {
    vec3 n = normalize(Normal);
    vec3 s = normalize(vec3(LightPosition) - Position);
    vec3 v = normalize(vec3(-Position));
    vec3 r = reflect(-s, n);

    vec3 ambient = Ka;
    vec3 diffuse = Kd * max(dot(s, n), 0.0);
    vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);

    return LightIntensity * (ambient + diffuse + specular);
  }

  void main() {
    vec3 blue = vec3(0.0, 0.0, 1.0);
    gl_FragColor = vec4(blue*phong(), 1.0);
}`

const vertexShader = `
  varying vec3 Normal;
  varying vec3 Position;

  void main() {
    Normal = normalize(normalMatrix * normal);
    Position = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const ProjectsPage = () => {
  const [onOff, setOnOff] = useState(0)
  const [state, setState] = useState(false)
  useEffect(() => {
    setState(onOff['value']);
  }, [state,onOff]);
  const options = [
    { value: true, label: 'On' },
    { value: false, label: 'Off' }
  ]
  return (
    <>
    <div styles="z-index: 9999">
    <ReactSelect value={onOff} onChange={setOnOff} options={options}/>
    </div>
    <div style={{height:"100vh" , width:"100vw", position: "absolute"}} styles="z-index: 0">

      <Canvas alpha={true} camera={{position: [0, 25, 0] }} styles="z-index: 0" >
        <OrbitControls />
        <color attach="background" args={['black']} />
        {state && <AsciiRenderer fgColor="white" bgColor="transparent"/>}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1}/>
        <TorusKnot />
      </Canvas>
    </div>
    </>
  )
}

export default ProjectsPage;
