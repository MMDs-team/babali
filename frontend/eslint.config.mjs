import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    "rules": {
      "no-unused-vars": "off",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
