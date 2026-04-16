import { isPlatformBrowser } from '@angular/common';

export function getAuthToken(platformId: Object): string | null {
  if (!isPlatformBrowser(platformId)) {
    return null;
  }

  return localStorage.getItem('token');
}