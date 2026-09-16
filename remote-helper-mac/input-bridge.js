const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

function clamp01(value) {
    return Math.min(1, Math.max(0, Number(value) || 0));
}

function mapPoint(x, y, display) {
    const bounds = display?.bounds || { x: 0, y: 0, width: 1920, height: 1080 };
    const px = Math.round(bounds.x + clamp01(x) * bounds.width);
    const py = Math.round(bounds.y + clamp01(y) * bounds.height);
    return { px, py };
}

async function runPowerShell(script) {
    await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
        windowsHide: true,
    });
}

async function handleInputEvent(raw, display) {
    let event;
    try {
        event = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
        return;
    }

    if (!event || !event.t) {
        return;
    }

    const { px, py } = mapPoint(event.x, event.y, display);

    if (event.t === 'm') {
        await runPowerShell(`
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class NativeMouse {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
}
"@
[NativeMouse]::SetCursorPos(${px}, ${py}) | Out-Null
`);
        return;
    }

    if (event.t === 'b') {
        const down = Number(event.d) === 1;
        const flag = down ? 0x0002 : 0x0004;
        await runPowerShell(`
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class NativeMouse {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  [DllImport("user32.dll")] public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, int dwExtraInfo);
}
"@
[NativeMouse]::SetCursorPos(${px}, ${py}) | Out-Null
[NativeMouse]::mouse_event(${flag}, 0, 0, 0, 0)
`);
        return;
    }

    if (event.t === 'w') {
        const delta = Math.round(Number(event.dy) || 0);
        await runPowerShell(`
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class NativeMouse {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  [DllImport("user32.dll")] public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, int dwExtraInfo);
}
"@
[NativeMouse]::SetCursorPos(${px}, ${py}) | Out-Null
[NativeMouse]::mouse_event(0x0800, 0, 0, ${delta}, 0)
`);
    }
}

module.exports = {
    handleInputEvent,
};
