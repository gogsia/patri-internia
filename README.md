# 🌿 Solarpunk Interiors

**3D Immersive Interior Design Explorer**

An interactive 3D furniture placement application with a solarpunk aesthetic. Design eco-futuristic interior spaces with intuitive drag-and-drop controls, real-time 3D rendering, and persistent layout storage.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.183-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🎨 3D Scene
- **Orbital Camera Controls**: Drag to rotate, scroll to zoom, right-drag to pan
- **Dynamic Lighting**: Adjustable ambient, point, and directional lights via Leva GUI
- **Post-Processing Effects**: Optional pixelation shader for retro aesthetic
- **Responsive Controls**: Smooth camera interaction with min/max zoom limits

### 🪑 Furniture Management
- **Library Panel**: Browse and add furniture items (Solar Succulent, Solar Panel Station, Hydroponic Tower)
- **Drag & Drop**: Intuitive 3D furniture placement by clicking and dragging
- **Selection System**: Click to select furniture with visual feedback
- **Advanced Operations**: Duplicate, delete, and reposition furniture items
- **Keyboard Shortcuts**: Fast editing with Delete, Ctrl+D, and Esc keys

### 🔄 History System
- **Undo/Redo**: Full-featured history tracking (50-state buffer)
- **Keyboard Shortcuts**: Ctrl+Z to undo, Ctrl+Y to redo
- **Visual Indicators**: Toolbar shows when undo/redo actions are available
- **Smart State Management**: Automatic history snapshots on furniture changes

### 💾 Layout Persistence
- **Save Layouts**: Name and store your furniture arrangements
- **Load Instantly**: Restore saved layouts with one click
- **Browser Storage**: Uses localStorage for client-side persistence
- **Manage Library**: Delete unwanted saved layouts

### 📸 Export & Share
- **Screenshots**: Capture canvas as downloadable image
- **Share Designs**: Share button for distribution
- **Help System**: Toggle instructions panel

### 🖼️ Photo-to-3D Conversion (NEW)
- **Designer Reality Mixer**: Upload interior photos and convert them to 3D models
- **Local Processing**: Uses TripoSR on your GPU (RTX 2070 8GB optimized)
- **Instant Integration**: Converted models appear directly in your scene
- **Free & Open Source**: No API keys or cloud services required

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (recommended)
- npm, yarn, pnpm, or bun
- **For Photo-to-3D**: Python 3.9+, CUDA-capable GPU (RTX 2070 or better)

### Quick Start (Web App Only)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Full Setup (with Photo-to-3D)

#### 1. Set up TripoSR Service

```bash
cd triposr-service
setup.bat              # Run first-time setup (Windows)
start-server.bat       # Start the service
```

See [`triposr-service/README.md`](triposr-service/README.md) for detailed instructions.

#### 2. Configure Environment

Copy `.env.local.example` to `.env.local`:

```env
TRIPOSR_API_URL=http://127.0.0.1:8000
```

#### 3. Start Next.js App

```bash
npm run dev
```

Now the "Import Designer Photo" button will be functional!

## 🚀 Quick Start (Previous)



### Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## 🎮 Controls

### Mouse
- **Left Drag**: Rotate camera around scene
- **Right Drag**: Pan camera horizontally/vertically
- **Scroll**: Zoom in/out
- **Click Furniture**: Select item
- **Drag Furniture**: Move selected item in 3D space
- **Import Photo Button**: Open photo upload dialog

### Keyboard
- `Ctrl+Z`: Undo last action
- `Ctrl+Y` or `Ctrl+Shift+Z`: Redo action
- `Delete`: Delete selected furniture
- `Ctrl+D`: Duplicate selected furniture
- `Esc`: Deselect current furniture
- `Arrow Keys`: Fine-tune furniture position (0.5 units)
- `Q/E`: Rotate furniture (15° increments)
- `+/-`: Scale furniture (10% increments)

### Photo Import
- Drag and drop images directly onto the import dialog
- Supports JPG, PNG (max 4MB)
- Processing takes 10-20 seconds on RTX 2070

## 🛠️ Technology Stack

### Frontend
- **Next.js 16**: React framework with Turbopack
- **React 19**: Latest UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling

