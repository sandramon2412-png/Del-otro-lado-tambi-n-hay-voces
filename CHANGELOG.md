# Changelog

## [0.1.0] - 2026-09-29

### Added
- Initial release of interactive digital book
- Multi-view reading modes (double-page, single-page, continuous scroll)
- Neural text-to-speech with 4 voice profiles (Elena, Carlos, Daniela, Crónica Andina)
- Auto-flip feature for hands-free reading
- Bookmark and annotation system (highlights & notes)
- Full-text search functionality
- Reader settings (font size, font family, theme, speed control)
- Responsive design for desktop and tablet
- Comprehensive error handling and API fallback
- Audio caching to reduce latency
- Health check endpoint for server monitoring

### Technical
- React 19 + TypeScript + Vite
- Express.js server with Gemini TTS API integration
- Tailwind CSS for styling
- Web Audio API for playback control
- Web Speech API fallback for voice synthesis
- LocalStorage for user preferences persistence

### Known Limitations
- Text-to-speech requires Gemini API key with available quota
- Best browser support for modern Chrome/Firefox/Safari (2023+)
- Mobile voice synthesis may vary by OS and browser

### Future Enhancements
- Offline mode with cached content
- Multi-language support
- User authentication and cloud sync
- Interactive exercises and comprehension quizzes
- Export to other formats (ePub, PDF)
- Real-time collaboration features
