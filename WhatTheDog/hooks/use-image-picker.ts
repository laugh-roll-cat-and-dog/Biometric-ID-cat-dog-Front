import { ImagePickerResult, PickedImage } from "@/types";
import { toUserErrorMessage } from "@/utils/user-error";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export const useImagePickerHook = (): ImagePickerResult => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResizeAction = (
    asset: ImagePicker.ImagePickerAsset,
  ): ImageManipulator.Action[] => {
    const maxDimension = 1600;
    const { width, height } = asset;

    if (
      !width ||
      !height ||
      (width <= maxDimension && height <= maxDimension)
    ) {
      return [];
    }

    if (width >= height) {
      return [{ resize: { width: maxDimension } }];
    }

    return [{ resize: { height: maxDimension } }];
  };

  const normalizeToJpeg = async (
    asset: ImagePicker.ImagePickerAsset,
  ): Promise<PickedImage> => {
    const originalName =
      asset.fileName || asset.uri.split("/").pop() || `image_${Date.now()}`;
    const baseName = originalName.replace(/\.[^/.]+$/, "");

    const manipulated = await ImageManipulator.manipulateAsync(
      asset.uri,
      getResizeAction(asset),
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return {
      uri: manipulated.uri,
      name: `${baseName}.jpg`,
      type: "image/jpeg",
      width: manipulated.width,
      height: manipulated.height,
    };
  };

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
        setError(toUserErrorMessage("permission denied", "gallery"));
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
        const newImages = await Promise.all(
          result.assets.map((asset) => normalizeToJpeg(asset)),
        );
        if (allowMultiple) {
          setImages([...images, ...newImages]);
          setImage(null);
        } else {
          setImage(newImages[0]);
          setImages([]);
        }
      }
    } catch (err) {
      setError(toUserErrorMessage(err, "gallery"));
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
        setError(toUserErrorMessage("permission denied", "camera"));
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const newImage = await normalizeToJpeg(asset);

        if (allowMultiple) {
          setImages([...images, newImage]);
          setImage(null);
        } else {
          setImage(newImage);
          setImages([]);
        }
      }
    } catch (err) {
      setError(toUserErrorMessage(err, "camera"));
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
