import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The React Compiler rules in eslint-plugin-react-hooks v7 flag existing
// patterns. They stay warnings until fixed file by file (see BACKLOG.md).
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", ".open-next/**"],
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
