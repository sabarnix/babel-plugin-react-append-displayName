let tips = [
  "Paste or drop some JavaScript here and explore the syntax tree created by chosen parser.",
  "You can use all the cool new features from ES6 and even more. Enjoy!"
];

import React from 'react';

const DummyComponent = () => {
  return (
    <Box className="superBox">
      <Box></Box>
      <Box></Box>
      <div>
        <Box></Box>
      </div>
    </Box>
  );
};

const Box = ({ className }) => {
  return <div className={`${className} Box-123213-sc`}>
      Hello World
    </div>;
};
