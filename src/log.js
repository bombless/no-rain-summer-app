import { invoke } from "@tauri-apps/api/core";
export function log() {
    const msg = Array.prototype.map.call(arguments, arg => String(arg)).join('\n');
    return invoke('log_string', { msg });
}