### 3D Rendering
- **Three.js 0.183**: 3D engine
- **React Three Fiber 9**: React renderer for Three.js
- **React Three Drei 10**: Useful Three.js helpers
- **React Three Postprocessing**: Visual effects

### Developer Tools
- **Leva**: GUI controls for scene parameters
- **ESLint**: Code quality and consistency

### AI/3D Processing
- **TripoSR**: Stability AI's single-image 3D reconstruction
- **FastAPI**: Python service backend
- **PyTorch**: ML framework for 3D generation
- **Rembg**: Automatic background removal

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with HistoryProvider
│   ├── page.tsx            # Main app with state management
│   └── globals.css         # Global styles
├── components/
│   ├── Scene.tsx           # 3D canvas wrapper
│   ├── 3d/                 # 3D-specific components
│   │   ├── EditableFurniture.tsx
│   │   ├── FurnitureInstances.tsx
│   │   └── Model.tsx
│   ├── leva/               # Leva GUI controls
│   │   └── SceneControls.tsx
│   └── ui/                 # UI components
│       ├── FurniturePanel.tsx
│       ├── LayoutControls.tsx
│       └── Toolbar.tsx
├── experiences/
│   ├── SolarpunkRoom.tsx   # Main 3D scene composition
│   ├── RoomEnvironment.tsx
│   └── RoomModels.tsx
├── hooks/
│   ├── useHistory.tsx      # Undo/redo state management
│   ├── useUndoRedo.ts      # Keyboard shortcut hook
│   └── useFurnitureKeyboard.ts
├── lib/
│   ├── constants.ts
│   ├── furnitureLibrary.ts # Furniture item definitions
│   ├── materials.ts
│   ├── share.ts            # Export/share utilities
│   └── storage.ts          # localStorage utilities
└── types/
    └── index.ts            # TypeScript definitions
```

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Useful R3F helpers
- **[@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)** - Post-processing effects
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[Leva](https://github.com/pmndrs/leva)** - GUI controls
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[GSAP](https://greensock.com/gsap/)** - Animation library

## 📦 Adding Your Own 3D Models

Place `.glb` or `.gltf` files in `/public/models/` and reference them in `src/lib/furnitureLibrary.ts`:

```typescript
{
  id: 'my-furniture',
  name: 'My Custom Furniture',
  modelPath: '/models/my-furniture.glb',
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 1,
}
```

## 🎨 Customization

### Adjust Scene Lighting
Use the Leva GUI (top-right panel) to adjust:
- Ambient light intensity & color
- Point light intensity & color
- Auto-rotation speed
- Pixelation effect intensity

### Modify Furniture Library
Edit `src/lib/furnitureLibrary.ts` to add/remove furniture items.

### Change Color Scheme
Update Tailwind colors in `src/app/globals.css` and component class names.

## 🚧 Future Enhancements

- [x] ~~Rotation & scale controls for furniture~~ ✅ Done (Q/E keys, +/- keys)
- [x] ~~Photo-to-3D conversion~~ ✅ Done (TripoSR integration)
- [ ] Multiple room templates (bedroom, office, greenhouse)
- [ ] Snap-to-grid placement option  
- [ ] Export layouts as JSON/3D formats
- [ ] Real-time collaborative editing
- [ ] Mobile touch controls optimization
- [ ] VR/AR mode support
- [ ] Material & texture customization
- [ ] AI-powered layout suggestions
- [ ] Multi-photo photogrammetry mode

## 🔧 Troubleshooting

### Photo Import Not Working

1. Check TripoSR service is running:
   ```bash
   curl http://127.0.0.1:8000/health
   ```

2. Verify `.env.local` has:
   ```env
   TRIPOSR_API_URL=http://127.0.0.1:8000
   ```

3. Check service logs for errors

### CUDA Out of Memory

If you get GPU memory errors:

1. Edit `triposr-service/server.py`:
   ```python
   MAX_IMAGE_SIZE = 384  # Lower from 512
   ```

2. Close other GPU applications
3. Restart the TripoSR service

### Image Upload Fails

- Ensure image is under 4MB
- Use JPG or PNG format
- Check for valid image file (not corrupted)

### Build Errors

```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Credits

Built with ❤️ using React Three Fiber ecosystem and Next.js.

---

**Status**: ✅ Fully functional with all core features integrated (as of March 6, 2026)

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed implementation notes.
