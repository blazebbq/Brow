# Brow - ChatGPT Optimized Browser

A dedicated desktop browser application specifically optimized for maximum performance with ChatGPT. Brow is designed to prevent lag during long conversations and provide a smooth, efficient ChatGPT experience.

## Features

### 🚀 Performance Optimizations
- **Virtual Scrolling**: Efficiently manages long conversation threads by hiding off-screen messages
- **Memory Management**: Automatic cleanup and optimization for extended chat sessions
- **Hardware Acceleration**: GPU-accelerated rendering for smooth scrolling and animations
- **Lazy Loading**: Images and content load on-demand to reduce memory footprint
- **Optimized JavaScript Execution**: Enhanced V8 engine settings for better performance

### ⚡ Lightweight & Fast
- Minimal browser focused only on ChatGPT functionality
- Fast startup time
- Low CPU and memory footprint
- Stripped-down browser without unnecessary features

### 🎨 Clean Interface
- Minimal, distraction-free UI
- Native ChatGPT experience
- Smooth scrolling even with hundreds of messages
- Beautiful loading screen

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/blazebbq/Brow.git
cd Brow
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

## Usage

Simply launch Brow, and it will automatically navigate to ChatGPT (chat.openai.com). The application includes:

- **Automatic Optimizations**: Performance enhancements are applied automatically
- **Memory Management**: Long conversations are optimized to prevent lag
- **Smooth Scrolling**: Even with hundreds of messages, scrolling remains smooth

## Building

Build the application for your platform:

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

Built applications will be available in the `dist/` directory.

## Performance Features Explained

### Virtual Scrolling
When conversations exceed 50 messages, Brow automatically:
- Hides messages that are far off-screen
- Restores them when scrolling nearby
- Keeps first 5 and last 40 messages always visible

### Memory Optimization
- Automatic garbage collection hints
- Cache cleanup when memory usage exceeds 80%
- Efficient DOM management
- Lazy image loading

### Hardware Acceleration
- GPU-accelerated rendering
- Zero-copy video decoding
- Optimized rasterization
- Smooth animations and transitions

## Technical Stack

- **Electron**: Desktop application framework
- **Chromium**: Rendering engine
- **Node.js**: Runtime environment

## Development

Run in development mode with console logging:
```bash
npm run dev
```

## System Requirements

- **OS**: Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 200MB for application
- **Internet**: Required for ChatGPT access

## Performance Tips

1. **Long Conversations**: Brow automatically optimizes conversations with 50+ messages
2. **Memory**: The app monitors memory usage and cleans up automatically
3. **Multiple Chats**: Open new chats to reset memory if needed
4. **Updates**: Keep Brow updated for the latest optimizations

## Troubleshooting

### Application loads forever / blank screen
- The webview requires `webviewTag: true` in the Electron configuration (already included)
- Check your internet connection
- Look for errors in the console (run with `npm run dev` to see logs)
- Try clearing application data and restarting

### Console shows security warnings
- The "allowpopups" warning is expected and safe (allows ChatGPT dialogs to work)
- Sandbox is disabled for webview support - this is required for the webview tag

### High memory usage
- This is normal for long conversations (200-500MB)
- Virtual scrolling activates automatically at 50+ messages
- Restart the app if memory exceeds 1GB

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This is a third-party application and is not affiliated with or endorsed by OpenAI.