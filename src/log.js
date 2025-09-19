import { invoke } from "@tauri-apps/api/core";
export function log() {
    const msg = Array.prototype.map.call(arguments, format).join('\n') + '\n' + new Array(80).join('-') + '\n';
    invoke('log_string', { msg }).then(_ => {});
}

function format(val) {
    if (val instanceof Array) {
        return JSON.stringify(val);
    }
    if (val instanceof Object) {
        return JSON.stringify(val);
    }
    return String(val);
}
