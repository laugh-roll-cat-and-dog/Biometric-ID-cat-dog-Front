import { ImagePickerResult, PickedImage } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export const useImagePickerHook = (): ImagePickerResult => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    return {
      camera: cameraPermission.status === "granted",
      gallery: galleryPermission.status === "granted",
    };
  };

  const pickImageFromGallery = async (allowMultiple = false) => {
    setLoading(true);
    setError(null);

    try {
      const permissions = await requestPermissions();

      if (!permissions.gallery) {
        setError("Gallery permission denied");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        ...(allowMultiple && { allowsMultiple: true }),
        quality: 0.8,
      } as any);

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.uri.split("/").pop() || `image_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        }));
        if (allowMultiple) {
          setImages([...images, ...newImages]);
          setImage(null);
        } else {
          setImage(newImages[0]);
          setImages([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pick image");
    } finally {
      setLoading(false);
    }
  };

  const takePhotoWithCamera = async (allowMultiple = false) => {
    setLoading(true);
    setError(null);

    try {
      const permissions = await requestPermissions();

      if (!permissions.camera) {
        setError("Camera permission denied");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const filename =
          asset.uri.split("/").pop() || `photo_${Date.now()}.jpg`;

        const newImage = {
          uri: asset.uri,
          name: filename,
          type: asset.type || "image/jpeg",
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        };

        if (allowMultiple) {
          setImages([...images, newImage]);
          setImage(null);
        } else {
          setImage(newImage);
          setImages([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to take photo");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (index?: number) => {
    if (index !== undefined) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      setImage(null);
      setError(null);
    }
  };

  const clearAllImages = () => {
    setImage(null);
    setImages([]);
    setError(null);
  };

  return {
    image,
    images,
    loading,
    error,
    pickImageFromGallery,
    takePhotoWithCamera,
    clearImage,
    clearAllImages,
  };
};
