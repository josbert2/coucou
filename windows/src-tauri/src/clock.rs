// Local wall-clock time, for log lines and backup names. No chrono for six numbers.

/// (year, month, day, hour, minute, second) in local time.
#[cfg(windows)]
pub fn local_now() -> (u16, u16, u16, u16, u16, u16) {
    let t = unsafe { windows::Win32::System::SystemInformation::GetLocalTime() };
    (t.wYear, t.wMonth, t.wDay, t.wHour, t.wMinute, t.wSecond)
}

#[cfg(unix)]
pub fn local_now() -> (u16, u16, u16, u16, u16, u16) {
    unsafe {
        let now = libc::time(std::ptr::null_mut());
        let mut tm: libc::tm = std::mem::zeroed();
        libc::localtime_r(&now, &mut tm);
        (
            (tm.tm_year + 1900) as u16,
            (tm.tm_mon + 1) as u16,
            tm.tm_mday as u16,
            tm.tm_hour as u16,
            tm.tm_min as u16,
            tm.tm_sec as u16,
        )
    }
}
