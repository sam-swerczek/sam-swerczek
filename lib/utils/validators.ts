/**
 * Validation utilities for user input
 * Ensures proper format and prevents malicious input
 */

/**
 * Validate UUID v4 format
 * @param uuid - String to validate
 * @returns true if valid UUID v4, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  // UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate and sanitize UUID input
 * Throws error if invalid - use in API routes for immediate error response
 *
 * @param uuid - UUID string to validate
 * @param paramName - Parameter name for error messages (e.g., 'postId', 'commentId')
 * @returns The validated UUID string
 * @throws Error if invalid UUID format
 */
export function validateUUID(uuid: string | null, paramName: string = 'id'): string {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error(`${paramName} is required`);
  }

  if (!isValidUUID(uuid)) {
    throw new Error(`Invalid ${paramName} format`);
  }

  return uuid;
}

/**
 * Validate multiple UUIDs at once
 * @param uuids - Array of UUID strings to validate
 * @param paramName - Parameter name for error messages
 * @returns Array of validated UUIDs
 * @throws Error if any UUID is invalid
 */
export function validateUUIDs(uuids: string[], paramName: string = 'id'): string[] {
  if (!Array.isArray(uuids) || uuids.length === 0) {
    throw new Error(`${paramName} array is required and cannot be empty`);
  }

  const invalidUUIDs = uuids.filter(uuid => !isValidUUID(uuid));

  if (invalidUUIDs.length > 0) {
    throw new Error(`Invalid ${paramName} format: ${invalidUUIDs.join(', ')}`);
  }

  return uuids;
}
