export const TERMINAL_OPEN_EVENT = 'mythcorp:open-terminal';

export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));
}
