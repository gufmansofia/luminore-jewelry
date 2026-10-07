"""Create a single-frame, real-time jewellery loop from the full source film.

Keep only hand-led shots, crop each shot for landscape, and rotate the edit
inside the palm shot. The last and first frames are consecutive source frames,
so the repeat needs no reverse playback, freeze, slowdown, or dissolve.
"""
import argparse
import json
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
destination = root / 'public' / 'optimized'
destination.mkdir(parents=True, exist_ok=True)

# Frame positions refer to a normalized 30 fps source, at unchanged speed.
# The opening and closing crops must match to preserve the continuous seam.
shots = [
    ('rings-opening', 145, 179, 1160),
    ('hand-by-ear', 179, 240, 640),
    ('bracelet-and-ring', 240, 282, 1350),
    ('hand-by-face', 282, 328, 950),
    ('moving-hands', 328, 432, '600+144*t'),
    ('hand-on-shoulder', 115, 139, 1400),
    ('rings-closing', 139, 145, 1160),
]
filters = ['[0:v]fps=30,split=7' + ''.join(f'[s{i}]' for i in range(7))]
for i, (_, start, end, y) in enumerate(shots):
    filters.append(f'[s{i}]trim=start_frame={start}:end_frame={end},'
                   f"setpts=PTS-STARTPTS,crop=2160:1216:0:'{y}',"
                   f'scale=1440:810,setsar=1[v{i}]')
filters.append(''.join(f'[v{i}]' for i in range(7)) +
               'concat=n=7:v=1:a=0,format=yuv420p[out]')
film = destination / 'atelier-hands-loop.mp4'
subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
    '-i', str(args.source), '-filter_complex', ';'.join(filters),
    '-map', '[out]', '-an', '-map_metadata', '-1', '-c:v', 'libx264',
    '-preset', 'medium', '-crf', '21', '-r', '30', '-fps_mode', 'cfr',
    '-video_track_timescale', '15360', '-movflags', '+faststart', str(film)], check=True)
subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
    '-i', str(film), '-frames:v', '1', '-q:v', '2',
    str(destination / 'atelier-hands-poster.jpg')], check=True)
report = {
    'speed': 1.0, 'fps': 30, 'frames': sum(end-start for _, start, end, _ in shots),
    'durationSeconds': sum(end-start for _, start, end, _ in shots) / 30,
    'composition': 'one landscape frame', 'audio': False,
    'boundarySourceFrames': [144, 145],
    'shots': [{'shot': name, 'startFrame': start, 'endFrameExclusive': end,
               'cropY': y} for name, start, end, y in shots],
}
review = root / 'output' / 'hand-film-2026-10-07'
review.mkdir(parents=True, exist_ok=True)
(review / 'edit.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
