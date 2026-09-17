// Copy to config.local.js (ignored by git). Never commit a real API key.
// This direct-browser setup is for a local demo only; production must call through a server-side proxy.
export default {
  provider: "openai", // "openai" hoặc "gemini"
  apiKey: "replace-me",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
};

// Ví dụ Gemini:
// export default {
//   provider: "gemini",
//   apiKey: "replace-me",
//   baseUrl: "https://generativelanguage.googleapis.com/v1beta",
//   model: "gemini-2.5-flash",
// };
