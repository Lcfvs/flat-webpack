# flat-webpack
A flat configuration helper for webpack

## Install

`npm i -d flat-webpack`

## Usage

Create a `flat-webpack.config.js` or `flat-webpack.config.json` module and place it at your project root directory, like:

```json
{
  "css": {
    "bundles": {
      "app": [
        {
          "src": "./assets/css/dev/main.css"
        },
        {
          "src": "./assets/css/dev/style.css"
        }
      ]
    },
    "config": {
      "module": {
        "loaders": [
          {
            "loader": "file-loader"
          },
          {
            "loader": "extract-loader"
          },
          {
            "loader": "css-loader",
            "options": {
              "minimize": true
            }
          }
        ]
      },
      "output": {
        "path": "./assets/css/build",
        "filename": "[name].min.js"
      },
      "plugins": [
        {
          "name": "webpack-css-concat-plugin",
          "params": [
            {
              "filename": "../dist/app.min.css"
            }
          ]
        }
      ],
      "target": "web"
    }
  },
  "js": {
    "bundles": {
      "app": [
        {
          "src": "js-polyfills/url.js",
          "alias": "URL"
        },
        {
          "src": "es6-promise/dist/es6-promise.auto.js",
          "alias": "Promise"
        },
        {
          "src": "whatwg-fetch",
          "alias": "fetch"
        },
        {
          "src": "anticore"
        },
        {
          "src": "./assets/js/dev/main.js"
        }
      ]
    },
    "config": {
      "devtool": "source-map",
      "module": {
        "loaders": [
          {
            "loader": "babel-loader",
            "options": {
              "presets": [
                "env"
              ]
            }
          }
        ]
      },
      "output": {
        "path": "./assets/js/dist"
      },
      "plugins": [
        {
          "name": "babel-minify-webpack-plugin"
        },
        {
          "name": "webpack/lib/BannerPlugin"
        }
      ],
      "target": "web"
    }
  }
}
```

Then simply run `webpack`