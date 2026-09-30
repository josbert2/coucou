# Coucou en Linux (fork)

Este repo es un **fork** de [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou), de Louis Raillé. El original está hecho para macOS (Swift) y Windows (Tauri). Este fork le suma soporte para Linux a la versión Tauri en `windows/`. La parte de Windows sigue igual.

- Código original: MIT, ver [LICENSE](LICENSE).
- El nombre "Coucou", el personaje Mochi, el ícono y los sonidos son del autor original, ver [LICENSE-ASSETS.md](LICENSE-ASSETS.md). Este fork es para uso personal y no publica builds ni releases.

## Qué cambia en Linux

| Pieza | Windows | Linux |
|---|---|---|
| Relay de hooks | named pipe `\\.\pipe\coucou-<sid>` | Unix socket `$XDG_RUNTIME_DIR/coucou.sock` (0600, chequeo de uid con `SO_PEERCRED`) |
| Ventana de la isla | Win32 (`WS_EX_NOACTIVATE`, `WS_EX_TOOLWINDOW`) | GTK bajo X11: sin foco, fuera de la barra de tareas, siempre arriba y en todos los escritorios |
| Click-through | flag que se alterna desde el poll del cursor | input shape de GTK del tamaño de la isla |
| API keys | Credential Manager | Secret Service (GNOME Keyring / KWallet) |
| Config / datos | `%APPDATA%`, `%LOCALAPPDATA%` | `~/.config/coucou`, `~/.local/share/coucou` |
| Paquete | NSIS | `deb` / AppImage (`tauri.linux.conf.json`) |

En Wayland la app corre por XWayland (`GDK_BACKEND=x11`), porque Wayland no deja que una ventana se ubique sola ni que quede siempre arriba. También apaga el renderer DMA-BUF y el modo de composición acelerada de WebKitGTK: con la ventana transparente dejaban rastros en las animaciones y el texto escalado salía borroso.

Otros cambios:

- **Chat sin API key**: si no hay key guardada, el chat usa el CLI de Claude Code (`claude -p`), con tu suscripción. Aplica también en Windows.
- **Canvas a 2x**: Mochi y las pills se dibujan siempre a 2x como mínimo, así se ven nítidos en pantallas de escala 1.

## Correrlo

Requisitos (Ubuntu/Debian): Rust, Node 20+, y

```bash
sudo apt install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev libdbus-1-dev librsvg2-dev
```

```bash
cd windows
npm install
npm run tauri dev
```

Después: icono de la bandeja → Settings… → Claude Code → Install hooks.
