// Lightweight client scaffolding for social interactions
// NOTE: Real OAuth and API calls MUST happen on the server for security.
// This file provides client-side helpers to trigger OAuth redirects and call server endpoints.

import { URL_ROUTES } from "@/config/config";
import { authProvider } from "@/providers";

type Platform = "instagram" | "facebook" | "linkedin" | "tiktok";

const endpoints = {
  oauthRedirect: (platform: Platform) =>
    `${URL_ROUTES.api}/api/social/${platform}/oauth/redirect`,
  exchange: (platform: Platform) =>
    `${URL_ROUTES.api}/api/social/${platform}/oauth/exchange`,
  posts: (platform: Platform) =>
    `${URL_ROUTES.api}/api/social/${platform}/posts`,
  fetchPosts: (platform: Platform, userId: string) =>
    `${URL_ROUTES.api}/api/social/${platform}/posts?userId=${encodeURIComponent(userId)}`,
  schedule: () => `${URL_ROUTES.api}/api/social/scheduled`,
  check: (platform: Platform) =>
    `${URL_ROUTES.api}/api/social/${platform}/status`,
};

const socialApi = {
  async checkConnection(platform: Platform): Promise<boolean> {
    try {
      const res = await fetch(endpoints.check(platform));
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      return data.connected;
    } catch (err) {
      console.error("Check connection failed", err);
      return false;
    }
  },

  oauthRedirect(platform: Platform) {
    // Redirect client to server endpoint that builds provider OAuth URL
    window.location.href = endpoints.oauthRedirect(platform);
  },

  async exchangeCode(platform: Platform, code: string) {
    // Exchange code for token via server
    const res = await fetch(endpoints.exchange(platform), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async fetchPosts(platform: Platform) {
    const user = await authProvider.getIdentity();
    const res = await fetch(endpoints.fetchPosts(platform, user.email));
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },

  async createPost(
    platform: Platform,
    payload: { text?: string; media?: File | null },
  ) {
    // If sending media, should be sent as multipart/form-data to the server.
    const form = new FormData();
    const user = await authProvider.getIdentity();
    if (payload.text) form.append("text", payload.text);
    if (payload.media) form.append("media", payload.media);
    form.append("userId", user.email);
    const res = await fetch(endpoints.posts(platform), {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
  },

  async schedulePost(payload: {
    platform: Platform;
    text: string;
    scheduledAt: string;
    media?: File | null;
  }) {
    const body = {
      platform: payload.platform,
      text: payload.text,
      scheduledAt: payload.scheduledAt,
      // media should be uploaded separately or use multipart
    };
    const res = await fetch(endpoints.schedule(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to schedule post");
    return res.json();
  },

  async fetchScheduledPosts() {
    const res = await fetch(endpoints.schedule());
    if (!res.ok) throw new Error("Failed to fetch scheduled posts");
    return res.json();
  },
};

export default socialApi;
