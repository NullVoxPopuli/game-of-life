export default {
  extends: "recommended",
  rules: {
    // Polaris allows <style> tags
    //   https://github.com/ember-template-lint/ember-template-lint/blob/master/lib/rules/no-forbidden-elements.js
    "no-forbidden-elements": ["error", { forbidden: ["meta", "html", "script"] }],
  },
  overrides: [
    {
      files: ["**/*.gts"],
      rules: {
        // Stylistic
        "no-inline-styles": false,
        // Security, but I have no user input that can be exploited
        "style-concetenation": false,
      },
    },
  ],
};
