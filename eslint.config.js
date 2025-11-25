import js from "@eslint/js";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // 사용하지 않는 변수 규칙을 수정
      "no-unused-vars": [
        "error",
        {
          // 'argsIgnorePattern'에 정규식을 사용하여 '_'로 시작하는 매개변수는 무시하도록 설정
          argsIgnorePattern: "^_",
          // 변수가 무시되는 방식도 설정 가능
          varsIgnorePattern: "^_",
          // Catch 구문의 매개변수도 무시하도록 설정
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
];
