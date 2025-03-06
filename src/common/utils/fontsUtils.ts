const getFontURL = chrome.runtime.getURL(`fonts/`);

export const interFonts = `@font-face {
  font-family: "Inter";
  font-style: thin;
  font-weight: 100;
  font-display: swap;
  src: url(${getFontURL}Inter-Thin.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: extralight;
  font-weight: 200;
  font-display: swap;
  src: url(${getFontURL}Inter-ExtraLight.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: light;
  font-weight: 300;
  font-display: swap;
  src: url(${getFontURL}Inter-Light.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${getFontURL}Inter-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: medium;
  font-weight: 500;
  font-display: swap;
  src: url(${getFontURL}Inter-Medium.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: semibold;
  font-weight: 600;
  font-display: swap;
  src: url(${getFontURL}Inter-SemiBold.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: bold;
  font-weight: 700;
  font-display: swap;
  src: url(${getFontURL}Inter-Bold.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: extrabold;
  font-weight: 800;
  font-display: swap;
  src: url(${getFontURL}Inter-ExtraBold.ttf) format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: black;
  font-weight: 900;
  font-display: swap;
  src: url(${getFontURL}Inter-Black.ttf) format("truetype");
}`;
