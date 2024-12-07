/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Pretendard: ["Pretendard"],
        SBAggro: ["SBAggro"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"), // 플러그인 활성화
  ],
};
