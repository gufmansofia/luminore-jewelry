"""Encode silent image-animation fallbacks from the approved films, without recropping.

Run with --ffmpeg /path/to/ffmpeg. These files are loaded only when video playback
is blocked; the smaller, hardware-decoded MP4 remains the normal delivery format.
"""
import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'public' / 'optimized'
for source, destination, width, loops in [
    ('atelier-intro-720.mp4', 'atelier-intro-motion-mobile.webp', 720, 1),
    ('atelier-intro-1080.mp4', 'atelier-intro-motion-desktop.webp', 960, 1),
    ('bespoke-film-mobile.mp4', 'bespoke-film-motion-mobile.webp', 720, 0),
    ('bespoke-film-desktop.mp4', 'bespoke-film-motion-desktop.webp', 960, 0),
]:
    subprocess.run([
        args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(root / source), '-an', '-vf', f'fps=20,scale={width}:-2',
        '-c:v', 'libwebp_anim', '-quality', '76', '-compression_level', '6',
        '-loop', str(loops), str(root / destination),
    ], check=True)
    print(f'{destination}: {(root / destination).stat().st_size / 1e6:.2f} MB', flush=True)
