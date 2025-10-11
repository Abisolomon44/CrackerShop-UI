import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Check if a value is duplicate in a list of objects (active only)
   * Spaces are ignored, case-insensitive
   * @param value string to check
   * @param list array of objectsa
   * @param fieldName field to check in object
   * @param ignoreId optional: ID to ignore (for edit)
   * @returns true if duplicate exists
   */
  isDuplicate(
    value: string | undefined,
    list: any[],
    fieldName: string,
    ignoreId?: number
  ): boolean {
    if (!value) return false;

    // Remove all spaces and convert to lowercase
    const normalizedValue = value.replace(/\s+/g, '').toLowerCase();

    return list.some(item => {
      const itemValue = (item[fieldName] || '').replace(/\s+/g, '').toLowerCase();
      const isActive = item['isActive'] || item['IsActive'] || false;

      return isActive && itemValue === normalizedValue && item[`${fieldName}ID`] !== ignoreId;
    });
  }
}
