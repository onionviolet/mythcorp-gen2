import { writeFile } from 'node:fs/promises';
import { shareImage } from '../src/app/components/plain/share/shareImage';

/** The share card is a committed static asset: rendering it per request on
 *  Workers exceeded the CPU limit (error 1102). Rerun after changing the card. */
const out = 'public/share/mythcorp-card.png';

void shareImage().arrayBuffer().then(async (data) => {
  const png = Buffer.from(data);
  await writeFile(out, png);
  console.log(`${out}: ${png.length} bytes`);
});
