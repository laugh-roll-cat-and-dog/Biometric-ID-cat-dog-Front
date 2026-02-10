import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import {
    Image as RNImage,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getSearchStyles } from "@/constants/style";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DogSearchResult } from "@/services/api";

export default function DogDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const styles = getSearchStyles(colorScheme ?? "light");
  const params = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  let dogData: DogSearchResult | null = null;
  if (params.dogData && typeof params.dogData === "string") {
    try {
      dogData = JSON.parse(params.dogData);
    } catch (e) {
      console.error("Failed to parse dog data:", e);
    }
  }

  if (!dogData) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText>Dog not found</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const imagesToShow =
    dogData.images && dogData.images.length > 0
      ? dogData.images
      : dogData.first_image
        ? [dogData.first_image]
        : [];

  const labelStyle = {
    fontSize: 12,
    opacity: 0.9,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    color: Colors[colorScheme ?? "light"].tint,
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <ThemedView
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors[colorScheme ?? "light"].surface,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme ?? "light"].tint + "22",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingRight: 12, paddingVertical: 6 }}
          >
            <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={{ flex: 1 }}>
            Dog Details
          </ThemedText>
        </ThemedView>

        {/* Images */}
        {imagesToShow.length === 1 && (
          <ThemedView
            style={{
              margin: 16,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: Colors[colorScheme ?? "light"].surface,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <RNImage
              source={{ uri: `file://${imagesToShow[0].path}` }}
              style={{ width: "100%", height: 280 }}
            />
          </ThemedView>
        )}

        {imagesToShow.length > 1 && (
          <ThemedView style={{ marginTop: 16, marginBottom: 8 }}>
            <ThemedView
              style={{
                paddingHorizontal: 16,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ThemedText type="subtitle">Photos</ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                {imagesToShow.length} images
              </ThemedText>
            </ThemedView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {imagesToShow.map((img) => (
                <ThemedView
                  key={img.photo_id}
                  style={{
                    marginRight: 12,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <RNImage
                    source={{ uri: `file://${img.path}` }}
                    style={{ width: 240, height: 240 }}
                  />
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>
        )}

        {/* Details Card */}
        <ThemedView
          style={{
            margin: 16,
            padding: 16,
            gap: 20,
            borderRadius: 16,
            backgroundColor: Colors[colorScheme ?? "light"].surface,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {/* Name and ID */}
          <ThemedView style={{ gap: 8 }}>
            <ThemedText style={labelStyle}>NAME</ThemedText>
            <ThemedText type="title" style={{ fontSize: 28 }}>
              {dogData.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 14, opacity: 0.7 }}>
              ID: {dogData.id}
            </ThemedText>
          </ThemedView>

          {/* Breed */}
          <ThemedView style={{ gap: 8 }}>
            <ThemedText style={labelStyle}>BREED</ThemedText>
            <ThemedText style={{ fontSize: 16 }}>{dogData.breed}</ThemedText>
          </ThemedView>

          {/* Age */}
          {dogData.age !== undefined && dogData.age !== null && (
            <ThemedView style={{ gap: 8 }}>
              <ThemedText style={labelStyle}>AGE</ThemedText>
              <ThemedText style={{ fontSize: 16 }}>
                🎂 {dogData.age} year{dogData.age !== 1 ? "s" : ""} old
              </ThemedText>
            </ThemedView>
          )}

          {/* Description */}
          {dogData.description && (
            <ThemedView style={{ gap: 8 }}>
              <ThemedText style={labelStyle}>DESCRIPTION</ThemedText>
              <ThemedText style={{ fontSize: 16, lineHeight: 24 }}>
                {dogData.description}
              </ThemedText>
            </ThemedView>
          )}

          {/* Image Info */}
          {imagesToShow.length > 0 && (
            <ThemedView
              style={{
                gap: 8,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: Colors[colorScheme ?? "light"].tint + "20",
              }}
            >
              <ThemedText style={labelStyle}>PHOTO ID</ThemedText>
              <ThemedText style={{ fontSize: 14, opacity: 0.8 }}>
                #{imagesToShow[0].photo_id}
              </ThemedText>
              <ThemedText style={[labelStyle, { marginTop: 8 }]}>
                FILE
              </ThemedText>
              <ThemedText
                style={{ fontSize: 13, opacity: 0.7, fontFamily: "monospace" }}
                numberOfLines={3}
              >
                {imagesToShow[0].filename}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
