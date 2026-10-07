"""Create a single-frame, real-time jewellery loop from the full source film.

Keep only hand-led shots, crop each shot for landscape, and rotate the edit
inside the palm shot. The last and first frames are consecutive source frames,
so the repeat needs no reverse playback, freeze, slowdown, or dissolve.
The portrait export uses the identical timeline and preserves the source frame.
"""
import argparse
import json
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('--ffmpeg', default='ffmpeg')
parser.add_argument('--portrait-only', action='store_true', help='Export the same edit for the existing portrait hero.')
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
def encode(source, filename, graph, mapped='[out]'):
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(source), '-filter_complex', graph, '-map', mapped,
        '-an', '-map_metadata', '-1', '-c:v', 'libx264',
        '-preset', 'medium', '-crf', '21', '-r', '30', '-fps_mode', 'cfr',
        '-video_track_timescale', '15360', '-movflags', '+faststart',
        str(destination / filename)], check=True)

if not args.portrait_only:
    encode(args.source, 'atelier-hands-loop.mp4', ';'.join(filters))
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(destination / 'atelier-hands-loop.mp4'), '-frames:v', '1', '-q:v', '2',
        str(destination / 'atelier-hands-poster.jpg')], check=True)
else:
    # Preserve the full portrait composition while retaining every edit point.
    portrait_filters = ['[0:v]fps=30,scale=1080:1920,split=7' + ''.join(f'[p{i}]' for i in range(7))]
    for i, (_, start, end, _) in enumerate(shots):
        portrait_filters.append(f'[p{i}]trim=start_frame={start}:end_frame={end},setpts=PTS-STARTPTS[v{i}]')
    portrait_filters.append(''.join(f'[v{i}]' for i in range(7)) + 'concat=n=7:v=1:a=0,setsar=1,format=yuv420p[out]')
    encode(args.source, 'atelier-hands-1080.mp4', ';'.join(portrait_filters))
    portrait = destination / 'atelier-hands-1080.mp4'
    encode(portrait, 'atelier-hands-720.mp4', '[0:v]scale=720:1280[out]')
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(portrait), '-vf', 'scale=720:1280', '-frames:v', '1', '-q:v', '2',
        str(destination / 'atelier-hands-portrait-poster.jpg')], check=True)
    for name, width in [('mobile', 480), ('desktop', 720)]:
        subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
            '-i', str(portrait), '-vf', f'fps=12,scale={width}:-2',
            '-c:v', 'libwebp_anim', '-quality', '70', '-loop', '0',
            str(destination / f'atelier-hands-motion-{name}.webp')], check=True)
report = {
    'speed': 1.0, 'fps': 30, 'frames': sum(end-start for _, start, end, _ in shots),
    'durationSeconds': sum(end-start for _, start, end, _ in shots) / 30,
    'composition': 'one portrait frame' if args.portrait_only else 'one landscape frame', 'audio': False,
    'boundarySourceFrames': [144, 145],
    'shots': [{'shot': name, 'startFrame': start, 'endFrameExclusive': end,
               'cropY': None if args.portrait_only else y} for name, start, end, y in shots],
}
review = root / 'output' / 'hand-film-2026-10-07'
review.mkdir(parents=True, exist_ok=True)
(review / ('portrait-edit.json' if args.portrait_only else 'edit.json')).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
