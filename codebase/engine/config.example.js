// Copy to config.local.js (ignored by git). Never commit a real API key.
// This direct-browser setup is for a local demo only; production must call through a server-side proxy.
export default {
  apiKey: "replace-me",
  baseUrl: "https://your-openai-compatible-provider.example/v1",
  model: "your-json-capable-model",
};
