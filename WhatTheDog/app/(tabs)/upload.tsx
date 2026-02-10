import { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Image as RNImage,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Card } from "@/components/common/Card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getUploadStyles } from "@/constants/style";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useImagePickerHook } from "@/hooks/use-image-picker";
import { uploadMultipleDogImages } from "@/services/api";

const AGE_OPTIONS = [
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6 years",
  "7 years",
  "8 years",
  "9 years",
  "10+ years",
];
const MAX_DESCRIPTION_LENGTH = 200;

export default function UploadScreen() {
  const colorScheme = useColorScheme();
  const styles = getUploadStyles(colorScheme ?? "light");
  const {
    image,
    images,
    pickImageFromGallery,
    takePhotoWithCamera,
    clearImage,
    clearAllImages,
  } = useImagePickerHook();

  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (!dogName.trim()) {
      setError("Please enter the dog's name");
      return false;
    }
    if (images.length === 0) {
      setError("Please select at least one image");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setDogName("");
    setBreed("");
    setAge("");
    setDescription("");
    clearAllImages();
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Extract numeric age from string like "3 years"
      const ageNum = age ? parseInt(age.split(" ")[0], 10) : undefined;

      const uploadData = {
        name: dogName.trim(),
        breed: breed.trim(),
        age: ageNum,
        description: description.trim() || undefined,
      };

      console.log("[Upload] Upload data:", uploadData);
      console.log("[Upload] Number of images:", images.length);

      // Upload multiple images
      const imageUris = images.map((img) => img.uri);
      console.log("[Upload] Image URIs:", imageUris);

      const response = await uploadMultipleDogImages(imageUris, uploadData);

      console.log("[Upload] Response:", response);

      if (response?.success) {
        setSuccess(true);
        Alert.alert("Success", "Dog image(s) uploaded successfully!", [
          {
            text: "OK",
            onPress: resetForm,
          },
        ]);
      } else {
        setError(response?.message || "Upload failed");
      }
    } catch (err) {
      console.error("[Upload] Catch error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during upload",
      );
    } finally {
      setLoading(false);
    }
  };

  const showAgePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...AGE_OPTIONS],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setAge(AGE_OPTIONS[buttonIndex - 1]);
          }
        },
      );
    } else {
      // For Android, you might want to use a proper picker component
      // For now, we'll just cycle through options on tap
      const currentIndex = AGE_OPTIONS.indexOf(age);
      const nextIndex = (currentIndex + 1) % AGE_OPTIONS.length;
      setAge(AGE_OPTIONS[nextIndex]);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.headerSection}>
          <ThemedText type="title" style={styles.headerTitle}>
            Add New Dog 🐶
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Share your furry friend with the community
          </ThemedText>
        </ThemedView>

        {/* Upload Section */}
        <Card>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Upload Dog Photos
          </ThemedText>

          {images.length === 0 ? (
            <ThemedView style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.cameraIconButton}
                onPress={takePhotoWithCamera}
              >
                <ThemedText style={styles.cameraIcon}>📷</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.uploadIcon}>🖼️</ThemedText>
              <ThemedText style={styles.uploadTitle}>
                Upload photos of your dog
              </ThemedText>
              <ThemedText style={styles.uploadSubtitle}>
                Select multiple images · JPG, PNG · Max 5MB each
              </ThemedText>

              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => pickImageFromGallery(true)}
              >
                <ThemedText style={styles.galleryButtonIcon}>📁</ThemedText>
                <ThemedText style={styles.galleryButtonText}>
                  Choose from Gallery
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <ThemedView style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.cameraIconButton}
                onPress={takePhotoWithCamera}
              >
                <ThemedText style={styles.cameraIcon}>📷</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.imageCountText}>
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.multiImageScroll}
              >
                {images.map((img, index) => (
                  <View key={index} style={styles.multiImageItemContainer}>
                    <RNImage
                      source={{ uri: img.uri }}
                      style={styles.multiImagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeButtonSmall}
                      onPress={() => clearImage(index)}
                    >
                      <ThemedText
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 10,
                        }}
                      >
                        ✕
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={() => pickImageFromGallery(true)}
                >
                  <ThemedText style={styles.addMoreButtonText}>
                    + Add more
                  </ThemedText>
                </TouchableOpacity>
              </ScrollView>
            </ThemedView>
          )}
        </Card>

        {/* Dog Information Section */}
        <Card>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Dog Information
          </ThemedText>

          {/* Name Field */}
          <ThemedView style={styles.formGroup}>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.labelIcon}>🐾</ThemedText>
              <ThemedText style={styles.label}>Dog Name</ThemedText>
              <ThemedText style={styles.required}>*</ThemedText>
            </ThemedView>
            <TextInput
              style={styles.input}
              placeholder="Max, Bella, Charlie"
              placeholderTextColor="#999"
              value={dogName}
              onChangeText={setDogName}
              editable={!loading}
            />
          </ThemedView>

          {/* Breed Field */}
          <ThemedView style={styles.formGroup}>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.labelIcon}>🧬</ThemedText>
              <ThemedText style={styles.label}>Breed</ThemedText>
              <ThemedText style={styles.optional}>(optional)</ThemedText>
            </ThemedView>
            <TextInput
              style={styles.input}
              placeholder="Golden Retriever"
              placeholderTextColor="#999"
              value={breed}
              onChangeText={setBreed}
              editable={!loading}
            />
          </ThemedView>

          {/* Age Field */}
          <ThemedView style={styles.formGroup}>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.labelIcon}>🎂</ThemedText>
              <ThemedText style={styles.label}>Age (years)</ThemedText>
              <ThemedText style={styles.optional}>(optional)</ThemedText>
            </ThemedView>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="1"
              placeholderTextColor="#999"
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
              editable={!loading}
            />
          </ThemedView>

          {/* Description Field */}
          <ThemedView style={styles.formGroup}>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.labelIcon}>✏️</ThemedText>
              <ThemedText style={styles.label}>
                Tell us about your dog
              </ThemedText>
              <ThemedText style={styles.optional}>(optional)</ThemedText>
            </ThemedView>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Friendly, loves water, great with kids..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={(text) => {
                if (text.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(text);
                }
              }}
              multiline
              numberOfLines={3}
              editable={!loading}
              textAlignVertical="top"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <ThemedText style={styles.characterCounter}>
              {description.length} / {MAX_DESCRIPTION_LENGTH}
            </ThemedText>
          </ThemedView>
        </Card>

        {/* Messages */}
        {error && (
          <ThemedView style={styles.errorAlert}>
            <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          </ThemedView>
        )}

        {success && (
          <ThemedView style={styles.successAlert}>
            <ThemedText style={styles.successText}>
              ✓ Dog added successfully!
            </ThemedText>
          </ThemedView>
        )}

        {/* Action Buttons */}
        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <ThemedText style={styles.uploadButtonIcon}>🐾</ThemedText>
                <ThemedText style={styles.uploadButtonText}>
                  Share My Dog
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {!loading && (
            <TouchableOpacity style={styles.clearButton} onPress={resetForm}>
              <ThemedText style={styles.clearButtonText}>Clear Form</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        <ThemedView style={styles.requiredNote}>
          <ThemedText style={styles.requiredNoteText}>
            * = Required fields
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles are centralized in constants/style.ts
