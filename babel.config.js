module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": [
          "last 2 versions",
          "not dead"
        ]
      }
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }],
    "@babel/preset-typescript"
  ];

  const plugins = [
    ["@babel/plugin-transform-runtime", {
      "regenerator": true,
      "helpers": true,
      "useESModules": true
    }]
  ];

  return {
    presets,
    plugins,
    overrides: [{
      include: ["./node_modules/@mui/icons-material/**/*.js"],
      compact: false
    }],
    sourceType: "unambiguous",
    assumptions: {
      setPublicClassFields: true
    },
    generatorOpts: {
      maxSize: 2097152 // 2MB
    }
  };
}; 