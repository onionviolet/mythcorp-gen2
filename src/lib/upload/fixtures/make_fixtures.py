import sys
# Regenerates the metadata-stripping fixtures. Needs Pillow:
#   python3 src/lib/upload/fixtures/make_fixtures.py src/lib/upload/fixtures
from PIL import Image, PngImagePlugin
out = sys.argv[1]
img = Image.new("RGB", (8, 8), (200, 40, 40))
exif = Image.Exif()
exif[0x0112] = 6            # Orientation: rotate 90 CW
exif[0x010F] = "FixtureCam"  # Make
gps = {1: "N", 2: (41.0, 52.0, 55.0), 3: "W", 4: (87.0, 37.0, 40.0)}
exif[0x8825] = gps
xmp = b'<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF><rdf:Description exif:GPSLatitude="41,52.9N"/></rdf:RDF></x:xmpmeta>'
img.save(f"{out}/gps.jpg", "JPEG", exif=exif.tobytes(), xmp=xmp, comment=b"secret comment", quality=80)
info = PngImagePlugin.PngInfo()
info.add_text("Comment", "GPS 41.88N 87.63W")
info.add_itxt("XML:com.adobe.xmp", "GPSLatitude 41.88")
img.save(f"{out}/gps.png", "PNG", pnginfo=info, exif=exif.tobytes())
img.save(f"{out}/gps.webp", "WEBP", exif=exif.tobytes(), xmp=xmp, lossless=True)
