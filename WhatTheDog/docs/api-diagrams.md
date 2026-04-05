# API Flow and Sequence Diagrams

This document describes each exported API operation in [services/api.ts](../services/api.ts).

## 1) testConnection

### Flow Diagram
```mermaid
flowchart TD
  A[Start testConnection] --> B[Log base URL]
  B --> C[GET /health]
  C --> D{Request succeeds?}
  D -- Yes --> E[Log success]
  E --> F[Return true]
  D -- No --> G[Log error]
  G --> H[Return false]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: testConnection()
  API->>AX: GET /health
  AX->>BE: HTTP GET /health
  alt Success
    BE-->>AX: 200 + payload
    AX-->>API: response
    API-->>UI: true
  else Failure
    BE--xAX: Error/timeout/network issue
    AX--xAPI: error
    API-->>UI: false
  end
```

## 2) searchDogByText

### Flow Diagram
```mermaid
flowchart TD
  A[Start searchDogByText query searchMode] --> B[Build JSON body]
  B --> C[POST /search]
  C --> D{Request succeeds?}
  D -- Yes --> E[Return response.data as SearchResponse]
  D -- No --> F[Throw Error Text search failed]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: searchDogByText(query, searchMode)
  API->>AX: POST /search { query, search_mode }
  AX->>BE: HTTP POST /search
  alt Success
    BE-->>AX: 200 + SearchResponse
    AX-->>API: response.data
    API-->>UI: SearchResponse
  else Failure
    BE--xAX: 4xx/5xx/network error
    AX--xAPI: error
    API--xUI: Error("Text search failed: ...")
  end
```

## 3) searchDogByImage

### Flow Diagram
```mermaid
flowchart TD
  A[Start searchDogByImage imageUri imageType] --> B[Create FormData]
  B --> C[Derive filename and mime type]
  C --> D[Append image field to FormData]
  D --> E[POST /searchByImage]
  E --> F{Request succeeds?}
  F -- Yes --> G[Return response.data as SearchResponse]
  F -- No --> H[Throw Error Image search failed]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: searchDogByImage(imageUri, imageType)
  API->>API: Build multipart FormData with image
  API->>AX: POST /searchByImage (FormData)
  AX->>BE: HTTP multipart POST /searchByImage
  alt Success
    BE-->>AX: 200 + SearchResponse
    AX-->>API: response.data
    API-->>UI: SearchResponse
  else Failure
    BE--xAX: Error response/network failure
    AX--xAPI: error
    API--xUI: Error("Image search failed: ...")
  end
```

## 4) uploadDogImage

### Flow Diagram
```mermaid
flowchart TD
  A[Start uploadDogImage imageUri dogData] --> B[Log upload context]
  B --> C[Create FormData]
  C --> D[Append image plus name breed age description]
  D --> E[POST /upload/photo with upload timeout]
  E --> F{Request succeeds?}
  F -- Yes --> G[Map backend response to UploadResponse]
  G --> H[Return success true and message]
  F -- No --> I[getApiErrorMessage error]
  I --> J[Throw Error Upload failed message]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: uploadDogImage(imageUri, dogData)
  API->>API: Build multipart FormData (images + dog fields)
  API->>AX: POST /upload/photo (FormData, timeout=UPLOAD_TIMEOUT)
  AX->>BE: HTTP multipart POST /upload/photo
  alt Success
    BE-->>AX: 200 + { message, filename, ... }
    AX-->>API: uploadResponse
    API-->>UI: { success: true, message }
  else Failure
    BE--xAX: timeout or 4xx/5xx/network error
    AX--xAPI: error
    API->>API: getApiErrorMessage(error)
    API--xUI: Error("Upload failed: ...")
  end
```

## 5) uploadMultipleDogImages

### Flow Diagram
```mermaid
flowchart TD
  A[Start uploadMultipleDogImages imageUris dogData] --> B{imageUris empty?}
  B -- Yes --> C[Throw Error No images provided]
  B -- No --> D[Create FormData]
  D --> E[For each URI append images field]
  E --> F[Append name breed age description]
  F --> G[POST /upload/photo with upload timeout]
  G --> H{Request succeeds?}
  H -- Yes --> I[Return success message with image count]
  H -- No --> J[getApiErrorMessage error]
  J --> K[Throw Error Batch upload failed]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: uploadMultipleDogImages(imageUris, dogData)
  alt No images
    API--xUI: Error("No images provided for upload")
  else Has images
    API->>API: Build multipart FormData with multiple images + dog fields
    API->>AX: POST /upload/photo (FormData, timeout=UPLOAD_TIMEOUT)
    AX->>BE: HTTP multipart POST /upload/photo
    alt Success
      BE-->>AX: 200
      AX-->>API: response
      API-->>UI: { success: true, message: count summary }
    else Failure
      BE--xAX: timeout or 4xx/5xx/network error
      AX--xAPI: error
      API->>API: getApiErrorMessage(error)
      API--xUI: Error("Batch upload failed: ...")
    end
  end
```

## 6) getAllDogs

### Flow Diagram
```mermaid
flowchart TD
  A[Start getAllDogs] --> B[GET /dogs]
  B --> C{Request succeeds?}
  C -- Yes --> D[Return response.data as SearchResponse]
  C -- No --> E[Throw Error Failed to fetch dogs]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant UI as Caller
  participant API as services/api.ts
  participant AX as Axios Instance
  participant BE as Backend

  UI->>API: getAllDogs()
  API->>AX: GET /dogs
  AX->>BE: HTTP GET /dogs
  alt Success
    BE-->>AX: 200 + SearchResponse
    AX-->>API: response.data
    API-->>UI: SearchResponse
  else Failure
    BE--xAX: 4xx/5xx/network error
    AX--xAPI: error
    API--xUI: Error("Failed to fetch dogs: ...")
  end
```

## Notes

- Base URL and endpoint constants are defined in [config/api.ts](../config/api.ts).
- Request and response interceptors in [services/api.ts](../services/api.ts) log traffic and propagate errors.
- Upload endpoints can run with no client timeout because `UPLOAD_TIMEOUT` is set to `0`.
