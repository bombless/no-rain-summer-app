import { invoke } from "@tauri-apps/api/core";
export function log() {
    const msg = Array.prototype.map.call(arguments, arg => String(arg)).join('\n');
    invoke('log_string', { msg }).then(_ => {});
}
