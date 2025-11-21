export const DEVELOPMENT = false;

const prod = {
  base: "https://app.jangoro.com",
  www: "https://jangoro.com",
  api: "https://api.jangoro.com",
  ai: "https://ai.jangoro.com",
};

const dev = {
  base: "http://localhost:4173",
  www: "http://localhost:6001",
  api: "http://localhost:4000",
  ai: "http://localhost:5000",
};

export const getEncryptionKey = async () => {
  try {
  const response = await fetch(`${DEVELOPMENT ? dev.api : prod.api}/config/encryption-key`)
    const data = await response.json();
    return data.encryptionSecretKey;
  } catch (err) {
    console.error("Failed to fetch encryption key:", err);
    return "default-key";
  }
};

export const URL_ROUTES = DEVELOPMENT ? dev : prod;
