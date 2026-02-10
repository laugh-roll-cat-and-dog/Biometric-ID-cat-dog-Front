/**
 * Dog Search and Upload Type Definitions
 */

export interface DogImageInfo {
  filename: string;
  path: string;
  photo_id: number;
}

export interface DogSearchResult {
  id: string | number;
  name: string;
  breed: string;
  age?: number;
  description?: string;
  image?: string;
  first_image?: DogImageInfo;
  images?: DogImageInfo[];
  confidence?: number;
  [key: string]: any;
}

export interface SearchResponse {
  success?: boolean;
  message: string;
  results: DogSearchResult[];
  count?: number;
  query?: string;
  search_column?: string;
}

export interface UploadResponse {
  success: boolean;
  dogId?: string;
  message: string;
}

export interface DogUploadData {
  name: string;
  breed: string;
  age?: number;
  description?: string;
  [key: string]: any;
}

export interface PickedImage {
  uri: string;
  name: string;
  type: string;
  width: number;
  height: number;
  size?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ImagePickerResult {
  image: PickedImage | null;
  images: PickedImage[];
  loading: boolean;
  error: string | null;
  pickImageFromGallery: (allowMultiple?: boolean) => Promise<void>;
  takePhotoWithCamera: () => Promise<void>;
  clearImage: (index?: number) => void;
  clearAllImages: () => void;
}
