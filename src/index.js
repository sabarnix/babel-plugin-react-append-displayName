module.exports = function ({ types: t }) {
  const childVisitor = {
    JSXOpeningElement(path, state) {
      const { parentComponentStack, config, isRootComponent } = state;
      const parentComponentName = parentComponentStack[parentComponentStack.length - 1];
      const componentName = path.node.name.name;
      if (isRootComponent && parentComponentName) {
        console.log(componentName, parentComponentName);
        // Check if it matches config
        const matched = (Array.isArray(config.components) ? config.components.includes(componentName) : config.components === componentName) &&
        (Array.isArray(config.parentsToExclude) ? !config.parentsToExclude.includes(parentComponentName) : config.parentsToExclude !== parentComponentName);

        const classNameToAdd = parentComponentName;

        if (matched) {
          // Apply the matched rule to add className attribute

          // Check if className attribute already exists
          const classNameAttribute = path.node.attributes.find(
            (attr) => attr.name && attr.name.name === 'className'
          );

          if (!classNameAttribute) {
            // Create a new className attribute with the specified classNameToAdd
            const newClassNameAttribute = t.jsxAttribute(
              t.jsxIdentifier('className'),
              t.stringLiteral(classNameToAdd)
            );

            // Append the new className attribute to the JSX element
            path.node.attributes.push(newClassNameAttribute);
          } else {
            // Append classNameToAdd to the existing className, if not already included
            const currentClassName = classNameAttribute.value.value;
            if (!currentClassName.includes(classNameToAdd)) {
              classNameAttribute.value = t.stringLiteral(
                `${currentClassName} ${classNameToAdd}`
              );
            }
          }
        }
        state.isRootComponent = false;
      }
    },
  };

  return {
    visitor: {
      Program(path, state) {
        // Read config from Babel configuration
        const { components, parentsToExclude } = state.opts;

        // Initialize parent component name stack
        state.parentComponentStack = [];

        state.isRootComponent = true;

        // Store config in plugin state
        state.config = {
          components,
          parentsToExclude,
        };

        // Traverse the program with the childVisitor
        path.traverse(childVisitor, state);
      },
      FunctionDeclaration(path, state) {
        // Track parent component name for function components
        const { parentComponentStack } = state;
        const componentName = path.node.id.name;
        parentComponentStack.push(componentName);

        // Continue traversal
        path.traverse(childVisitor, state);

        // Pop the component name when exiting
        parentComponentStack.pop();
      },
      VariableDeclarator(path, state) {
        // Track parent component name for variable-declared components
        const { parentComponentStack } = state;
        const componentName = path.node.id.name;
        parentComponentStack.push(componentName);

        // Continue traversal
        path.traverse(childVisitor, state);

        // Pop the component name when exiting
        parentComponentStack.pop();
      },
    },
  };
};
