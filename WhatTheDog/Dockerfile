FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
# Note the specific structure required by Android SDK: cmdline-tools/latest/bin
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Install System Dependencies & Node.js 20
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk-headless \
    wget \
    curl \
    git \
    unzip \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Setup Android SDK
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    # Move tools to 'latest' subdirectory so sdkmanager works correctly
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Accept licenses and install Android SDK components needed by Expo/RN native modules
RUN yes | sdkmanager --licenses && \
        sdkmanager \
            "platform-tools" \
            "platforms;android-36" \
            "build-tools;36.0.0" \
            "cmake;3.22.1" \
            "ndk;27.1.12297006"

WORKDIR /workspace

# Install dependencies using npm ci for stability
COPY package*.json ./
RUN npm ci

COPY . .

# Generate the /android directory
RUN npx expo prebuild --platform android --clean

# Docker tuning for React Native native build:
# - keep newArchEnabled=true (required by react-native-reanimated)
# - build only arm64-v8a to reduce CMake workload
# - disable Gradle parallelism and raise memory headroom
RUN sed -i 's/^newArchEnabled=.*/newArchEnabled=true/' android/gradle.properties && \
    sed -i 's/^org.gradle.parallel=.*/org.gradle.parallel=false/' android/gradle.properties && \
    sed -i 's/^reactNativeArchitectures=.*/reactNativeArchitectures=arm64-v8a/' android/gradle.properties && \
    sed -i 's/^org.gradle.jvmargs=.*/org.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=1024m/' android/gradle.properties

# Conservative daemon settings with enough memory for CMake/native modules
ENV GRADLE_OPTS="-Xmx3072m -Dorg.gradle.daemon=false"

# Build Release APK
RUN cd android && \
    chmod +x gradlew && \
    ./gradlew :app:assembleRelease -x lint --max-workers=1 --no-daemon

CMD ["/bin/bash"]