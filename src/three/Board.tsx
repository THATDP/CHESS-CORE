import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Arrangement, PieceCode } from './arrangements';
import { roleOf, sideOf } from './arrangements';
import { buildPieceGeometries } from './pieces';
import type { SceneMaterials } from './materials';
import type { PieceRole } from './arrangements';

export const SQUARE_PITCH = 1;
export const SQUARE_SIZE = 0.94;
export const SURFACE_Y = 0.18;
export const BOARD_HALF = 4;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const geometryCache = new Map<PieceRole, THREE.BufferGeometry[]>();
function pieceGeometries(role: PieceRole): THREE.BufferGeometry[] {
  let geometries = geometryCache.get(role);
  if (!geometries) {
    geometries = buildPieceGeometries(role);
    geometryCache.set(role, geometries);
  }
  return geometries;
}

function squarePosition(index: number): [number, number] {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return [col - 3.5, row - 3.5];
}

/* ------------------------------------------------------------------ */

type PieceProps = {
  code: PieceCode;
  index: number;
  materials: SceneMaterials;
  interactive: boolean;
  reducedMotion: boolean;
  delay: number;
  selected: boolean;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
};

function Piece({
  code, index, materials, interactive, reducedMotion, delay, selected, onHover, onSelect,
}: PieceProps) {
  const role = roleOf(code);
  const side = sideOf(code);
  const group = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const [hovered, setHovered] = useState(false);
  const progress = useRef(reducedMotion ? 1 : 0);

  const geometries = useMemo(() => (role ? pieceGeometries(role) : []), [role]);
  const material = side === 'white' ? materials.bone : materials.obsidian;
  const [x, z] = squarePosition(index);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const dt = Math.min(delta, 0.05);
    progress.current = Math.min(1, progress.current + dt * 1.15);
    const local = THREE.MathUtils.clamp((progress.current - delay) / Math.max(0.0001, 1 - delay), 0, 1);
    const eased = easeOutCubic(local);

    lift.current = THREE.MathUtils.damp(lift.current, hovered && interactive ? 0.16 : 0, 9, dt);
    node.position.set(x, SURFACE_Y + (1 - eased) * -1.1 + lift.current, z);
    const scale = 0.5 + 0.5 * eased;
    node.scale.setScalar(scale);
    node.rotation.y = (side === 'black' ? Math.PI : 0) + (hovered && interactive ? 0.12 : 0);
  });

  if (!role) return null;

  return (
    <group
      ref={group}
      position={[x, SURFACE_Y - 1.1, z]}
      rotation={[0, side === 'black' ? Math.PI : 0, 0]}
      onPointerOver={interactive ? (event) => {
        event.stopPropagation();
        setHovered(true);
        onHover(index);
        document.body.style.cursor = 'pointer';
      } : undefined}
      onPointerOut={interactive ? () => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      } : undefined}
      onClick={interactive ? (event) => {
        event.stopPropagation();
        onSelect(index);
      } : undefined}
    >
      {geometries.map((geometry, key) => (
        <mesh
          key={key}
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
        />
      ))}
      {selected && (
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.4, 48]} />
          <meshBasicMaterial color="#3ce6a6" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */

export type BoardProps = {
  materials: SceneMaterials;
  arrangement: Arrangement;
  interactive?: boolean;
  reducedMotion?: boolean;
  selectedSquares?: number[];
  showInlay?: boolean;
};

export function Board({
  materials,
  arrangement,
  interactive = false,
  reducedMotion = false,
  selectedSquares = [],
  showInlay = true,
}: BoardProps) {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const glow = useRef<THREE.Mesh>(null);
  const reveal = useRef(reducedMotion ? 1 : 0);
  const selected = useMemo(() => new Set(selectedSquares), [selectedSquares]);

  const squareGeometry = useMemo(
    () => new RoundedBoxGeometry(SQUARE_SIZE, 0.18, SQUARE_SIZE, 2, 0.028),
    [],
  );
  const frameGeometry = useMemo(() => new RoundedBoxGeometry(9.6, 0.7, 9.6, 4, 0.09), []);
  const plateGeometry = useMemo(() => new RoundedBoxGeometry(8.24, 0.2, 8.24, 2, 0.03), []);

  const squares = useMemo(() => {
    const list: { index: number; x: number; z: number; dark: boolean }[] = [];
    for (let index = 0; index < 64; index += 1) {
      const [x, z] = squarePosition(index);
      list.push({ index, x, z, dark: (Math.floor(index / 8) + (index % 8)) % 2 === 1 });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    reveal.current = Math.min(1, reveal.current + dt * 0.9);
    const eased = easeOutCubic(reveal.current);
    const node = glow.current;
    if (node) {
      const target = hoveredSquare !== null ? 0.3 : 0;
      const material = node.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, target, 10, dt);
      if (hoveredSquare !== null) {
        const [x, z] = squarePosition(hoveredSquare);
        node.position.set(x, SURFACE_Y + 0.004, z);
      }
    }
    return eased;
  });

  return (
    <group>
      {/* Cabinet and playing surface */}
      <mesh geometry={frameGeometry} material={materials.frame} position={[0, -0.37, 0]} castShadow receiveShadow />
      <mesh geometry={plateGeometry} material={materials.plate} position={[0, -0.1, 0]} receiveShadow />

      {/* Squares */}
      {squares.map(({ index, x, z, dark }) => (
        <mesh
          key={index}
          geometry={squareGeometry}
          material={dark ? materials.darkSquare : materials.lightSquare}
          position={[x, 0.09, z]}
          castShadow={false}
          receiveShadow
          onPointerOver={interactive ? (event) => {
            event.stopPropagation();
            setHoveredSquare(index);
            document.body.style.cursor = 'pointer';
          } : undefined}
          onPointerOut={interactive ? () => {
            setHoveredSquare(null);
            document.body.style.cursor = 'auto';
          } : undefined}
          onClick={interactive ? (event) => {
            event.stopPropagation();
          } : undefined}
        />
      ))}

      {/* Emerald inlay framing the field */}
      {showInlay && (
        <group position={[0, 0.012, 0]}>
          <mesh material={materials.inlay} position={[0, 0, -BOARD_HALF - 0.06]}>
            <boxGeometry args={[8.2, 0.014, 0.035]} />
          </mesh>
          <mesh material={materials.inlay} position={[0, 0, BOARD_HALF + 0.06]}>
            <boxGeometry args={[8.2, 0.014, 0.035]} />
          </mesh>
          <mesh material={materials.inlay} position={[-BOARD_HALF - 0.06, 0, 0]}>
            <boxGeometry args={[0.035, 0.014, 8.2]} />
          </mesh>
          <mesh material={materials.inlay} position={[BOARD_HALF + 0.06, 0, 0]}>
            <boxGeometry args={[0.035, 0.014, 8.2]} />
          </mesh>
        </group>
      )}

      {/* Hover glow */}
      {interactive && (
        <mesh ref={glow} position={[0, SURFACE_Y + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[SQUARE_SIZE + 0.06, SQUARE_SIZE + 0.06]} />
          <meshBasicMaterial
            color="#3ce6a6"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Pieces, revealed with a stagger */}
      {arrangement.map((code, index) => {
        if (!code) return null;
        return (
          <Piece
            key={`${index}-${code}`}
            code={code}
            index={index}
            materials={materials}
            interactive={interactive}
            reducedMotion={reducedMotion}
            delay={0.12 + (index / 64) * 0.5}
            selected={selected.has(index)}
            onHover={setHoveredSquare}
            onSelect={() => {
              setHoveredSquare(index);
            }}
          />
        );
      })}
    </group>
  );
}
