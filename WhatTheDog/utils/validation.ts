/**
 * Validation utilities for dog search and upload
 */

export const validateDogName = (name: string): { valid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Dog name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Dog name must be at least 2 characters' };
  }
  if (name.trim().length > 50) {
    return { valid: false, error: 'Dog name must not exceed 50 characters' };
  }
  return { valid: true };
};

export const validateBreed = (breed: string): { valid: boolean; error?: string } => {
  if (!breed || !breed.trim()) {
    return { valid: false, error: 'Breed is required' };
  }
  if (breed.trim().length < 2) {
    return { valid: false, error: 'Breed must be at least 2 characters' };
  }
  if (breed.trim().length > 50) {
    return { valid: false, error: 'Breed must not exceed 50 characters' };
  }
  return { valid: true };
};

export const validateAge = (age: string | undefined): { valid: boolean; error?: string } => {
  if (!age) {
    return { valid: true }; // Optional field
  }
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum)) {
    return { valid: false, error: 'Age must be a valid number' };
  }
  if (ageNum < 0 || ageNum > 50) {
    return { valid: false, error: 'Age must be between 0 and 50' };
  }
  return { valid: true };
};

export const validateDescription = (description: string | undefined): { valid: boolean; error?: string } => {
  if (!description) {
    return { valid: true }; // Optional field
  }
  if (description.length > 500) {
    return { valid: false, error: 'Description must not exceed 500 characters' };
  }
  return { valid: true };
};

export const validateSearchQuery = (query: string): { valid: boolean; error?: string } => {
  if (!query || !query.trim()) {
    return { valid: false, error: 'Please enter a search query' };
  }
  if (query.trim().length < 2) {
    return { valid: false, error: 'Search query must be at least 2 characters' };
  }
  return { valid: true };
};
