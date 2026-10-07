"""Encode three sharp, full-width preview studies from the circular portrait film.

No blur, darkening or artificial background extension. The gallery and diptych
use synchronised views of the same circular film. The macro uses a quiet,
reversible detail shot, slowed to 60%.
"""
import argparse
import subprocess
from pathlib import Path
parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'public' / 'optimized'
source = root / 'atelier-loop-1080.mp4'
graphs = {
    'macro': '[0:v]trim=start=4.2:end=5.2,setpts=PTS-STARTPTS,scale=1440:-2,crop=1440:720:0:850,split=2[f][r];[r]reverse,setpts=PTS-STARTPTS[rev];[f][rev]concat=n=2:v=1:a=0,setpts=PTS/0.6,fps=30,format=yuv420p[out]',
    'triptych': '[0:v]split=3[a][b][c];[a]scale=480:-2,crop=480:400:0:80[left];[b]scale=740:-2,crop=480:400:130:230[center];[c]scale=560:-2,crop=480:400:40:170[right];[left][center][right]hstack=inputs=3,format=yuv420p[out]',
    'duo': '[0:v]split=2[a][b];[a]scale=720:-2,crop=720:600:0:100[left];[b]scale=1080:-2,crop=720:600:200:760[right];[left][right]hstack=inputs=2,format=yuv420p[out]',
}
for name, graph in graphs.items():
    destination = root / f'atelier-study-{name}.mp4'
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '24', '-movflags', '+faststart', str(destination)], check=True)
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(destination),
        '-vf', 'fps=10,scale=960:-2', '-c:v', 'libwebp_anim', '-quality', '70', '-loop', '0',
        str(root / f'atelier-study-{name}.webp')], check=True)
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(destination),
        '-frames:v', '1', '-q:v', '3', str(root / f'atelier-study-{name}-poster.jpg')], check=True)
    print(f'{name}: {destination.stat().st_size / 1e6:.2f} MB', flush=True)
