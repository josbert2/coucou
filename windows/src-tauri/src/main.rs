// Coucou runs without a console window: Mochi is the whole UI.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Wayland lets no client place its own window or keep it on top, which is
    // the whole island. Run under X11 (XWayland on a Wayland session) unless the
    // user explicitly chose a backend. WebKitGTK's DMA-BUF renderer draws
    // transparent windows opaque on several drivers, and its accelerated
    // compositing never clears a transparent X11 window between frames (every
    // animation leaves trails) and rasterises scaled layers blurry — both off.
    #[cfg(target_os = "linux")]
    {
        if std::env::var_os("GDK_BACKEND").is_none() {
            std::env::set_var("GDK_BACKEND", "x11");
        }
        if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
        if std::env::var_os("WEBKIT_DISABLE_COMPOSITING_MODE").is_none() {
            std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        }
    }
    coucou_lib::run()
}
