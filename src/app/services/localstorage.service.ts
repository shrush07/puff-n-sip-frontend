import { Injectable } from '@angular/core';
import { isBrowser } from '../utils/is-browser';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly TOKEN_KEY = 'token';

  constructor() { }

  // Set item
  setItem(key: string, value: string): void {
    if (isBrowser()) {
      try {
        localStorage.setItem(key, value);
        console.log(`Item stored for key: ${key}`);
      } catch (error) {
        console.error('Error storing item:', error);
      }
    }
  }

  // Get item
  getItem(key: string): string | null {
    if (isBrowser()) {
      try {
        const value = localStorage.getItem(key);
        console.log(`Retrieved value for key ${key}:`, value);
        return value;
      } catch (error) {
        console.error('Error retrieving item:', error);
        return null;
      }
    }
    return null;
  }

  // Remove item
  removeItem(key: string): void {
    if (isBrowser()) {
      try {
        localStorage.removeItem(key);
        console.log(`Removed item with key: ${key}`);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  }

  // Clear all items
  clear(): void {
    if (isBrowser()) {
      try {
        localStorage.clear();
        console.log('Local storage cleared');
      } catch (error) {
        console.error('Error clearing local storage:', error);
      }
    }
  }

  // Token specific methods
  setToken(token: string): void {
    this.setItem(this.TOKEN_KEY, token);
    console.log('Token set successfully:', token);
  }

  getToken(): string | null {
    const token = this.getItem(this.TOKEN_KEY);
    if (token) {
      console.log('Token retrieved successfully:', token);
    } else {
      console.warn('No token found in local storage');
    }
    return token;
  }

  removeToken(): void {
    this.removeItem(this.TOKEN_KEY);
    console.log('Token removed');
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }
}