import * as THREE from 'three';
import type { PieceRole } from './arrangements';
import {
  BISHOP, KING, KNIGHT_OUTLINE, PAWN, QUEEN, ROOK,
} from './pieceProfiles';
import type { Control } from './pieceProfiles';

export {
  BISHOP, KING, KNIGHT_OUTLINE, PAWN, QUEEN, ROOK,
} from './pieceProfiles';
export type { Control } from './pieceProfiles';

/**
 * Smooth lathe profile from a handful of control points.
 * Points are [radius, height]; the spline keeps the silhouette continuous.
 */
function latheProfile(control: Control[], segments = 56, samples = 84): THREE.LatheGeometry {
  const points = control.map(([x, y]) => new THREE.Vector2(Math.max(0, x), y));
  const curve = new THREE.SplineCurve(points);
  const sampled = curve
    .getPoints(samples)
    .map((p) => new THREE.Vector2(Math.max(0, p.x), Math.max(0, p.y)));
  const geometry = new THREE.LatheGeometry(sampled, segments);
  geometry.computeVertexNormals();
  return geometry;
}

function box(width: number, height: number, depth: number, x: number, y: number, z: number, rotationY = 0): THREE.BoxGeometry {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  if (rotationY) geometry.rotateY(rotationY);
  geometry.translate(x, y, z);
  return geometry;
}

function sphere(radius: number, x: number, y: number, z: number, widthSegments = 20, heightSegments = 14): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  geometry.translate(x, y, z);
  return geometry;
}

function torus(radius: number, tube: number, x: number, y: number, z: number): THREE.TorusGeometry {
  const geometry = new THREE.TorusGeometry(radius, tube, 12, 48);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(x, y, z);
  return geometry;
}

function knightGeometry(): THREE.ExtrudeGeometry {
  const curve = new THREE.SplineCurve(KNIGHT_OUTLINE.map(([x, y]) => new THREE.Vector2(x, y)));
  const outline = curve.getPoints(140);
  const shape = new THREE.Shape();
  shape.moveTo(outline[0].x, outline[0].y);
  for (let i = 1; i < outline.length; i += 1) shape.lineTo(outline[i].x, outline[i].y);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.20,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 10,
  });
  geometry.translate(0, 0, -0.10);
  geometry.computeVertexNormals();
  return geometry;
}

/** Builds the geometry list for a piece. Heights range from 0.79 to ~1.62. */
export function buildPieceGeometries(role: PieceRole): THREE.BufferGeometry[] {
  switch (role) {
    case 'pawn':
      return [latheProfile(PAWN)];
    case 'rook': {
      const geometry = latheProfile(ROOK);
      const merlons: THREE.BufferGeometry[] = [];
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        merlons.push(box(0.115, 0.13, 0.075, Math.cos(angle) * 0.225, 1.06, Math.sin(angle) * 0.225, -angle));
      }
      return [geometry, ...merlons];
    }
    case 'bishop':
      return [
        latheProfile(BISHOP),
        sphere(0.062, 0, 1.245, 0),
        torus(0.20, 0.018, 0, 0.76, 0),
      ];
    case 'queen': {
      const geometry = latheProfile(QUEEN);
      const crown: THREE.BufferGeometry[] = [sphere(0.075, 0, 1.42, 0), sphere(0.045, 0, 1.50, 0)];
      for (let i = 0; i < 5; i += 1) {
        const angle = (i / 5) * Math.PI * 2;
        crown.push(sphere(0.05, Math.cos(angle) * 0.265, 1.235, Math.sin(angle) * 0.265, 14, 10));
      }
      crown.push(torus(0.275, 0.016, 0, 1.19, 0));
      return [geometry, ...crown];
    }
    case 'king':
      return [
        latheProfile(KING),
        box(0.06, 0.22, 0.06, 0, 1.51, 0),
        box(0.17, 0.06, 0.06, 0, 1.53, 0),
        torus(0.285, 0.016, 0, 1.15, 0),
      ];
    case 'knight':
      return [knightGeometry()];
    default:
      return [];
  }
}

/** Approximate height of each role, used for placement and scaling. */
export const PIECE_HEIGHT: Record<PieceRole, number> = {
  pawn: 0.79, rook: 1.13, bishop: 1.31, knight: 0.99, queen: 1.55, king: 1.62,
};
