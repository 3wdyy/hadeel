# Henkel GCC Video Project

This project uses **Remotion** to create programmatic videos with React. The video is previewed via GitHub Pages.

## Project Structure

```
/hadeel
├── CLAUDE.md                 # This file - project instructions
├── index.html                # Video player (GitHub Pages)
├── video-version.txt         # Version tracking for cache-busting
├── henkel-gcc.mp4           # Rendered video output
├── Henkel_GCC_Video.pptx    # Original PowerPoint reference
│
├── henkel-video/            # Remotion project
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── Root.tsx         # Composition registration
│   │   ├── HenkelGCCVideo.tsx  # Main video composition
│   │   ├── components/      # Reusable animation components
│   │   └── scenes/          # Individual scene components
│   ├── package.json
│   ├── remotion.config.ts   # Remotion configuration
│   └── out/                 # Render output directory
│
├── .agents/skills/          # Remotion skill files
└── .claude/skills/          # Symlink to skills
```

## Video Preview (GitHub Pages)

**URL**: `https://3wdyy.github.io/hadeel/`

The preview page auto-loads the latest video using cache-busting via `video-version.txt`.

## Workflow: Making Video Changes

### 1. Edit the Video

Modify files in `henkel-video/src/`:

- **Scenes**: `src/scenes/*.tsx` - Individual scenes (Intro, Stats, Team, etc.)
- **Components**: `src/components/*.tsx` - Reusable animations
- **Timing**: `src/HenkelGCCVideo.tsx` - Scene sequencing and durations
- **Config**: `src/Root.tsx` - Video dimensions, FPS, total duration

### 2. Preview Changes (Optional)

```bash
cd henkel-video
npm run dev
```
Opens Remotion Studio at `http://localhost:3000` for live preview.

### 3. Render the Video

```bash
cd henkel-video
npm run render
```

This outputs to `henkel-video/out/henkel-gcc.mp4`.

### 4. Update Version & Copy Output

After rendering, run this to update the preview:

```bash
# Copy rendered video to root
cp henkel-video/out/henkel-gcc.mp4 ./henkel-gcc.mp4

# Update version file (increment version, update timestamp)
echo "v1.0.X" > video-version.txt
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> video-version.txt
```

### 5. Commit and Push

```bash
git add henkel-gcc.mp4 video-version.txt henkel-video/
git commit -m "Update video: [describe changes]"
git push
```

### 6. View on GitHub Pages

Wait ~1-2 minutes for GitHub Pages to deploy, then visit:
`https://3wdyy.github.io/hadeel/`

Click "Force Refresh" if you see the old version.

---

## Quick Reference: Common Tasks

### Change Scene Timing

Edit `henkel-video/src/HenkelGCCVideo.tsx`:

```tsx
const SCENES = {
  intro: { start: 0, duration: 180 },      // frames (30fps = 6 seconds)
  logoReveal: { start: 165, duration: 120 },
  // ... etc
};
```

### Add New Animation Component

Create in `henkel-video/src/components/`:

```tsx
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

export const MyComponent: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animation = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return <div style={{ opacity: animation }}>Content</div>;
};
```

### Change Video Resolution/FPS

Edit `henkel-video/src/Root.tsx`:

```tsx
<Composition
  id="HenkelGCC"
  component={HenkelGCCVideo}
  durationInFrames={30 * 75}  // 75 seconds
  fps={30}
  width={1920}
  height={1080}
/>
```

### Change Brand Colors

The Henkel red is `#E2001A`. Search and replace in component files.

---

## Remotion Skill

The official Remotion skill is installed at `.agents/skills/remotion-best-practices/`.

Reference the rules in `rules/*.md` for:
- Animations and timing
- Audio/video embedding
- Text animations
- Transitions
- 3D content
- And more

---

## Troubleshooting

### Video not updating on GitHub Pages?

1. Check `video-version.txt` was updated
2. Click "Force Refresh" on the preview page
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Render fails with browser error?

The project uses Playwright's headless shell. If it fails:

```bash
npx playwright install chromium
```

### TypeScript errors?

```bash
cd henkel-video
npx tsc --noEmit
```

---

## For Claude: Render & Deploy Workflow

When user requests video changes, follow this workflow:

1. **Make the requested changes** to files in `henkel-video/src/`
2. **Render the video**:
   ```bash
   cd /home/user/hadeel/henkel-video && npm run render
   ```
3. **Copy and version**:
   ```bash
   cd /home/user/hadeel
   cp henkel-video/out/henkel-gcc.mp4 ./henkel-gcc.mp4
   # Increment version number from current video-version.txt
   echo "vX.X.X" > video-version.txt
   echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> video-version.txt
   ```
4. **Commit and push**:
   ```bash
   git add henkel-gcc.mp4 video-version.txt henkel-video/
   git commit -m "Update video: [changes]"
   git push -u origin [branch-name]
   ```
5. **Inform user** that video is ready at GitHub Pages URL

Always increment the version number (e.g., v1.0.0 → v1.0.1 for minor changes, v1.1.0 for new features).
