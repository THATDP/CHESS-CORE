import * as THREE from 'three';

/**
 * Procedural studio environment. Instead of downloading an HDR, the scene
 * builds a small "room" of emissive panels and pre-filters it with PMREM.
 * The result is dramatic streaked reflections on polished pieces, with no
 * network dependency.
 */
function panel(
  width: number,
  height: number,
  color: THREE.ColorRepresentation,
  intensity: number,
  position: [number, number, number],
): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  material.color = new THREE.Color(color).multiplyScalar(intensity);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(...position);
  mesh.lookAt(0, 0, 0);
  return mesh;
}

export function buildEnvironmentScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#04060a');

  // Warm key overhead, slightly to the right.
  scene.add(panel(7, 7, '#fff1da', 5.5, [6, 9, 5]));
  // Cool, dim fill from the left.
  scene.add(panel(9, 9, '#9fb8cc', 1.1, [-8, 4, -2]));
  // Emerald strip behind — the brand rim light.
  scene.add(panel(6, 1.6, '#2fe8a4', 3.2, [-5, 3.2, -8]));
  // Soft back rim to separate pieces from the dark.
  scene.add(panel(8, 3, '#ffffff', 1.6, [1, 5, -10]));
  // Floor bounce so undersides are not dead black.
  scene.add(panel(10, 10, '#16211d', 0.9, [0, -7, 0]));
  // A narrow warm accent low in front, like a practical lamp.
  scene.add(panel(2.5, 1.2, '#ffd3a1', 2.4, [3, 1.1, 7]));

  return scene;
}
