import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image as RNImage,
  SafeAreaView,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Card } from "@/components/common/Card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getSearchStyles } from "@/constants/style";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useImagePickerHook } from "@/hooks/use-image-picker";
import {
  DogSearchResult,
  searchDogByImage,
  searchDogByText,
} from "@/services/api";

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getSearchStyles(colorScheme ?? "light");
  const { image, pickImageFromGallery, takePhotoWithCamera, clearImage } =
    useImagePickerHook();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DogSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"text" | "image">("text");
  const [textSearchMode, setTextSearchMode] = useState<"name" | "id">("name");

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await searchDogByText(searchQuery, textSearchMode);
      if (response.results && response.results.length > 0) {
        setResults(response.results);
      } else {
        setError("No dogs found matching your search");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during search",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await searchDogByImage(image.uri, image.type);
      if (response.results && response.results.length > 0) {
        setResults(response.results);
      } else {
        setError("No matching dogs found");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during image search",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderResultItem = ({ item }: { item: DogSearchResult }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/dog-detail",
          params: { dogData: JSON.stringify(item) },
        });
      }}
    >
      <ThemedView style={styles.resultCard}>
        {item.images && item.images.length > 0 && (
          <RNImage
            source={{ uri: `file://${item.images[0].path}` }}
            style={styles.resultImage}
          />
        )}
        <ThemedView style={styles.resultContent}>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText
              type="subtitle"
              numberOfLines={1}
              style={[styles.resultName, { flex: 1 }]}
            >
              {item.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
              #{item.id}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

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
            Find Dogs
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Search by text or image
          </ThemedText>
        </ThemedView>

        {/* Search Mode Toggle */}
        <ThemedView style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              searchType === "text" && styles.toggleButtonActive,
              {
                backgroundColor:
                  searchType === "text"
                    ? Colors[colorScheme ?? "light"].tint
                    : Colors[colorScheme ?? "light"].surface,
              },
            ]}
            onPress={() => {
              setSearchType("text");
              clearImage();
              setResults([]);
              setError(null);
            }}
          >
            <ThemedText
              style={[
                styles.toggleText,
                searchType === "text" && styles.toggleTextActive,
              ]}
            >
              🔤 Text
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              searchType === "image" && styles.toggleButtonActive,
              {
                backgroundColor:
                  searchType === "image"
                    ? Colors[colorScheme ?? "light"].tint
                    : Colors[colorScheme ?? "light"].surface,
              },
            ]}
            onPress={() => {
              setSearchType("image");
              setSearchQuery("");
              setResults([]);
              setError(null);
            }}
          >
            <ThemedText
              style={[
                styles.toggleText,
                searchType === "image" && styles.toggleTextActive,
              ]}
            >
              🖼️ Image
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Text Search */}
        {searchType === "text" && (
          <Card>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              {textSearchMode === "id" ? "Search by ID" : "Search by Name"}
            </ThemedText>

            {/* ID/Name Toggle and Input */}
            <ThemedView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <ThemedView
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: textSearchMode === "name" ? "600" : "400",
                    opacity: textSearchMode === "name" ? 1 : 0.5,
                  }}
                >
                  📝
                </ThemedText>
                <Switch
                  value={textSearchMode === "id"}
                  onValueChange={(value) => {
                    setTextSearchMode(value ? "id" : "name");
                    setSearchQuery("");
                  }}
                  trackColor={{
                    false: Colors[colorScheme ?? "light"].tint,
                    true: Colors[colorScheme ?? "light"].tint,
                  }}
                  thumbColor="#ffffff"
                  ios_backgroundColor={Colors[colorScheme ?? "light"].tint}
                />
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: textSearchMode === "id" ? "600" : "400",
                    opacity: textSearchMode === "id" ? 1 : 0.5,
                  }}
                >
                  🔢
                </ThemedText>
              </ThemedView>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder={
                  textSearchMode === "id" ? "e.g., 123..." : "e.g., Max..."
                }
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={(text) => {
                  if (textSearchMode === "id") {
                    setSearchQuery(text.replace(/[^0-9]/g, ""));
                  } else {
                    setSearchQuery(text);
                  }
                }}
                keyboardType={textSearchMode === "id" ? "numeric" : "default"}
                editable={!loading}
              />
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.searchButton,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleTextSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <ThemedText style={styles.searchButtonIcon}>🔍</ThemedText>
                  <ThemedText style={styles.searchButtonText}>
                    Search
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </Card>
        )}

        {/* Image Search */}
        {searchType === "image" && (
          <Card>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Search by Image
            </ThemedText>

            {image ? (
              <ThemedView style={styles.imageSelectedContainer}>
                <RNImage
                  source={{ uri: image.uri }}
                  style={styles.selectedImage}
                />
                <ThemedView style={styles.imageInfo}>
                  <ThemedText style={styles.imageName} numberOfLines={1}>
                    {image.name}
                  </ThemedText>
                  <ThemedText style={styles.imageDimensions}>
                    {image.width}×{image.height}px
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity
                  style={styles.clearImageButton}
                  onPress={() => clearImage()}
                >
                  <ThemedText style={{ fontSize: 18 }}>✕</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              <ThemedView style={styles.imagePickerButtons}>
                <TouchableOpacity
                  style={[
                    styles.imageButton,
                    { backgroundColor: Colors[colorScheme ?? "light"].tint },
                  ]}
                  onPress={() => pickImageFromGallery()}
                >
                  <ThemedText style={styles.imageButtonIcon}>🖼️</ThemedText>
                  <ThemedText style={styles.imageButtonText}>
                    Gallery
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.imageButton,
                    { backgroundColor: Colors[colorScheme ?? "light"].tint },
                  ]}
                  onPress={takePhotoWithCamera}
                >
                  <ThemedText style={styles.imageButtonIcon}>📷</ThemedText>
                  <ThemedText style={styles.imageButtonText}>Camera</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}

            {image && (
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { backgroundColor: Colors[colorScheme ?? "light"].tint },
                  loading && { opacity: 0.6 },
                ]}
                onPress={handleImageSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <ThemedText style={styles.searchButtonIcon}>🔍</ThemedText>
                    <ThemedText style={styles.searchButtonText}>
                      Search Image
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            )}
          </Card>
        )}

        {/* Error */}
        {error && (
          <ThemedView style={styles.errorAlert}>
            <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          </ThemedView>
        )}

        {/* Results */}
        {results.length > 0 && (
          <ThemedView style={styles.resultsSection}>
            <ThemedView style={styles.resultHeader}>
              <ThemedText type="subtitle">Results</ThemedText>
              <ThemedView style={styles.resultCount}>
                <ThemedText style={styles.resultCountText}>
                  {results.length}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <FlatList
              data={results}
              renderItem={renderResultItem}
              keyExtractor={(item, index) =>
                item.id !== undefined && item.id !== null
                  ? String(item.id)
                  : `result-${index}`
              }
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </ThemedView>
        )}

        {results.length === 0 &&
          !loading &&
          !error &&
          searchQuery === "" &&
          !image && (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateIcon}>🐕</ThemedText>
              <ThemedText style={styles.emptyStateTitle}>
                Ready to Search?
              </ThemedText>
              <ThemedText style={styles.emptyStateText}>
                Enter a breed name or upload an image to find matching dogs
              </ThemedText>
            </ThemedView>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

// styles are centralized in constants/style.ts
