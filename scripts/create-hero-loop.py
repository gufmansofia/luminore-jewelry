"""Create a circular hero edit without modifying the original intro.

The 0.65s tail/head dissolve is baked into the video. Rotating the timeline
places the file boundary inside one continuous shot; playback is slowed to 65%.
Run: python3 scripts/create-hero-loop.py --ffmpeg /path/to/ffmpeg
"""
import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'public' / 'optimized'
source = root / 'atelier-intro-1080.mp4'
for width in (720, 1080):
    graph = (
        f'[0:v]trim=start=0.15:end=5.50,setpts=PTS-STARTPTS,scale={width}:-2,split=2[body][head];'
        '[body]trim=start=0.65,setpts=PTS-STARTPTS,fps=30,settb=1/30[b];'
        '[head]trim=end=0.65,setpts=PTS-STARTPTS,fps=30,settb=1/30[h];'
        '[b][h]xfade=transition=fade:duration=0.65:offset=4.05,'
        'setpts=PTS/0.65,fps=30,format=yuv420p[out]'
    )
    destination = root / f'atelier-loop-{width}.mp4'
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
                    '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libx264',
                    '-preset', 'slow', '-crf', '24', '-movflags', '+faststart', str(destination)], check=True)
    print(f'{destination.name}: {destination.stat().st_size / 1e6:.2f} MB', flush=True)
for size, name in ((480, 'mobile'), (720, 'desktop')):
    destination = root / f'atelier-loop-motion-{name}.webp'
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
                    '-i', str(root / 'atelier-loop-1080.mp4'), '-an',
                    '-vf', f'fps=12,scale={size}:-2', '-c:v', 'libwebp_anim',
                    '-quality', '72', '-compression_level', '6', '-loop', '0', str(destination)], check=True)
    print(f'{destination.name}: {destination.stat().st_size / 1e6:.2f} MB', flush=True)
