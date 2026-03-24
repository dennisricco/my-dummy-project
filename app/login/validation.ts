// Validation module for login/register forms
// Extracted for independent testability

export type Mode = 'login' | 'register';

export function toggleMode(mode: Mode): Mode {
  return mode === 'login' ? 'register' : 'login';
}

export function validateEmail(value: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? null
    : 'Please enter a valid email address';
}

export function validatePasswordMin(value: string): string | null {
  return value.length >= 8
    ? null
    : 'Password must be at least 8 characters';
}

export function validatePasswordMatch(password: string, confirm: string): string | null {
  return password === confirm
    ? null
    : 'Passwords do not match';
}

export function validateRequired(value: string): string | null {
  return value.trim().length > 0
    ? null
    : 'This field is required';
}
