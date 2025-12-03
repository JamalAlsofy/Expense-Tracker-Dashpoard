export const STORAGE_KEYS = {
    EXPENSE: 'app_expense_v1',
  UI_STATE: 'app_expense_ui_state_v1',
  THEME: 'app_theme_v1'
};
export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function loadFromStorage<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as T : null;
}
