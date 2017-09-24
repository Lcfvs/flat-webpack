'use strict';

const
path = require('path'),
utils = require('./utils'),
webpack = require('webpack'),
resolve = path.resolve,
create = utils.create,
forIn = utils.forIn,
readJSON = utils.readJSON,
flat = create(),
Banner = webpack.BannerPlugin,
stringify = JSON.stringify;

flat.parse = function (root, config) {
  let
  store = create(this);

  store.root = root;
  store.package = require(root.concat('/package.json'));
  store.config = config || require(root.concat('/flat-webpack.config'));
  store.scopes = [];

  forIn(store.config, store.onScope, store);

  return store.getConfigs();
};

flat.onScope = function (config, name) {
  let
  store = this,
  scopes = store.scopes,
  current = create();

  scopes.push(current);
  scopes.current = current;

  current.config = config;
  current.name = name;
  current.bundles = [];

  forIn(config.bundles, store.onBundle, store);
};

flat.onBundle = function (entries, name) {
  let
  store = this,
  scope = store.scopes.current,
  bundles = scope.bundles,
  current = create();

  bundles.push(current);
  bundles.current = current;

  current.name = name;
  current.entries = entries;
  store.createConfig();
};

flat.createConfig = function () {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current,
  config = scope.config.config,
  current = create();

  bundle.config = current;
  current.devtool = config.devtool;
  current.module = config.module;
  current.output = create();
  current.output.path = resolve(store.root, config.output.path);
  current.output.filename = config.output.filename || [bundle.name, 'min', scope.name].join('.');
  current.target = config.target;
  current.plugins = [];

  if (Array.isArray(bundle.entries)) {
    current.entry = [];
    bundle.entries.forEach(store.addObjectEntry, store);
  } else {
    current.entry = create();
    forIn(bundle.entries, store.addArrayEntry, store);
  }
  
  if (config.plugins) {
    config.plugins.map(store.addPlugin, store);
  }
};

flat.addObjectEntry = function (entry) {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current;

  bundle.config.entry.push(entry.src);
};

flat.addArrayEntry = function (entry, key) {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current;

  bundle.config.entry[key] = entry;
};

flat.addPlugin = function (config) {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current,
  module = require(config.name),
  params = config.params || [];

  if (module === Banner && (!params[0] || !params[0].banner)) {
    params[0] = params[0] || create();
    
    this.buildBanner(...params);
  }
  
  bundle.config.plugins.push(new module(...params));
};

flat.buildBanner = function (config) {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current;

  bundle.banner = create();
  bundle.banner.result = create();
  bundle.banner.result.name = undefined;
  bundle.banner.result.version = undefined;
  bundle.banner.result.author = undefined;
  bundle.banner.result.license = undefined;
  bundle.banner.result.homepage = undefined;

  bundle.entries.forEach(store.addBannerEntry, store);
  
  config.banner = [
    '/* ',
    stringify(bundle.banner.result, null, 2),
    ' */'
  ].join('');

  config.raw = true;
};

flat.addBannerEntry = function (entry) {
  let
  store = this,
  scope = store.scopes.current,
  bundle = scope.bundles.current,
  banner = bundle.banner,
  dependency = banner.result,
  src = entry.src,
  matches = src.match(/^[^/\\]+/),
  name = matches ? matches[0] : null,
  info = null;

  if (name === null || name === '.') {
    info = store.package;
  } else {
    dependency = create();
    info = readJSON(name, 'package.json');
    banner.result.dependencies = banner.result.dependencies || create();
    banner.result.dependencies[entry.alias || entry.src] = dependency;
  }

  flat.addBannerEntryInfo(dependency, info);
};

flat.addBannerEntryInfo = function (dependency, info) {
  dependency.name = info.name;
  dependency.version = info.version;
  dependency.author = info.author && info.author.name || info.author;
  dependency.license = info.license;
  dependency.homepage = info.homepage;
};

flat.getConfigs = function () {
  let
  store = this,
  scopes = store.scopes,
  configs = [];

  function getScopeConfigs(scope) {
    scope.bundles.forEach(getBundleConfig);
  }

  function getBundleConfig(bundle) {
    configs.push(bundle.config);
  }
  
  scopes.forEach(getScopeConfigs);

  return configs;
};

module.exports = flat;