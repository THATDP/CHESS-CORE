import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, SMAA, Vignette } from '@react-three/postprocessing';
import { arrangements } from './arrangements';
import type { Arrangement } from './arrangements';
import { buildPieceGeometries } from './pieces';
import { useSceneMaterials } from './materials';
import type { SceneMaterials } from './materials';
import { buildEnvironmentScene } from './environment';
import { glowTexture, gridTexture, mulberry32, shaftTexture } from './textures';
import { Board } from './Board';
import type { QualityTier } from './quality';
import type { PieceRole } from './arrangements';

export type SceneVariant = 'hero' | 'board' | 'ambient' | 'minimal';

export type CameraPreset = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

export const cameraPresets: Record<SceneVariant, CameraPreset> = {
  hero: { position: [6.8, 4.2, 9.6], target: [0.2, 0.4, -0.2], fov: 36 },
  board: { position: [0.4, 9.8, 10.2], target: [0, 0, 0.2], fov: 35 },
  ambient: { position: [5.2, 3.1, 7.6], target: [0, 1.35, 0], fov: 40 },
  minimal: { position: [0, 2.6, 7.8], target: [0, 1.4, 0], fov: 38 },
};

const BOARD_OFFSET: Record<SceneVariant, [number, number, number]> = {
  hero: [1.9, 0, -0.6],
  board: [0, 0, 0],
  ambient: [0, 0, 0],
  minimal: [0, 0, 0],
};

/* ------------------------------------------------------------------ */
/* Lighting / environment                                              */
/* ------------------------------------------------------------------ */

function EnvironmentSetup() {
  const gl = useThree((state) => state.gl);

  const environment = useMemo(() => {
    try {
      const pmrem = new THREE.PMREMGenerator(gl);
      const envScene = buildEnvironmentScene();
      const target = pmrem.fromScene(envScene, 0.06);
      pmrem.dispose();
      return target.texture as THREE.Texture;
    } catch {
      // Alguns contextos (SVG canvas, GPUs sem suporte a float targets) não
      // conseguem pré-filtrar o ambiente; a cena segue com as luzes diretas.
      return null;
    }
  }, [gl]);

  useEffect(() => () => { environment?.dispose(); }, [environment]);

  return environment ? <primitive object={environment} attach="environment" /> : null;
}

