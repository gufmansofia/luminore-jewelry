"""Adapt the portrait loop to a full-width canvas, retaining the model and rings.

A softly defocused extension fills the left side; the sharp portrait blends
into it on the right. The existing circular edit and its timing are preserved.
"""
import argparse
import subprocess
from pathlib import Path
parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'public' / 'optimized'
graph = (
    '[0:v]split=2[bg][fg];'
    '[bg]scale=1440:-2,crop=1440:900,boxblur=35:2,eq=brightness=-0.08[back];'
    '[fg]scale=860:-2,crop=860:900:0:170,format=yuva420p,'
    "geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='255*min(1,X/160)'[front];"
    '[back][front]overlay=x=580:y=0,format=yuv420p[out]'
)
subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
    '-i', str(root / 'atelier-loop-1080.mp4'), '-filter_complex', graph,
    '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
    '-movflags', '+faststart', str(root / 'atelier-loop-wide.mp4')], check=True)
subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
    '-i', str(root / 'atelier-loop-wide.mp4'), '-vf', 'fps=12,scale=960:-2',
    '-c:v', 'libwebp_anim', '-quality', '72', '-compression_level', '6', '-loop', '0',
    str(root / 'atelier-loop-motion-wide.webp')], check=True)
print('Full-width loop and motion fallback created.')
