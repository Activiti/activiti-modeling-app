module.exports = {
  "extends": "../../.eslintrc.json",
  "ignorePatterns": [
    "!**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.*?.json"
        ],
        "tsconfigRootDir": __dirname
      },
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": [
              "ama",
              "modelingsdk"
            ],
            "style": "kebab-case"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": [
              "ama",
              "modelingsdk"
            ],
            "style": "kebab-case"
          }
        ]
      }
    }
  ]
}