function Lights({ quality }: { quality: QualityTier }) {
  const shadows = quality !== 'low';
  const mapSize: [number, number] = quality === 'high' ? [2048, 2048] : [1024, 1024];
  return (
    <>
      <ambientLight intensity={0.22} color="#a9bfb2" />
      <hemisphereLight args={['#20302a', '#04060a', 0.32]} />
      <spotLight
        position={[7.5, 11.5, 6.5]}
        angle={0.5}
        penumbra={1}
        intensity={3.6}
        color="#fff1da"
        decay={0}
        castShadow={shadows}
        shadow-mapSize={mapSize}
        shadow-bias={-0.00012}
        shadow-camera-near={3}
        shadow-camera-far={36}
      />
      <spotLight
        position={[-9.5, 5.5, -7.5]}
        angle={0.75}
        penumbra={1}
        intensity={1.8}
        color="#2fe8a4"
        decay={0}
      />
      <directionalLight position={[-6, 4.5, 7.5]} intensity={0.4} color="#8fa8bd" />
      <pointLight position={[3.6, 1.5, 6.8]} intensity={0.75} color="#ffd0a0" decay={0} distance={18} />
      <pointLight position={[-4.5, 0.8, -5.5]} intensity={0.5} color="#2fe8a4" decay={0} distance={16} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

/**
 * Em telas estreitas o tabuleiro precisa ser reenquadrado: a câmera recua e
 * o alvo se desloca para o lado do tabuleiro, mantendo a composição.
 */
function useResponsivePreset(preset: CameraPreset, boardOffsetX: number): CameraPreset {
  const size = useThree((state) => state.size);
  const aspect = size.width / Math.max(1, size.height);

  return useMemo(() => {
    const t = THREE.MathUtils.clamp((aspect - 0.45) / 0.75, 0, 1);
    const pull = THREE.MathUtils.lerp(2.4, 1, t);
    const shift = boardOffsetX * (1 - t);
    const target = new THREE.Vector3(
      preset.target[0] + shift,
      preset.target[1],
      preset.target[2],
    );
    const position = target.clone().add(
      new THREE.Vector3(
        preset.position[0] - preset.target[0],
        preset.position[1] - preset.target[1],
        preset.position[2] - preset.target[2],
      ).multiplyScalar(pull),
    );
    return {
      position: [position.x, position.y, position.z],
      target: [target.x, target.y, target.z],
      fov: preset.fov + (1 - t) * 6,
    };
  }, [preset, aspect, boardOffsetX]);
}

function CameraRig({ preset, enabled }: { preset: CameraPreset; enabled: boolean }) {
  const camera = useThree((state) => state.camera);
  const pointer = useThree((state) => state.pointer);
  const base = useMemo(() => new THREE.Vector3(...preset.position), [preset]);
  const target = useMemo(() => new THREE.Vector3(...preset.target), [preset]);
  const desired = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame(() => {
    const nextPosition = desired.current;
    nextPosition.copy(base);
    if (enabled) {
      nextPosition.x += pointer.x * 1.15;
      nextPosition.y += -pointer.y * 0.75;
    }
    camera.position.lerp(nextPosition, 0.045);
    const nextLook = look.current;
    nextLook.copy(target);
    if (enabled) {
      nextLook.x += pointer.x * 0.3;
      nextLook.y += -pointer.y * 0.15;
    }
    camera.lookAt(nextLook);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

function Dust({ quality, reducedMotion }: { quality: QualityTier; reducedMotion: boolean }) {
  const count = quality === 'high' ? 150 : quality === 'medium' ? 90 : 42;
  const points = useRef<THREE.Points>(null);
  const texture = useMemo(() => glowTexture(128, 'rgba(255,255,255,1)'), []);

  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count);
    const random = mulberry32(1337);
    for (let i = 0; i < count; i += 1) {
      const y = random() * 7 - 0.6;
      positions[i * 3] = (random() - 0.5) * 20;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (random() - 0.5) * 20;
      base[i] = y;
    }
    return { positions, base };
  }, [count]);

  useFrame((state) => {
    const node = points.current;
    if (!node) return;
    const time = state.clock.elapsedTime;
    node.rotation.y = time * 0.018;
    if (reducedMotion) return;
    const attribute = node.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      array[i * 3 + 1] = base[i] + Math.sin(time * 0.35 + i * 0.7) * 0.45;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={2.4}
        sizeAttenuation
        map={texture}
        color="#9fe8c4"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GridFloor() {
  const texture = useMemo(() => gridTexture(1024, 8), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.73, 0]}>
      <planeGeometry args={[64, 64]} />
      <meshBasicMaterial map={texture} transparent opacity={0.42} depthWrite={false} />
    </mesh>
  );
}

function Ring({
  radius, tube = 0.05, position, speed = 0.06, materials, reducedMotion,
}: {
  radius: number; tube?: number; position: [number, number, number]; speed?: number;
  materials: SceneMaterials; reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });
  return (
    <mesh ref={ref} position={position} material={materials.ring}>
      <torusGeometry args={[radius, tube, 16, 128]} />
    </mesh>
  );
}

function GhostPiece({
  role, position, scale, materials, reducedMotion, speed = 0.12,
}: {
  role: PieceRole; position: [number, number, number]; scale: number;
  materials: SceneMaterials; reducedMotion: boolean; speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const geometries = useMemo(() => buildPieceGeometries(role), [role]);
  const seed = useMemo(() => position[0] * 0.7 + position[2] * 0.3, [position]);

  useFrame((state) => {
    const node = ref.current;
    if (!node || reducedMotion) return;
    node.rotation.y = state.clock.elapsedTime * speed;
    node.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + seed) * 0.3;
  });

  return (
    <group ref={ref} position={position} scale={scale} rotation={[0, 0.4, 0]}>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={materials.ghost} />
      ))}
    </group>
  );
}

