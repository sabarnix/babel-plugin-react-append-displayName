# babel-plugin-react-append-displayName

Add component name as a className of first component in the render tree.

## Description

When using Atomic components like Box, Button etc with styledComponents the classNames usually have the atomic component name which creates a hard to debug DOM tree.

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

## Getting Started

### Installing

First, install the plugin via npm or yarn:

```bash
npm install --save-dev babel-plugin-react-append-displayName
```

### Configuration in .babelrc or babel.config.js

```json
{
  "plugins": [
    "@babel/preset-react",
    [
      "babel-plugin-react-append-displayName",
      {
        "components": ["Box", "Button"],
        "parentsToExclude": ["Box", "Button"]
      }
    ]
  ]
}
```

- components: the list of components which when appears first in the tree will get the display name of parent appended as className
- parentsToExclude: list of comnponents to be ignored when present as parent.

## Acknowledgments

Chat GPT
