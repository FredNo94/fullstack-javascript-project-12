import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**/*.js", "node_modules/**"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
        setImmediate: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    plugins: {
      react: pluginReact
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-undef": "warn",
      "no-unreachable": "warn",
      "no-empty": "warn",
      "no-cond-assign": "warn",
      "no-prototype-builtins": "off",
      "no-control-regex": "off"
    }
  }
];