function LightShafts({ reducedMotion }: { reducedMotion: boolean }) {
  const texture = useMemo(() => shaftTexture(128, 512, '255,240,214'), []);
  const second = useMemo(() => shaftTexture(128, 512, '61,232,168'), []);
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.02 - 0.5;
    }
  });
  return (
    <group ref={group} position={[2.5, 5.4, -2.5]} rotation={[-0.35, 0.15, -0.5]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[7, 15]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[3.4, -0.6, -0.6]} rotation={[0, 0.35, 0.12]}>
        <planeGeometry args={[3.4, 15]} />
        <meshBasicMaterial
          map={second}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FloorGlow() {
  const texture = useMemo(() => glowTexture(256, 'rgba(46,226,164,1)'), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
      <planeGeometry args={[17, 17]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Floor({ materials }: { materials: SceneMaterials }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.76, 0]} receiveShadow material={materials.floor}>
        <circleGeometry args={[40, 72]} />
      </mesh>
      <GridFloor />
      <FloorGlow />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop compositions                                               */
/* ------------------------------------------------------------------ */

function LoosePiece({
  role, material, position, scale = 1, rotation = [0, 0, 0], reducedMotion = false, delay = 0.2,
}: {
  role: PieceRole; material: THREE.Material; position: [number, number, number]; scale?: number;
  rotation?: [number, number, number]; reducedMotion?: boolean; delay?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const geometries = useMemo(() => buildPieceGeometries(role), [role]);
  const progress = useRef(reducedMotion ? 1 : 0);

  useFrame((_, delta) => {
    const node = ref.current;
    if (!node) return;
    const dt = Math.min(delta, 0.05);
    progress.current = Math.min(1, progress.current + dt * 0.9);
    const local = THREE.MathUtils.clamp((progress.current - delay) / Math.max(0.0001, 1 - delay), 0, 1);
    const eased = 1 - Math.pow(1 - local, 3);
    node.scale.setScalar(scale * (0.4 + 0.6 * eased));
    node.position.y = position[1] + (1 - eased) * -1.4;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={material} castShadow receiveShadow />
      ))}
    </group>
  );
}

function HeroBackdrop({
  materials, reducedMotion,
}: {
  materials: SceneMaterials; reducedMotion: boolean;
}) {
  return (
    <group>
      <Ring radius={4.4} position={[0.5, 2.6, -11]} speed={0.05} materials={materials} reducedMotion={reducedMotion} />
      <Ring radius={6.4} tube={0.04} position={[-2.5, 3.2, -15]} speed={-0.035} materials={materials} reducedMotion={reducedMotion} />
      <GhostPiece role="knight" position={[-8.2, 1.4, -7.5]} scale={3.4} materials={materials} reducedMotion={reducedMotion} speed={0.1} />
      <GhostPiece role="queen" position={[8.6, 2.2, -9]} scale={4.2} materials={materials} reducedMotion={reducedMotion} speed={-0.08} />
      <GhostPiece role="bishop" position={[12.4, 0.9, -3.2]} scale={2.4} materials={materials} reducedMotion={reducedMotion} speed={0.14} />
      {/* Peças soltas no piso: quebram a simetria e dão escala à cena. */}
      <LoosePiece role="knight" material={materials.obsidian} position={[-4.9, -0.72, 3.4]} scale={2.9} rotation={[0, 0.7, 0]} reducedMotion={reducedMotion} delay={0.15} />
      <LoosePiece role="rook" material={materials.obsidian} position={[6.6, -0.72, 2.4]} scale={1.25} rotation={[0, -0.4, 0]} reducedMotion={reducedMotion} delay={0.45} />
      <LoosePiece role="pawn" material={materials.bone} position={[-3.4, -0.44, 0.9]} scale={1.05} rotation={[0, 0.4, Math.PI / 2]} reducedMotion={reducedMotion} delay={0.6} />
      <LightShafts reducedMotion={reducedMotion} />
    </group>
  );
}

function BoardBackdrop({
  materials, reducedMotion,
}: {
  materials: SceneMaterials; reducedMotion: boolean;
}) {
  return (
    <group>
      <Ring radius={3.6} position={[0, 2.4, -10]} speed={0.04} materials={materials} reducedMotion={reducedMotion} />
      <GhostPiece role="rook" position={[-7.6, 1.1, -6.4]} scale={2.8} materials={materials} reducedMotion={reducedMotion} speed={0.09} />
      <GhostPiece role="knight" position={[7.8, 1.6, -7.2]} scale={3.1} materials={materials} reducedMotion={reducedMotion} speed={-0.07} />
    </group>
  );
}

function AmbientBackdrop({
  materials, reducedMotion,
}: {
  materials: SceneMaterials; reducedMotion: boolean;
}) {
  const pieces = useMemo(() => ([
    { role: 'knight' as PieceRole, position: [-3.2, 1.5, -1.2] as [number, number, number], scale: 1.05 },
    { role: 'pawn' as PieceRole, position: [2.9, 2.3, -2.4] as [number, number, number], scale: 1.4 },
    { role: 'bishop' as PieceRole, position: [3.6, 0.7, 1.4] as [number, number, number], scale: 0.85 },
    { role: 'rook' as PieceRole, position: [-4.1, 2.8, 0.6] as [number, number, number], scale: 0.9 },
  ]), []);
  return (
    <group>
      <Ring radius={2.6} position={[0, 1.8, -5.5]} speed={0.05} materials={materials} reducedMotion={reducedMotion} />
      <Ring radius={4.2} tube={0.035} position={[-1.5, 2.2, -8]} speed={-0.03} materials={materials} reducedMotion={reducedMotion} />
      {pieces.map((piece) => (
        <GhostPiece
          key={piece.role}
          role={piece.role}
          position={piece.position}
          scale={piece.scale}
          materials={materials}
          reducedMotion={reducedMotion}
          speed={0.1}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Post-processing                                                     */
/* ------------------------------------------------------------------ */

function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.62} luminanceThreshold={0.72} luminanceSmoothing={0.3} />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.2} darkness={0.82} />
      <SMAA />
    </EffectComposer>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export type SceneProps = {
  variant?: SceneVariant;
  arrangement?: Arrangement;
  interactive?: boolean;
  quality?: QualityTier;
  reducedMotion?: boolean;
  selectedSquares?: number[];
};

export function Scene({
  variant = 'hero',
  arrangement = arrangements.hero,
  interactive = false,
  quality = 'high',
  reducedMotion = false,
  selectedSquares = [],
}: SceneProps) {
  const materials = useSceneMaterials();
  const boardOffset = BOARD_OFFSET[variant];
  const preset = useResponsivePreset(cameraPresets[variant], boardOffset[0]);
  const withBoard = variant === 'hero' || variant === 'board';

  return (
    <>
      <color attach="background" args={['#05070a']} />
      <fogExp2 attach="fog" args={['#05070a', variant === 'minimal' ? 0.02 : 0.028]} />

      <EnvironmentSetup />
      <CameraRig preset={preset} enabled={!reducedMotion} />
      <Lights quality={quality} />

      {withBoard && (
        <group position={boardOffset}>
          <Board
            materials={materials}
            arrangement={arrangement}
            interactive={interactive}
            reducedMotion={reducedMotion}
            selectedSquares={selectedSquares}
          />
        </group>
      )}

      {variant === 'hero' && <Floor materials={materials} />}
      {variant === 'board' && <Floor materials={materials} />}
      {variant === 'hero' && <HeroBackdrop materials={materials} reducedMotion={reducedMotion} />}
      {variant === 'board' && <BoardBackdrop materials={materials} reducedMotion={reducedMotion} />}
      {variant === 'ambient' && <AmbientBackdrop materials={materials} reducedMotion={reducedMotion} />}

      <Dust quality={quality} reducedMotion={reducedMotion} />
      {quality !== 'low' && <Effects />}
    </>
  );
}
