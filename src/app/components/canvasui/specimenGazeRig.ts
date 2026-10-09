import * as THREE from "three";
import type { SpecimenPose } from "../plain/specimenPose";

type TurntableControls = { autoRotateSpeed: number; target: THREE.Vector3 };

function wrapAngle(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * The group that turns the specimen toward the visitor. It sits between the
 * float group and the fitted model, so the float rock still plays on top.
 * `face` slows the turntable to a stop and cancels the camera's orbit angle,
 * so an engaged specimen faces the viewer from wherever the turntable left it.
 * At the default pose it applies no rotation and the full turntable speed.
 */
export function createSpecimenGazeRig() {
  const group = new THREE.Group();
  group.rotation.order = "YXZ";
  let facing = 0;

  function update(camera: THREE.Camera, controls: TurntableControls, turntableSpeed: number, pose: SpecimenPose) {
    const { yaw, pitch, face } = pose.gaze;
    controls.autoRotateSpeed = turntableSpeed * (1 - face);
    const azimuth = Math.atan2(
      camera.position.x - controls.target.x,
      camera.position.z - controls.target.z,
    );
    facing = face < 1e-3 ? azimuth : facing + wrapAngle(azimuth - facing);
    group.rotation.set(-pitch, yaw + face * facing, 0);
  }

  return { group, update };
}
