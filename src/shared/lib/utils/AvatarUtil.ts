import { type Nullable } from '../types';

export class AvatarUtil {
  static getInitialsBackground = (initials: string): string => {
    const availableColors = [
      'var(--avatar-orange-grad)',
      'var(--avatar-orange-light-grad)',
      'var(--avatar-red-grad)',
      'var(--avatar-blue-grad)',
      'var(--avatar-green-grad)',
      'var(--avatar-gray-grad)',
    ];

    // use a simple hash function to generate a consistent number for the initials
    const hash = (s: string): number => {
      let hashValue = 0;

      for (let i = 0; i < s.length; i++) {
        hashValue += s.charCodeAt(i);
      }

      return hashValue;
    };

    // map the hash value of initials to an index in the availableColors array
    const hashValue = hash(initials);
    const colorIdx = Math.abs(hashValue) % availableColors.length;

    return availableColors[colorIdx] ?? 'var(--avatar-gray-grad)';
  };

  static extractInitials = (firstName: string, lastName: Nullable<string>): string => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName?.trim();

    if (!trimmedFirstName[0]) {
      throw new Error(
        `No first name provided or it is an empty string, received: ${trimmedFirstName}`
      );
    }

    const firstLetter = trimmedFirstName[0].toUpperCase();
    const secondLetter =
      trimmedLastName && trimmedLastName[0] ? trimmedLastName[0].toUpperCase() : firstLetter;

    if (trimmedFirstName && !trimmedLastName) return firstLetter;

    if (!trimmedFirstName && trimmedLastName) return secondLetter;

    return `${firstLetter}${secondLetter}`;
  };

  static generateAvatarTitle = (
    firstName: Nullable<string>,
    lastName: Nullable<string>
  ): string => {
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();

    if (trimmedFirstName && !trimmedLastName) {
      return trimmedFirstName;
    }

    if (!trimmedFirstName && trimmedLastName) {
      return trimmedLastName;
    }

    return `${trimmedFirstName} ${trimmedLastName}`;
  };
}
