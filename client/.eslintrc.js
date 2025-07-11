module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser for typescript
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  plugins: ["import", "eslint-plugin-react-compiler"],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:import/errors", // Uses the recommended rules from eslint-plugin-import
    "plugin:import/warnings", // Uses the recommended rules from eslint-plugin-import
    "plugin:import/typescript", // This line needed to work with typescript
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:react-hooks/recommended", // Uses the recommended rules from eslint-plugin-react-hooks
    "plugin:jsx-a11y/recommended", // Uses the recommended rules from eslint-plugin-jsx-a11y
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "react-compiler/react-compiler": ["warn", { skipComponents: ["useModal"] }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
      },
    ], // forbids naming interfaces in lower case
    "react/jsx-uses-react": "off", // off because New JSX Transform - https://uk.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    "react/react-in-jsx-scope": "off", // off because New JSX Transform
    "react/prop-types": "off", // off because TypeScript
    "@typescript-eslint/no-unused-vars": "off", // off because tsconfig have noUnusedLocals, noUnusedParameters
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ], // configure import order, import from react always first
    "react/jsx-curly-brace-presence": [
      "error",
      { props: "never", children: "never" },
    ], // disallow unnecessary curly braces in JSX props and/or children
  },
};
