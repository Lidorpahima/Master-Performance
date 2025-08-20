import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, PresentationControls, Stage } from '@react-three/drei';
import { Box, Grid, Typography } from '@mui/material';

const Car = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  
  // Scale up the car model
  scene.scale.set(2, 2, 2);
  
  // Center the model
  scene.position.set(0, -0.5, 0);
  
  return <primitive object={scene} />;
};

const ModelSelector3D = () => {
  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Canvas 
            camera={{ position: [6, 3, 6], fov: 40 }}
            style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2c2c2c)' }}
          >
            <Suspense fallback={null}>
              <Stage environment="sunset" intensity={0.5} contactShadow shadows>
                <PresentationControls
                  global
                  rotation={[0, -Math.PI / 4, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                  config={{ mass: 2, tension: 500 }}
                  snap={{ mass: 4, tension: 1500 }}
                >
                  <Car modelPath="/models/car.glb" />
                </PresentationControls>
              </Stage>
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={10}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModelSelector3D;