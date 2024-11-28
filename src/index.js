module.exports = function ({ types: t }) {
  // Utility function to validate configuration
  function validateConfig(config) {
    if (!config) {
      throw new Error('Plugin configuration is required');
    }

    if (!config.components) {
      throw new Error('components configuration is required');
    }

    if (!(Array.isArray(config.components) || typeof config.components === 'string')) {
      throw new Error('components must be an array or string');
    }

    if (config.parentsToExclude &&
        !(Array.isArray(config.parentsToExclude) || typeof config.parentsToExclude === 'string')) {
      throw new Error('parentsToExclude must be an array or string');
    }
  }

  const childVisitor = {
    JSXElement(path, state) {
      try {
        const { parentComponentStack, config } = state;

        if (!parentComponentStack || !Array.isArray(parentComponentStack)) {
          throw new Error('Invalid parent component stack');
        }

        const parentComponentName = parentComponentStack[parentComponentStack.length - 1];

        if (!path.node.openingElement || !path.node.openingElement.name) {
          return; // Skip if invalid element structure
        }

        const componentName = path.node.openingElement.name.name;

        if (!componentName || !parentComponentName || path.parentPath.isJSXElement()) {
          return; // Early return for invalid cases
        }

        // Check if it matches config
        const matched = (Array.isArray(config.components)
          ? config.components.includes(componentName)
          : config.components === componentName) &&
          (Array.isArray(config.parentsToExclude)
            ? !config.parentsToExclude.includes(parentComponentName)
            : config.parentsToExclude !== parentComponentName);

        if (!matched) {
          return;
        }

        const classNameToAdd = parentComponentName;

        // Safely handle attribute modification
        try {
          const classNameAttribute = path.node.openingElement.attributes.find(
            (attr) => attr && attr.name && attr.name.name === 'className'
          );

          if (!classNameAttribute) {
            const newClassNameAttribute = t.jsxAttribute(
              t.jsxIdentifier('className'),
              t.stringLiteral(classNameToAdd)
            );
            path.node.openingElement.attributes.push(newClassNameAttribute);
          } else {
            // Safely handle existing className
            const currentClassName = classNameAttribute.value?.value || '';
            if (!currentClassName.includes(classNameToAdd)) {
              classNameAttribute.value = t.stringLiteral(
                `${currentClassName} ${classNameToAdd}`.trim()
              );
            }
          }
        } catch (attributeError) {
          console.error('Error modifying className attribute:', attributeError);
        }
      } catch (visitorError) {
        console.error('Error in JSXElement visitor:', visitorError);
      }
    },
  };

  return {
    visitor: {
      Program: {
        enter(path, state) {
          try {
            // Validate configuration
            validateConfig(state.opts);

            // Initialize state with defaults
            state.parentComponentStack = [];
            state.config = {
              components: state.opts.components || [],
              parentsToExclude: state.opts.parentsToExclude || [],
            };

            path.traverse(childVisitor, state);
          } catch (error) {
            console.error('Error initializing plugin:', error);
            throw error; // Fail the build if configuration is invalid
          }
        },
      },

      FunctionDeclaration(path, state) {
        try {
          const { parentComponentStack } = state;
          const componentName = path.node.id?.name;

          if (!componentName) {
            return; // Skip if no valid component name
          }

          parentComponentStack.push(componentName);
          path.traverse(childVisitor, state);
          parentComponentStack.pop();
        } catch (error) {
          console.error('Error in FunctionDeclaration visitor:', error);
        }
      },

      VariableDeclarator(path, state) {
        try {
          const { parentComponentStack } = state;
          const componentName = path.node.id?.name;

          if (!componentName) {
            return; // Skip if no valid component name
          }

          parentComponentStack.push(componentName);
          path.traverse(childVisitor, state);
          parentComponentStack.pop();
        } catch (error) {
          console.error('Error in VariableDeclarator visitor:', error);
        }
      },
    },
  };
};
