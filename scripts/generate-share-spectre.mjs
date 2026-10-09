import { readFile, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const source = await readFile(new URL('../public/spectre.glb', import.meta.url));
const jsonLength = source.readUInt32LE(12);
const document = JSON.parse(source.subarray(20, 20 + jsonLength).toString());
for (const mesh of document.meshes) for (const primitive of mesh.primitives) delete primitive.material;
delete document.materials;
delete document.textures;
delete document.images;
const json = Buffer.from(JSON.stringify(document).padEnd(Math.ceil(JSON.stringify(document).length / 4) * 4, ' '));
const bin = source.subarray(20 + jsonLength);
const clean = Buffer.alloc(20 + json.length + bin.length);
source.copy(clean, 0, 0, 12);
clean.writeUInt32LE(clean.length, 8);
clean.writeUInt32LE(json.length, 12);
clean.writeUInt32LE(0x4e4f534a, 16);
json.copy(clean, 20);
bin.copy(clean, 20 + json.length);
const gltf = await new GLTFLoader().parseAsync(clean.buffer, '');
const model = clone(gltf.scene);
/** A three-quarter turn, head toward the title: head-on, the spectre reads as a block on legs. */
const yawDegrees = Number(process.env.SHARE_YAW ?? -35);
model.rotation.y = yawDegrees * Math.PI / 180;
model.updateMatrixWorld(true);
model.traverse(node => {
  if (node.isSkinnedMesh) node.skeleton.update();
  if (node.isMesh) node.material.side = THREE.DoubleSide;
});
const box = new THREE.Box3().setFromObject(model, true);
const center = box.getCenter(new THREE.Vector3());
const size = box.getSize(new THREE.Vector3());
const ray = new THREE.Raycaster();
const samples = [];
const rows = 76;
const cell = size.y / rows;
const cols = Math.max(58, Math.ceil(size.x / cell) + 2);
const width = cell * cols;
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    ray.set(new THREE.Vector3(center.x + ((x + 0.5) / cols - 0.5) * width, box.max.y - (y + 0.5) / rows * size.y, box.max.z + size.z), new THREE.Vector3(0, 0, -1));
    const hit = ray.intersectObject(model, true)[0];
    if (!hit) continue;
    const normal = hit.normal ?? hit.face.normal;
    normal.transformDirection(hit.object.matrixWorld);
    samples.push([x, y, ...normal.toArray().map(n => Math.round(n * 100))]);
  }
}
await writeFile(new URL('../src/app/components/plain/share/shareSpectre.json', import.meta.url), JSON.stringify(samples) + '\n');
const stylesheet = await readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const dark = stylesheet.split('[data-theme="plain"][data-plain-scheme="dark"] {')[1].split('}')[0];
const palette = Object.fromEntries([...dark.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2]]));
await writeFile(new URL('../src/app/components/plain/share/sharePalette.json', import.meta.url), JSON.stringify(palette, null, 2) + '\n');
console.log(`${samples.length} surface samples (${cols} cols, yaw ${yawDegrees}°) from public/spectre.glb; plain dark tokens refreshed`);
