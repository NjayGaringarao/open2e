# 🧠 Packaging Ollama with Phi-4-Mini for Open2E

This document explains how to **package the `.ollama` directory** so Open2E can include a **ready-to-use local runtime** (Ollama + Phi-4-Mini model) without requiring internet downloads.

---

## 📦 Overview

Ollama stores all downloaded models inside the user’s home directory:

```
C:\Users\<user>\.ollama\
└── models
    ├── blobs/
    └── manifests/
```

When you run:

```bash
ollama pull phi4-mini
```

the following structure is created:

```
.ollama/
├── id_ed25519
├── id_ed25519.pub
└── models/
    ├── blobs/
    │   ├── sha256-xxxx...
    │   ├── sha256-yyyy...
    └── manifests/
        └── registry.ollama.ai/
            └── library/
                └── phi4-mini/
                    └── latest
```

---

## 🧩 Step-by-Step Packaging

### 1️⃣ Install and Prepare Ollama

1. Install Ollama from the official installer:
   👉 [https://ollama.com/download](https://ollama.com/download)
2. Open a terminal and pull the model:

   ```bash
   ollama pull phi4-mini
   ```

3. Confirm installation:

   ```bash
   ollama list
   ```

   You should see:

   ```
   phi4-mini:latest    <id>    2.5 GB
   ```

---

### 2️⃣ Locate the `.ollama` Directory

Find it under:

- **Windows:** `C:\Users\<user>\.ollama`
- **Linux/macOS:** `~/.ollama`

---

### 3️⃣ Copy Only the Necessary Files

To prevent overwriting other user models, **only include Phi-4-Mini’s assets**:

```
.ollama/
└── models/
    ├── blobs/
    │   ├── sha256-... (phi4-mini blobs)
    └── manifests/
        └── registry.ollama.ai/library/phi4-mini/latest
```

Keep the relative folder structure intact.
Rename .ollama directory to phi4_mini_prepack then zip it.

---

### 4️⃣ Bundle in the Installer

In your Open2E setup package:

```
resources/
├── ollama/
└── phi4_mini/
    ├── .gitignore
    ├── .gitkeep
    ├── README.md <- You are here
    ├── phi4_mini_prepack.zip
    └── LICENSE
```

---

## ⚠️ Notes and Recommendations

| Concern                   | Solution                                                                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overwrite risk**        | Only copy Phi-4-Mini’s subfolders, never the entire `.ollama` directory.                                                                                                                              |
| **License compliance**    | Include both licenses: [Ollama MIT License](https://github.com/ollama/ollama/blob/main/LICENSE) and [Phi-4-Mini MIT License](https://huggingface.co/microsoft/Phi-4-mini-instruct/blob/main/LICENSE). |
| **Version compatibility** | Lock Ollama version used for packaging to ensure manifest format matches user runtime.                                                                                                                |
| **Cross-platform**        | Rebuild separately for Windows, macOS, and Linux if needed—model blobs may differ.                                                                                                                    |

---

## ✅ Verification Example

After setup, this should output:

```bash
ollama list
NAME                ID              SIZE      MODIFIED
phi4-mini:latest    78fad5d182a7    2.5 GB    Just now
```

and

```bash
ollama run phi4-mini
>>> Hello!
Hello! How can I assist you today?
```
