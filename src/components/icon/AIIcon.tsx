import React from "react";

import "@dotlottie/player-component";

export const AIProgress = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
      <dotlottie-player
      src="https://lottie.host/d451835c-680d-41de-91d5-48ff068a6568/EU42vdlvYz.lottie"
      background="transparent"
      speed="1"
      style="width: 40px; height: 40px;"
      loop
      autoplay
    ></dotlottie-player>`,
      }}
    />
  );
};
