/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],

  plugins: ['stylelint-order', 'stylelint-value-no-unknown-custom-properties'],

  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/storybook-static/**',
  ],

  rules: {
    'declaration-block-no-redundant-longhand-properties': [
      true,
      { ignoreShorthands: ['place-self', 'place-content', 'place-items'] },
    ],
    'order/properties-order': [
      [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',

        // Flexbox
        'display',
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',

        // Box model / sizing
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'margin',
        'padding',
        'gap',

        // Typography
        'font',
        'font-size',
        'font-weight',
        'line-height',
        'color',
        'text-align',
        'text-decoration',

        // Background
        'background',
        'background-color',
        'background-image',
        'background-size',
        'background-position',
        'background-repeat',

        // Visual
        'border',
        'border-radius',
        'box-shadow',
        'opacity',
        'cursor',
        'vertical-align',
      ],
      {
        unspecified: 'ignore',
      },
    ],
    'selector-max-id': 0,
    'max-nesting-depth': 3,
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$',
      {
        message:
          'Class names must use kebab-case and cannot start with a digit. Example: "privacy-policy-v2".',
      },
    ],
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        importFrom: [
          'node_modules/@worldline/aurora-design-tokens/build/css/style.css',
        ],
      },
    ],
  },

  overrides: [
    {
      files: ['**/*.module.css'],
    },
  ],
}
