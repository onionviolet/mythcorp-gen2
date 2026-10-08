import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

/** A private copy of a skinned GLB scene, measured in its posed shape.
 *  A plain `clone(true)` keeps the skin bound to the source bones, and bounds
 *  read before the first render use stale bone matrices, so both studies
 *  that frame the spectre by its size go through here. */
export function fitSpectre(source: THREE.Object3D) {
  const model = cloneSkinned(source);
  model.updateMatrixWorld(true);
  model.traverse((node) => {
    const skinned = node as THREE.SkinnedMesh;
    if (skinned.isSkinnedMesh) skinned.skeleton.update();
  });
  const box = new THREE.Box3().setFromObject(model, true);
  return {
    model,
    size: box.getSize(new THREE.Vector3()),
    center: box.getCenter(new THREE.Vector3()),
  };
}
