const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("sessionId");
const ws = new WebSocket("wss://deltascrape.com");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: "register",
      sessionId,
      payload: { role: "jangoro" },
    }),
  );
};

export const wsClient = ws;
export const wsSession = sessionId;
