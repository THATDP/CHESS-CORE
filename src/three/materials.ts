import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { marbleTexture, microSurfaceTexture, woodTexture } from './textures';

export type SceneMaterials = {
  obsidian: THREE.MeshPhysicalMaterial;
  bone: THREE.MeshPhysicalMaterial;
  ghost: THREE.MeshStandardMaterial;
  frame: THREE.MeshStandardMaterial;
  plate: THREE.MeshStandardMaterial;
  lightSquare: THREE.MeshStandardMaterial;
  darkSquare: THREE.MeshStandardMaterial;
  inlay: THREE.MeshStandardMaterial;
  ring: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
};

/**
 * Shared PBR materials. Built once per canvas; disposed with the canvas.
 * Every surface is procedural, so the scene needs no downloaded assets.
 */
export function useSceneMaterials(): SceneMaterials {
  const materials = useMemo<SceneMaterials>(() => {
    const micro = microSurfaceTexture(512);
    const wood = woodTexture({ repeat: 1 });
    const boneMarble = marbleTexture({
      base: '#e7e0d1', vein: 'rgba(112,104,88,', blotch: 'rgba(176,166,144,', seed: 5,
    });
    const charcoalMarble = marbleTexture({
      base: '#15191d', vein: 'rgba(150,172,178,', blotch: 'rgba(58,70,74,', seed: 9, veins: 36,
    });

    const obsidian = new THREE.MeshPhysicalMaterial({
      color: '#15191d',
      metalness: 0.55,
      roughness: 0.26,
      roughnessMap: micro,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.25,
    });

    const bone = new THREE.MeshPhysicalMaterial({
      color: '#e9e2d2',
      metalness: 0.04,
      roughness: 0.3,
      roughnessMap: micro,
      clearcoat: 0.75,
      clearcoatRoughness: 0.24,
      envMapIntensity: 0.95,
    });

    const ghost = new THREE.MeshStandardMaterial({
      color: '#101a1c',
      metalness: 0.5,
      roughness: 0.32,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      envMapIntensity: 0.8,
      side: THREE.DoubleSide,
    });

    const frame = new THREE.MeshStandardMaterial({
      map: wood,
      color: '#b99b7c',
      metalness: 0.14,
      roughness: 0.42,
      envMapIntensity: 0.75,
    });

    const plate = new THREE.MeshStandardMaterial({
      color: '#0e1216',
      metalness: 0.35,
      roughness: 0.5,
      envMapIntensity: 0.5,
    });

    const lightSquare = new THREE.MeshStandardMaterial({
      map: boneMarble,
      color: '#fffaf0',
      metalness: 0.06,
      roughness: 0.28,
      envMapIntensity: 0.9,
    });

    const darkSquare = new THREE.MeshStandardMaterial({
      map: charcoalMarble,
      color: '#b9c6c4',
      metalness: 0.12,
      roughness: 0.3,
      envMapIntensity: 0.85,
    });

    const inlay = new THREE.MeshStandardMaterial({
      color: '#0a241a',
      emissive: '#2fe8a4',
      emissiveIntensity: 1.5,
      metalness: 0.3,
      roughness: 0.4,
    });

    const ring = new THREE.MeshStandardMaterial({
      color: '#0d1216',
      metalness: 0.9,
      roughness: 0.28,
      envMapIntensity: 1.15,
      emissive: '#1f8f68',
      emissiveIntensity: 0.3,
    });

    const floor = new THREE.MeshStandardMaterial({
      color: '#07090c',
      metalness: 0.82,
      roughness: 0.27,
      envMapIntensity: 0.9,
    });

    return {
      obsidian, bone, ghost, frame, plate, lightSquare, darkSquare, inlay, ring, floor,
    };
  }, []);

  useEffect(() => () => {
    Object.values(materials).forEach((material) => {
      const maybeTextured = material as THREE.MeshStandardMaterial;
      maybeTextured.map?.dispose();
      maybeTextured.roughnessMap?.dispose();
      material.dispose();
    });
  }, [materials]);

  return materials;
}
