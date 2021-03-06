var _                  = require('lodash');
var sanitizeParameters = require('./parameters');

/**
 * Generate a unique id for every request method.
 *
 * @type {Function}
 */
var uniqueId = _.uniqueId.bind(null, 'method');

/**
 * Sanitize a method into a flatter, more readable structure.
 *
 * @param  {Object} method
 * @param  {Object} resource
 * @param  {Object} spec
 * @return {Object}
 */
var sanitizeMethod = function (method, resource) {
  // Pick only the usable properties.
  var obj = _.pick(method, [
    'method',
    'protocols',
    'responses',
    'body',
    'headers'
  ]);

  // Attach a unique id to every method.
  obj.id              = uniqueId();
  obj.resource        = resource;
  obj.queryParameters = sanitizeParameters(method.queryParameters);
  obj.description     = (method.description || '').trim();

  // TODO: Add `securedBy` support.
  // TODO: Automatically infer content-type header from body.

  return obj;
};

/**
 * Sanitize a methods array into a more reusable object.
 *
 * @param  {Array}  methods
 * @param  {Object} resource
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (methods, resource, spec) {
  var obj = {};

  _.each(methods, function (method) {
    var key             = spec.format.variable(method.method);
    var sanitizedMethod = sanitizeMethod(method, resource, spec);

    obj[key] = sanitizedMethod;
    sanitizedMethod.key = key;
  });

  return obj;
};
