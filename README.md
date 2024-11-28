# babel-plugin-react-append-displayName

Babel plugin that automatically adds className attributes to React components based on their parent component names.

## Description

It helps in automatically adding CSS class names to React components based on their parent component's name

This can be useful for styling and debugging by making component relationships visible in the DOM

```jsx
function UserPanel({ name }) {
  return (
    <Box padding="medium">
      <h1>Hello ${name}</h1>
    </Box>
  )
}

```

This component will render div with class `Box-sc-*` which is not helpful.
This plugin will append `UserPanel` to class.

```jsx
function UserPanel({ name }) {
  return (
    <Box padding="medium" className="UserPanel">
      <h1>Hello ${name}</h1>
    </Box>
  )
}

```

## Getting Started

### Installing

First, install the plugin via npm or yarn:

```bash
npm install --save-dev babel-plugin-react-append-displayname
```

### Configuration in .babelrc or babel.config.js

```json
{
  "plugins": [
    "@babel/preset-react",
    [
      "babel-plugin-react-append-displayname",
      {
        "components": ["Box", "Button"],
        "parentsToExclude": ["Box"]
      }
    ]
  ]
}
```

- components: List of components that should receive the className
- parentsToExclude: List of parent components to skip

## Acknowledgments

Chat GPT
