import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const faces = [
  [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
  [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[-1, 0, 0], [0, 1, 0], [0, 0, -1]],
  [[0, -1, 0], [0, 0, 1], [1, 0, 0]],
  [[0, -1, 0], [1, 0, 0], [0, 0, -1]],
  [[0, -1, 0], [-1, 0, 0], [0, 0, 1]],
  [[0, -1, 0], [0, 0, -1], [-1, 0, 0]],
];

const positions = [];
const normals = [];
const indices = [];

for (const face of faces) {
  const [a, b, c] = face;
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  const length = Math.hypot(...normal);
  const unit = normal.map(value => value / length);
  const offset = positions.length / 3;

  for (const point of face) {
    positions.push(...point);
    normals.push(...unit);
  }
  indices.push(offset, offset + 1, offset + 2);
}

const positionBytes = Buffer.from(new Float32Array(positions).buffer);
const normalBytes = Buffer.from(new Float32Array(normals).buffer);
const indexBytes = Buffer.from(new Uint16Array(indices).buffer);
const binary = Buffer.concat([positionBytes, normalBytes, indexBytes]);
const metadata = Buffer.from(JSON.stringify({
  asset: { version: '2.0', generator: 'generate-hold-calibration-glb.mjs' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'Calibration orb' }],
  meshes: [{
    name: 'Calibration orb',
    primitives: [{
      attributes: { POSITION: 0, NORMAL: 1 },
      indices: 2,
      material: 0,
    }],
  }],
  materials: [{
    name: 'Neutral calibration material',
    pbrMetallicRoughness: { baseColorFactor: [0.72, 0.72, 0.72, 1], metallicFactor: 0.15, roughnessFactor: 0.65 },
  }],
  buffers: [{ byteLength: binary.length }],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: positionBytes.length, target: 34962 },
    { buffer: 0, byteOffset: positionBytes.length, byteLength: normalBytes.length, target: 34962 },
    { buffer: 0, byteOffset: positionBytes.length + normalBytes.length, byteLength: indexBytes.length, target: 34963 },
  ],
  accessors: [
    { bufferView: 0, componentType: 5126, count: positions.length / 3, type: 'VEC3', min: [-1, -1, -1], max: [1, 1, 1] },
    { bufferView: 1, componentType: 5126, count: normals.length / 3, type: 'VEC3' },
    { bufferView: 2, componentType: 5123, count: indices.length, type: 'SCALAR', min: [0], max: [positions.length / 3 - 1] },
  ],
}));
const padding = (4 - metadata.length % 4) % 4;
const json = Buffer.concat([metadata, Buffer.alloc(padding, 0x20)]);
const file = Buffer.alloc(12 + 8 + json.length + 8 + binary.length);

file.writeUInt32LE(0x46546c67, 0);
file.writeUInt32LE(2, 4);
file.writeUInt32LE(file.length, 8);
file.writeUInt32LE(json.length, 12);
file.writeUInt32LE(0x4e4f534a, 16);
json.copy(file, 20);
const binaryOffset = 20 + json.length;
file.writeUInt32LE(binary.length, binaryOffset);
file.writeUInt32LE(0x004e4942, binaryOffset + 4);
binary.copy(file, binaryOffset + 8);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const output = resolve(scriptDir, '../public/models/calibration.glb');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, file);
console.log(`wrote ${output} (${file.length} bytes)`);
