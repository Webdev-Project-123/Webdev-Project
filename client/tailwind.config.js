module.exports = {
  content: ["./index.html", "./src/**/*.jsx"],
  darkMode: "class", // 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        phuongCustom: "3px 3px 5px 0px rgba(0, 0, 0, 0.2)",
        phuongCustomActive: "1px 1px 2px 0px rgba(0, 0, 0, 0.2)",
        phuongProfile: "0px 0px 15px 0px rgba(0, 0, 0, 0.3)",
        phuongProfileBtn: "0px 0px 5px 0px rgba(0, 0, 0, 0.5)",
        tuanProductThumb: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        sourceCodePro: ["Source Code Pro", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        robotoS: ["Roboto Slab", "sans-serif"],
      },
      screens: {
        ipSE: "320px",
        xsm: "375px",
      },
      minWidth: {
        'namCustome': '420px',
      },
      minHeight: {
        'namCustome': '283px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
