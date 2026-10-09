import { shareImage, SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE } from './components/plain/share/shareImage';

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default function OpenGraphImage() {
  return shareImage();
}
