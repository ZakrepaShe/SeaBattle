module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:import/errors',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'prettier',
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'react/button-has-type': 0,
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': 0,
    'react/jsx-no-bind': [0],
    'react/jsx-one-expression-per-line': 0,
    'react/prefer-stateless-function': 0,
    'react/no-danger': 0,

    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 1,
    'import/no-dynamic-require': 0,
    'import/prefer-default-export': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    'no-unused-expressions': 0,
    'no-useless-escape': 0,
    'no-underscore-dangle': 0,
    'no-mixed-operators': 0,
    'no-bitwise': 0,
    'no-prototype-builtins': 0,
    'no-path-concat': 0,
    'no-nested-ternary': 0,
    'no-sequences': 0,
    'no-unneeded-ternary': 0,
    'no-plusplus': 0,
    'no-constant-condition': ['error', { checkLoops: false }],

    'global-require': 0,
    'arrow-parens': 0,
    'operator-assignment': 0,
    indent: 0,

    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            // The default grouping, but with no blank lines.
            groups: [
              // Packages. `react` related packages come first.
              // Internal airSlate packages.
              // Side effect imports.
              // Parent imports. Put `..` last.
              // Other relative imports. Put same-folder imports and `.` last.
              // Style imports.
              [
                '^\\u0000',
                'react|redux',
                '^@?\\w',
                '^(@|@airslate)(/.*|$)',
                '^\\u0000',
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
                '^.+\\.s?css$',
              ],
            ],
          },
        ],
      },
    },
  ],
};
