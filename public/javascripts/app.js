(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application, ChaplinApplication, Images, NavigationController, SessionController, mediator, routes,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  ChaplinApplication = require('chaplin/application');

  SessionController = require('controllers/session_controller');

  NavigationController = require('controllers/navigation_controller');

  routes = require('routes');

  Images = require('models/images');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Gallery';

    Application.prototype.initialize = function() {
      /*console.debug 'ExampleApplication#initialize'
      */      Application.__super__.initialize.apply(this, arguments);
      new SessionController();
      new NavigationController();
      mediator.allImages = new Images();
      mediator.allImages.fetch();
      this.initRouter(routes, {
        pushState: false
      });
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Application;

  })(ChaplinApplication);

}).call(this);

  }
}));
(this.require.define({
  "chaplin/application": function(exports, require, module) {
    (function() {
  var Application, ApplicationController, ApplicationView, Router, mediator;

  mediator = require('mediator');

  ApplicationController = require('chaplin/controllers/application_controller');

  ApplicationView = require('chaplin/views/application_view');

  Router = require('chaplin/lib/router');

  module.exports = Application = (function() {

    function Application() {}

    Application.prototype.title = '';

    Application.prototype.applicationController = null;

    Application.prototype.applicationView = null;

    Application.prototype.router = null;

    Application.prototype.initialize = function() {
      /*console.debug 'Application#initialize'
      */      this.applicationController = new ApplicationController();
      return this.applicationView = new ApplicationView({
        title: this.title
      });
    };

    Application.prototype.initRouter = function(routes, options) {
      this.router = new Router(options);
      if (typeof routes === "function") routes(this.router.match);
      return this.router.startHistory();
    };

    Application.prototype.disposed = false;

    Application.prototype.dispose = function() {
      /*console.debug 'Application#dispose'
      */
      var prop, properties, _i, _len;
      if (this.disposed) return;
      properties = ['applicationController', 'applicationView', 'router'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        this[prop].dispose();
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Application;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/controllers/application_controller": function(exports, require, module) {
    (function() {
  var ApplicationController, Subscriber, mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = ApplicationController = (function() {

    _(ApplicationController.prototype).extend(Subscriber);

    ApplicationController.prototype.previousControllerName = null;

    ApplicationController.prototype.currentControllerName = null;

    ApplicationController.prototype.currentController = null;

    ApplicationController.prototype.currentAction = null;

    ApplicationController.prototype.currentParams = null;

    ApplicationController.prototype.url = null;

    function ApplicationController() {
      this.initialize();
    }

    ApplicationController.prototype.initialize = function() {
      /*console.debug 'ApplicationController#initialize'
      */      this.subscribeEvent('matchRoute', this.matchRoute);
      return this.subscribeEvent('!startupController', this.startupController);
    };

    ApplicationController.prototype.matchRoute = function(route, params) {
      return this.startupController(route.controller, route.action, params);
    };

    ApplicationController.prototype.startupController = function(controllerName, action, params) {
      var controllerFileName, handler, isSameController;
      if (action == null) action = 'index';
      if (params == null) params = {};
      /*console.debug 'ApplicationController#startupController', controllerName, action, params
      */
      if (params.changeURL !== false) params.changeURL = true;
      if (params.forceStartup !== true) params.forceStartup = false;
      isSameController = !params.forceStartup && this.currentControllerName === controllerName && this.currentAction === action && (!this.currentParams || _(params).isEqual(this.currentParams));
      if (isSameController) return;
      controllerFileName = utils.underscorize(controllerName) + '_controller';
      handler = _(this.controllerLoaded).bind(this, controllerName, action, params);
      return handler(require('controllers/' + controllerFileName));
    };

    ApplicationController.prototype.controllerLoaded = function(controllerName, action, params, ControllerConstructor) {
      var controller, currentController, currentControllerName;
      currentControllerName = this.currentControllerName || null;
      currentController = this.currentController || null;
      if (currentController) {
        mediator.publish('beforeControllerDispose', currentController);
        currentController.dispose(params, controllerName);
      }
      controller = new ControllerConstructor(params, currentControllerName);
      controller[action](params, currentControllerName);
      this.previousControllerName = currentControllerName;
      this.currentControllerName = controllerName;
      this.currentController = controller;
      this.currentAction = action;
      this.currentParams = params;
      this.adjustURL(controller, params);
      return mediator.publish('startupController', {
        previousControllerName: this.previousControllerName,
        controller: this.currentController,
        controllerName: this.currentControllerName,
        params: this.currentParams
      });
    };

    ApplicationController.prototype.adjustURL = function(controller, params) {
      var url;
      if (params.path) {
        url = params.path;
      } else if (typeof controller.historyURL === 'function') {
        url = controller.historyURL(params);
      } else if (typeof controller.historyURL === 'string') {
        url = controller.historyURL;
      } else {
        throw new Error('ApplicationController#adjustURL: controller for ' + ("" + this.currentControllerName + " does not provide a historyURL"));
      }
      if (params.changeURL) mediator.publish('!router:changeURL', url);
      return this.url = url;
    };

    ApplicationController.prototype.disposed = false;

    ApplicationController.prototype.dispose = function() {
      /*console.debug 'ApplicationController#dispose
      */      if (this.disposed) return;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ApplicationController;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/controllers/controller": function(exports, require, module) {
    (function() {
  var Controller, Subscriber,
    __hasProp = Object.prototype.hasOwnProperty;

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = Controller = (function() {

    _(Controller.prototype).extend(Subscriber);

    Controller.prototype.view = null;

    Controller.prototype.currentId = null;

    function Controller() {
      this.initialize.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {};

    Controller.prototype.disposed = false;

    Controller.prototype.dispose = function() {
      /*console.debug 'Controller#dispose', this, 'disposed?', @disposed
      */
      var obj, prop, properties, _i, _len;
      if (this.disposed) return;
      for (prop in this) {
        if (!__hasProp.call(this, prop)) continue;
        obj = this[prop];
        if (obj && typeof obj.dispose === 'function') {
          obj.dispose();
          delete this[prop];
        }
      }
      this.unsubscribeAllEvents();
      properties = ['currentId'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Controller;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/create_mediator": function(exports, require, module) {
    (function() {
  var descriptorsSupported, support;

  support = require('chaplin/lib/support');

  descriptorsSupported = support.propertyDescriptors;

  module.exports = function(options) {
    var defineProperty, mediator, privateUser, readonly, readonlyDescriptor;
    if (options == null) options = {};
    _(options).defaults({
      createUserProperty: false
    });
    defineProperty = function(prop, descriptor) {
      if (!descriptorsSupported) return;
      return Object.defineProperty(mediator, prop, descriptor);
    };
    readonlyDescriptor = {
      writable: false,
      enumerable: true,
      configurable: false
    };
    readonly = function() {
      var prop, _i, _len, _results;
      if (!descriptorsSupported) return;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        prop = arguments[_i];
        _results.push(defineProperty(prop, readonlyDescriptor));
      }
      return _results;
    };
    mediator = {};
    mediator.subscribe = mediator.on = Backbone.Events.on;
    mediator.unsubscribe = mediator.off = Backbone.Events.off;
    mediator.publish = mediator.trigger = Backbone.Events.trigger;
    mediator._callbacks = null;
    readonly('subscribe', 'unsubscribe', 'publish');
    if (options.createUserProperty) {
      mediator.user = null;
      privateUser = null;
      defineProperty('user', {
        get: function() {
          return privateUser;
        },
        set: function() {
          throw new Error('mediator.user is not writable directly. ' + 'Please use mediator.setUser instead.');
        },
        enumerable: true,
        configurable: false
      });
      mediator.setUser = function(user) {
        if (descriptorsSupported) {
          return privateUser = user;
        } else {
          return mediator.user = user;
        }
      };
      readonly('setUser');
    }
    return mediator;
  };

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/route": function(exports, require, module) {
    (function() {
  var Route, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty;

  mediator = require('mediator');

  module.exports = Route = (function() {
    var escapeRegExp, queryStringFieldSeparator, queryStringValueSeparator, reservedParams;

    reservedParams = 'path changeURL'.split(' ');

    escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

    queryStringFieldSeparator = '&';

    queryStringValueSeparator = '=';

    function Route(pattern, target, options) {
      var _ref;
      this.options = options != null ? options : {};
      this.handler = __bind(this.handler, this);
      this.addParamName = __bind(this.addParamName, this);
      /*console.debug 'Route#constructor', pattern, target, options
      */
      this.pattern = pattern;
      _ref = target.split('#'), this.controller = _ref[0], this.action = _ref[1];
      this.createRegExp();
    }

    Route.prototype.createRegExp = function() {
      var pattern;
      if (_.isRegExp(this.pattern)) {
        this.regExp = this.pattern;
        return;
      }
      pattern = this.pattern.replace(escapeRegExp, '\\$&').replace(/:(\w+)/g, this.addParamName);
      return this.regExp = RegExp("^" + pattern + "(?=\\?|$)");
    };

    Route.prototype.addParamName = function(match, paramName) {
      if (this.paramNames == null) this.paramNames = [];
      if (_(reservedParams).include(paramName)) {
        throw new Error("Route#addParamName: parameter name " + paramName + " is reserved");
      }
      this.paramNames.push(paramName);
      return '([\\w-]+)';
    };

    Route.prototype.test = function(path) {
      /*console.debug 'Route#test', this, "path »#{path}«", typeof path
      */
      var constraint, constraints, matched, name, params;
      matched = this.regExp.test(path);
      if (!matched) return false;
      constraints = this.options.constraints;
      if (constraints) {
        params = this.extractParams(path);
        for (name in constraints) {
          if (!__hasProp.call(constraints, name)) continue;
          constraint = constraints[name];
          if (!constraint.test(params[name])) return false;
        }
      }
      return true;
    };

    Route.prototype.handler = function(path, options) {
      /*console.debug 'Route#handler', this, path, options
      */
      var params;
      params = this.buildParams(path, options);
      return mediator.publish('matchRoute', this, params);
    };

    Route.prototype.buildParams = function(path, options) {
      var params, patternParams, queryParams;
      params = {};
      queryParams = this.extractQueryParams(path);
      _(params).extend(queryParams);
      patternParams = this.extractParams(path);
      _(params).extend(patternParams);
      _(params).extend(this.options.params);
      params.changeURL = Boolean(options && options.changeURL);
      params.path = path;
      return params;
    };

    Route.prototype.extractParams = function(path) {
      var index, match, matches, paramName, params, _len, _ref;
      params = {};
      matches = this.regExp.exec(path);
      _ref = matches.slice(1);
      for (index = 0, _len = _ref.length; index < _len; index++) {
        match = _ref[index];
        paramName = this.paramNames ? this.paramNames[index] : index;
        params[paramName] = match;
      }
      return params;
    };

    Route.prototype.extractQueryParams = function(path) {
      var current, field, matches, pair, pairs, params, queryString, regExp, value, _i, _len, _ref;
      params = {};
      regExp = /\?(.+?)(?=#|$)/;
      matches = regExp.exec(path);
      if (!matches) return params;
      queryString = matches[1];
      pairs = queryString.split(queryStringFieldSeparator);
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        if (!pair.length) continue;
        _ref = pair.split(queryStringValueSeparator), field = _ref[0], value = _ref[1];
        if (!field.length) continue;
        field = decodeURIComponent(field);
        value = decodeURIComponent(value);
        current = params[field];
        if (current) {
          if (current.push) {
            current.push(value);
          } else {
            params[field] = [current, value];
          }
        } else {
          params[field] = value;
        }
      }
      return params;
    };

    return Route;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/router": function(exports, require, module) {
    (function() {
  var Route, Router, Subscriber, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mediator = require('mediator');

  Subscriber = require('chaplin/lib/subscriber');

  Route = require('chaplin/lib/route');

  module.exports = Router = (function() {

    _(Router.prototype).extend(Subscriber);

    function Router(options) {
      this.options = options != null ? options : {};
      this.route = __bind(this.route, this);
      this.match = __bind(this.match, this);
      /*console.debug 'Router#constructor'
      */
      _(this.options).defaults({
        pushState: true
      });
      this.subscribeEvent('!router:route', this.routeHandler);
      this.subscribeEvent('!router:changeURL', this.changeURLHandler);
      this.createHistory();
    }

    Router.prototype.createHistory = function() {
      return Backbone.history || (Backbone.history = new Backbone.History());
    };

    Router.prototype.startHistory = function() {
      return Backbone.history.start(this.options);
    };

    Router.prototype.stopHistory = function() {
      return Backbone.history.stop();
    };

    Router.prototype.match = function(pattern, target, options) {
      var route;
      if (options == null) options = {};
      route = new Route(pattern, target, options);
      return Backbone.history.route(route, route.handler);
    };

    Router.prototype.route = function(path) {
      /*console.debug 'Router#route', path
      */
      var handler, _i, _len, _ref;
      path = path.replace(/^(\/#|\/)/, '');
      _ref = Backbone.history.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        if (handler.route.test(path)) {
          handler.callback(path, {
            changeURL: true
          });
          return true;
        }
      }
      return false;
    };

    Router.prototype.routeHandler = function(path, callback) {
      var routed;
      routed = this.route(path);
      return typeof callback === "function" ? callback(routed) : void 0;
    };

    Router.prototype.changeURL = function(url) {
      /*console.debug 'Router#changeURL', url
      */      return Backbone.history.navigate(url, {
        trigger: false
      });
    };

    Router.prototype.changeURLHandler = function(url) {
      return this.changeURL(url);
    };

    Router.prototype.disposed = false;

    Router.prototype.dispose = function() {
      /*console.debug 'Router#dispose'
      */      if (this.disposed) return;
      this.stopHistory();
      delete Backbone.history;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Router;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/subscriber": function(exports, require, module) {
    (function() {
  var Subscriber, mediator;

  mediator = require('mediator');

  Subscriber = {
    subscribeEvent: function(type, handler) {
      if (typeof type !== 'string') {
        throw new TypeError('Subscriber#subscribeEvent: ' + 'type argument must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('Subscriber#subscribeEvent: ' + 'handler argument must be a function');
      }
      mediator.unsubscribe(type, handler, this);
      return mediator.subscribe(type, handler, this);
    },
    unsubscribeEvent: function(type, handler) {
      if (typeof type !== 'string') {
        throw new TypeError('Subscriber#unsubscribeEvent: ' + 'type argument must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('Subscriber#unsubscribeEvent: ' + 'handler argument must be a function');
      }
      return mediator.unsubscribe(type, handler);
    },
    unsubscribeAllEvents: function() {
      return mediator.unsubscribe(null, null, this);
    }
  };

  if (typeof Object.freeze === "function") Object.freeze(Subscriber);

  module.exports = Subscriber;

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/support": function(exports, require, module) {
    (function() {
  var support;

  support = {
    propertyDescriptors: (function() {
      var o;
      if (!(typeof Object.defineProperty === 'function' && typeof Object.defineProperties === 'function')) {
        return false;
      }
      try {
        o = {};
        Object.defineProperty(o, 'foo', {
          value: 'bar'
        });
        return o.foo === 'bar';
      } catch (error) {
        return false;
      }
    })()
  };

  module.exports = support;

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/sync_machine": function(exports, require, module) {
    (function() {
  var STATE_CHANGE, SYNCED, SYNCING, SyncMachine, UNSYNCED, event, _fn, _i, _len, _ref;

  UNSYNCED = 'unsynced';

  SYNCING = 'syncing';

  SYNCED = 'synced';

  STATE_CHANGE = 'syncStateChange';

  SyncMachine = {
    _syncState: UNSYNCED,
    _previousSyncState: null,
    syncState: function() {
      return this._syncState;
    },
    isUnsynced: function() {
      return this._syncState === UNSYNCED;
    },
    isSynced: function() {
      return this._syncState === SYNCED;
    },
    isSyncing: function() {
      return this._syncState === SYNCING;
    },
    unsync: function() {
      var _ref;
      if ((_ref = this._syncState) === SYNCING || _ref === SYNCED) {
        this._previousSync = this._syncState;
        this._syncState = UNSYNCED;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    beginSync: function() {
      var _ref;
      if ((_ref = this._syncState) === UNSYNCED || _ref === SYNCED) {
        this._previousSync = this._syncState;
        this._syncState = SYNCING;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    finishSync: function() {
      if (this._syncState === SYNCING) {
        this._previousSync = this._syncState;
        this._syncState = SYNCED;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    abortSync: function() {
      if (this._syncState === SYNCING) {
        this._syncState = this._previousSync;
        this._previousSync = this._syncState;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    }
  };

  _ref = [UNSYNCED, SYNCING, SYNCED, STATE_CHANGE];
  _fn = function(event) {
    return SyncMachine[event] = function(callback, context) {
      if (context == null) context = this;
      this.on(event, callback, context);
      if (this._syncState === event) return callback.call(context);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    event = _ref[_i];
    _fn(event);
  }

  if (typeof Object.freeze === "function") Object.freeze(SyncMachine);

  module.exports = SyncMachine;

}).call(this);

  }
}));
(this.require.define({
  "chaplin/lib/utils": function(exports, require, module) {
    (function() {
  var mediator, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __slice = Array.prototype.slice;

  mediator = require('mediator');

  utils = {
    beget: (function() {
      var ctor;
      if (typeof Object.create === 'function') {
        return function(obj) {
          return Object.create(obj);
        };
      } else {
        ctor = function() {};
        return function(obj) {
          ctor.prototype = obj;
          return new ctor;
        };
      }
    })(),
    camelize: (function() {
      var camelizer, regexp;
      regexp = /[-_]([a-z])/g;
      camelizer = function(match, c) {
        return c.toUpperCase();
      };
      return function(string) {
        return string.replace(regexp, camelizer);
      };
    })(),
    upcase: function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    },
    underscorize: function(string) {
      return string.replace(/[A-Z]/g, function(char, index) {
        return (index !== 0 ? '_' : '') + char.toLowerCase();
      });
    },
    dasherize: function(string) {
      return string.replace(/[A-Z]/g, function(char, index) {
        return (index !== 0 ? '-' : '') + char.toLowerCase();
      });
    },
    sessionStorage: (function() {
      if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
        return function(key, value) {
          if (typeof value === 'undefined') {
            value = sessionStorage.getItem(key);
            if ((value != null) && value.toString) {
              return value.toString();
            } else {
              return value;
            }
          } else {
            sessionStorage.setItem(key, value);
            return value;
          }
        };
      } else {
        return function(key, value) {
          if (typeof value === 'undefined') {
            return utils.getCookie(key);
          } else {
            utils.setCookie(key, value);
            return value;
          }
        };
      }
    })(),
    sessionStorageRemove: (function() {
      if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
        return function(key) {
          return sessionStorage.removeItem(key);
        };
      } else {
        return function(key) {
          return utils.expireCookie(key);
        };
      }
    })(),
    getCookie: function(key) {
      var pair, pairs, val, _i, _len;
      pairs = document.cookie.split('; ');
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        val = pair.split('=');
        if (decodeURIComponent(val[0]) === key) {
          return decodeURIComponent(val[1] || '');
        }
      }
      return null;
    },
    setCookie: function(key, value, options) {
      var expires, getOption, payload;
      if (options == null) options = {};
      payload = "" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(value));
      getOption = function(name) {
        if (options[name]) {
          return "; " + name + "=" + options[name];
        } else {
          return '';
        }
      };
      expires = options.expires ? "; expires=" + (options.expires.toUTCString()) : '';
      return document.cookie = [payload, expires, getOption('path'), getOption('domain'), getOption('secure')].join('');
    },
    expireCookie: function(key) {
      return document.cookie = "" + key + "=nil; expires=" + ((new Date).toGMTString());
    },
    loadLib: function(url, success, error, timeout) {
      var head, onload, script, timeoutHandle;
      if (timeout == null) timeout = 7500;
      head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      script = document.createElement('script');
      script.async = 'async';
      script.src = url;
      onload = function(_, aborted) {
        if (aborted == null) aborted = false;
        if (!(aborted || !script.readyState || script.readyState === 'complete')) {
          return;
        }
        clearTimeout(timeoutHandle);
        script.onload = script.onreadystatechange = script.onerror = null;
        if (head && script.parentNode) head.removeChild(script);
        script = void 0;
        if (success && !aborted) return success();
      };
      script.onload = script.onreadystatechange = onload;
      script.onerror = function() {
        onload(null, true);
        if (error) return error();
      };
      timeoutHandle = setTimeout(script.onerror, timeout);
      return head.insertBefore(script, head.firstChild);
    },
    /*
      Wrap methods so they can be called before a deferred is resolved.
      The actual methods are called once the deferred is resolved.
    
      Parameters:
    
      Expects an options hash with the following properties:
    
      deferred
        The Deferred object to wait for.
    
      methods
        Either:
        - A string with a method name e.g. 'method'
        - An array of strings e.g. ['method1', 'method2']
        - An object with methods e.g. {method: -> alert('resolved!')}
    
      host (optional)
        If you pass an array of strings in the `methods` parameter the methods
        are fetched from this object. Defaults to `deferred`.
    
      target (optional)
        The target object the new wrapper methods are created at.
        Defaults to host if host is given, otherwise it defaults to deferred.
    
      onDeferral (optional)
        An additional callback function which is invoked when the method is called
        and the Deferred isn't resolved yet.
        After the method is registered as a done handler on the Deferred,
        this callback is invoked. This can be used to trigger the resolving
        of the Deferred.
    
      Examples:
    
      deferMethods(deferred: def, methods: 'foo')
        Wrap the method named foo of the given deferred def and
        postpone all calls until the deferred is resolved.
    
      deferMethods(deferred: def, methods: def.specialMethods)
        Read all methods from the hash def.specialMethods and
        create wrapped methods with the same names at def.
    
      deferMethods(
        deferred: def, methods: def.specialMethods, target: def.specialMethods
      )
        Read all methods from the object def.specialMethods and
        create wrapped methods at def.specialMethods,
        overwriting the existing ones.
    
      deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
        Wrap the methods obj.foo and obj.bar so all calls to them are postponed
        until def is resolved. obj.foo and obj.bar are overwritten
        with their wrappers.
    */
    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') continue;
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) context = deferred;
      return function() {
        var args;
        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') return onDeferral.apply(context);
        }
      };
    },
    accumulator: {
      collectedData: {},
      handles: {},
      handlers: {},
      successHandlers: {},
      errorHandlers: {},
      interval: 2000
    },
    wrapAccumulators: function(obj, methods) {
      var func, name, _i, _len,
        _this = this;
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        name = methods[_i];
        func = obj[name];
        if (typeof func !== 'function') {
          throw new TypeError("utils.wrapAccumulators: method " + name + " not found");
        }
        obj[name] = utils.createAccumulator(name, obj[name], obj);
      }
      return $(window).unload(function() {
        var handler, name, _ref, _results;
        _ref = utils.accumulator.handlers;
        _results = [];
        for (name in _ref) {
          handler = _ref[name];
          _results.push(handler({
            async: false
          }));
        }
        return _results;
      });
    },
    createAccumulator: function(name, func, context) {
      var acc, accumulatedError, accumulatedSuccess, cleanup, id;
      if (!(id = func.__uniqueID)) {
        id = func.__uniqueID = name + String(Math.random()).replace('.', '');
      }
      acc = utils.accumulator;
      cleanup = function() {
        delete acc.collectedData[id];
        delete acc.successHandlers[id];
        return delete acc.errorHandlers[id];
      };
      accumulatedSuccess = function() {
        var handler, handlers, _i, _len;
        handlers = acc.successHandlers[id];
        if (handlers) {
          for (_i = 0, _len = handlers.length; _i < _len; _i++) {
            handler = handlers[_i];
            handler.apply(this, arguments);
          }
        }
        return cleanup();
      };
      accumulatedError = function() {
        var handler, handlers, _i, _len;
        handlers = acc.errorHandlers[id];
        if (handlers) {
          for (_i = 0, _len = handlers.length; _i < _len; _i++) {
            handler = handlers[_i];
            handler.apply(this, arguments);
          }
        }
        return cleanup();
      };
      return function() {
        var data, error, handler, rest, success;
        data = arguments[0], success = arguments[1], error = arguments[2], rest = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
        if (data) {
          acc.collectedData[id] = (acc.collectedData[id] || []).concat(data);
        }
        if (success) {
          acc.successHandlers[id] = (acc.successHandlers[id] || []).concat(success);
        }
        if (error) {
          acc.errorHandlers[id] = (acc.errorHandlers[id] || []).concat(error);
        }
        if (acc.handles[id]) return;
        handler = function(options) {
          var args, collectedData;
          if (options == null) options = options;
          if (!(collectedData = acc.collectedData[id])) return;
          args = [collectedData, accumulatedSuccess, accumulatedError].concat(rest);
          func.apply(context, args);
          clearTimeout(acc.handles[id]);
          delete acc.handles[id];
          return delete acc.handlers[id];
        };
        acc.handlers[id] = handler;
        return acc.handles[id] = setTimeout((function() {
          return handler();
        }), acc.interval);
      };
    },
    afterLogin: function() {
      var args, context, eventType, func, loginHandler;
      context = arguments[0], func = arguments[1], eventType = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      if (eventType == null) eventType = 'login';
      if (mediator.user) {
        return func.apply(context, args);
      } else {
        loginHandler = function() {
          mediator.unsubscribe(eventType, loginHandler);
          return func.apply(context, args);
        };
        return mediator.subscribe(eventType, loginHandler);
      }
    },
    deferMethodsUntilLogin: function(obj, methods, eventType) {
      var func, name, _i, _len, _results;
      if (eventType == null) eventType = 'login';
      if (typeof methods === 'string') methods = [methods];
      _results = [];
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        name = methods[_i];
        func = obj[name];
        if (typeof func !== 'function') {
          throw new TypeError("utils.deferMethodsUntilLogin: method " + name + "not found");
        }
        _results.push(obj[name] = _(utils.afterLogin).bind(null, obj, func, eventType));
      }
      return _results;
    },
    ensureLogin: function() {
      var args, context, e, eventType, func, loginContext;
      context = arguments[0], func = arguments[1], loginContext = arguments[2], eventType = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
      if (eventType == null) eventType = 'login';
      utils.afterLogin.apply(utils, [context, func, eventType].concat(__slice.call(args)));
      if (!mediator.user) {
        if ((e = args[0]) && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        return mediator.publish('!showLogin', loginContext);
      }
    },
    ensureLoginForMethods: function(obj, methods, loginContext, eventType) {
      var func, name, _i, _len, _results;
      if (eventType == null) eventType = 'login';
      if (typeof methods === 'string') methods = [methods];
      _results = [];
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        name = methods[_i];
        func = obj[name];
        if (typeof func !== 'function') {
          throw new TypeError("utils.ensureLoginForMethods: method " + name + "not found");
        }
        _results.push(obj[name] = _(utils.ensureLogin).bind(null, obj, func, loginContext, eventType));
      }
      return _results;
    },
    modifierKeyPressed: function(event) {
      return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
    }
  };

  if (typeof Object.seal === "function") Object.seal(utils);

  module.exports = utils;

}).call(this);

  }
}));
(this.require.define({
  "chaplin/models/collection": function(exports, require, module) {
    (function() {
  var Collection, Model, Subscriber, SyncMachine,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Subscriber = require('chaplin/lib/subscriber');

  SyncMachine = require('chaplin/lib/sync_machine');

  Model = require('chaplin/models/model');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    _(Collection.prototype).extend(Subscriber);

    Collection.prototype.model = Model;

    Collection.prototype.initDeferred = function() {
      return _(this).extend($.Deferred());
    };

    Collection.prototype.initSyncMachine = function() {
      return _(this).extend(SyncMachine);
    };

    Collection.prototype.addAtomic = function(models, options) {
      var batch_direction, model;
      if (options == null) options = {};
      if (!models.length) return;
      options.silent = true;
      batch_direction = typeof options.at === 'number' ? 'pop' : 'shift';
      while (model = models[batch_direction]()) {
        this.add(model, options);
      }
      return this.trigger('reset');
    };

    Collection.prototype.update = function(newList, options) {
      var fingerPrint, i, ids, model, newFingerPrint, preexistent, _ids, _len, _results;
      if (options == null) options = {};
      fingerPrint = this.pluck('id').join();
      ids = _(newList).pluck('id');
      newFingerPrint = ids.join();
      if (fingerPrint !== newFingerPrint) {
        _ids = _(ids);
        i = this.models.length - 1;
        while (i >= 0) {
          model = this.models[i];
          if (!_ids.include(model.id)) this.remove(model);
          i--;
        }
      }
      if (!(fingerPrint === newFingerPrint && !options.deep)) {
        _results = [];
        for (i = 0, _len = newList.length; i < _len; i++) {
          model = newList[i];
          preexistent = this.get(model.id);
          if (preexistent) {
            if (!options.deep) continue;
            _results.push(preexistent.set(model));
          } else {
            _results.push(this.add(model, {
              at: i
            }));
          }
        }
        return _results;
      }
    };

    Collection.prototype.disposed = false;

    Collection.prototype.dispose = function() {
      /*console.debug 'Collection#dispose', this, 'disposed?', @disposed
      */
      var prop, properties, _i, _len;
      if (this.disposed) return;
      this.trigger('dispose', this);
      this.reset([], {
        silent: true
      });
      this.unsubscribeAllEvents();
      this.off();
      if (typeof this.reject === "function") this.reject();
      properties = ['model', 'models', '_byId', '_byCid', '_callbacks'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "chaplin/models/model": function(exports, require, module) {
    (function() {
  var Model, Subscriber,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    _(Model.prototype).extend(Subscriber);

    Model.prototype.initDeferred = function() {
      return _(this).extend($.Deferred());
    };

    Model.prototype.getAttributes = function() {
      return this.attributes;
    };

    Model.prototype.disposed = false;

    Model.prototype.dispose = function() {
      /*console.debug 'Model#dispose', this, 'disposed?', @disposed
      */
      var prop, properties, _i, _len;
      if (this.disposed) return;
      this.trigger('dispose', this);
      this.unsubscribeAllEvents();
      this.off();
      if (typeof this.reject === "function") this.reject();
      properties = ['collection', 'attributes', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', '_callbacks'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Model;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "chaplin/views/application_view": function(exports, require, module) {
    (function() {
  var ApplicationView, Subscriber, mediator, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = ApplicationView = (function() {

    _(ApplicationView.prototype).extend(Subscriber);

    ApplicationView.prototype.title = '';

    function ApplicationView(options) {
      if (options == null) options = {};
      this.openLink = __bind(this.openLink, this);
      /*console.debug 'ApplicationView#constructor', options
      */
      this.title = options.title;
      _(options).defaults({
        loginClasses: true,
        routeLinks: true
      });
      this.subscribeEvent('beforeControllerDispose', this.hideOldView);
      this.subscribeEvent('startupController', this.showNewView);
      this.subscribeEvent('startupController', this.removeFallbackContent);
      this.subscribeEvent('startupController', this.adjustTitle);
      if (options.loginClasses) {
        this.subscribeEvent('loginStatus', this.updateLoginClasses);
        this.updateLoginClasses();
      }
      if (options.routeLinks) this.initLinkRouting();
    }

    ApplicationView.prototype.hideOldView = function(controller) {
      var view;
      scrollTo(0, 0);
      view = controller.view;
      if (view) return view.$el.css('display', 'none');
    };

    ApplicationView.prototype.showNewView = function(context) {
      var view;
      view = context.controller.view;
      if (view) {
        return view.$el.css({
          display: 'block',
          opacity: 1,
          visibility: 'visible'
        });
      }
    };

    ApplicationView.prototype.adjustTitle = function(context) {
      var subtitle, title;
      title = this.title;
      subtitle = context.controller.title;
      if (subtitle) title = "" + subtitle + " \u2013 " + title;
      return setTimeout((function() {
        return document.title = title;
      }), 50);
    };

    ApplicationView.prototype.updateLoginClasses = function(loggedIn) {
      return $(document.body).toggleClass('logged-out', !loggedIn).toggleClass('logged-in', loggedIn);
    };

    ApplicationView.prototype.removeFallbackContent = function() {
      $('.accessible-fallback').remove();
      return this.unsubscribeEvent('startupController', this.removeFallbackContent);
    };

    ApplicationView.prototype.initLinkRouting = function() {
      return $(document).on('click', '.go-to', this.goToHandler).on('click', 'a', this.openLink);
    };

    ApplicationView.prototype.stopLinkRouting = function() {
      return $(document).off('click', '.go-to', this.goToHandler).off('click', 'a', this.openLink);
    };

    ApplicationView.prototype.openLink = function(event) {
      var currentHostname, el, external, href, path;
      if (utils.modifierKeyPressed(event)) return;
      el = event.currentTarget;
      href = el.getAttribute('href');
      if (href === null || href === '' || href.charAt(0) === '#' || $(el).hasClass('noscript')) {
        return;
      }
      currentHostname = location.hostname.replace('.', '\\.');
      external = !RegExp("" + currentHostname + "$", "i").test(el.hostname);
      if (external) return;
      path = el.pathname + el.search;
      if (path.charAt(0) !== '/') path = "/" + path;
      return mediator.publish('!router:route', path, function(routed) {
        if (routed) return event.preventDefault();
      });
    };

    ApplicationView.prototype.goToHandler = function(event) {
      var el, path;
      el = event.currentTarget;
      if (event.nodeName === 'A') return;
      path = $(el).data('href');
      if (!path) return;
      return mediator.publish('!router:route', path, function(routed) {
        if (routed) {
          return event.preventDefault();
        } else {
          return location.href = path;
        }
      });
    };

    ApplicationView.prototype.disposed = false;

    ApplicationView.prototype.dispose = function() {
      /*console.debug 'ApplicationView#dispose'
      */      if (this.disposed) return;
      this.stopLinkRouting();
      this.unsubscribeAllEvents();
      delete this.title;
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ApplicationView;

  })();

}).call(this);

  }
}));
(this.require.define({
  "chaplin/views/collection_view": function(exports, require, module) {
    (function() {
  var CollectionView, View, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  View = require('chaplin/views/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.renderAllItems = __bind(this.renderAllItems, this);
      this.showHideFallback = __bind(this.showHideFallback, this);
      this.itemsResetted = __bind(this.itemsResetted, this);
      this.itemRemoved = __bind(this.itemRemoved, this);
      this.itemAdded = __bind(this.itemAdded, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.animationDuration = 500;

    CollectionView.prototype.listSelector = null;

    CollectionView.prototype.$list = null;

    CollectionView.prototype.fallbackSelector = null;

    CollectionView.prototype.$fallback = null;

    CollectionView.prototype.loadingSelector = null;

    CollectionView.prototype.$loading = null;

    CollectionView.prototype.itemSelector = null;

    CollectionView.prototype.filterer = null;

    CollectionView.prototype.viewsByCid = null;

    CollectionView.prototype.visibleItems = null;

    CollectionView.prototype.getView = function(model) {
      throw new Error('CollectionView#getView must be overridden');
    };

    CollectionView.prototype.getTemplateFunction = function() {};

    CollectionView.prototype.initialize = function(options) {
      if (options == null) options = {};
      CollectionView.__super__.initialize.apply(this, arguments);
      /*console.debug 'CollectionView#initialize', this, @collection, options
      */
      _(options).defaults({
        render: true,
        renderItems: true,
        filterer: null
      });
      this.viewsByCid = {};
      this.visibleItems = [];
      /*
          @bind 'visibilityChange', (visibleItems) ->
            console.debug 'visibilityChange', visibleItems.length
          @modelBind 'syncStateChange', (collection, syncState) ->
            console.debug 'syncStateChange', syncState
      */
      this.addCollectionListeners();
      if (options.filterer) this.filter(options.filterer);
      if (options.render) this.render();
      if (options.renderItems) return this.renderAllItems();
    };

    CollectionView.prototype.addCollectionListeners = function() {
      this.modelBind('add', this.itemAdded);
      this.modelBind('remove', this.itemRemoved);
      return this.modelBind('reset', this.itemsResetted);
    };

    CollectionView.prototype.itemAdded = function(item, collection, options) {
      if (options == null) options = {};
      return this.renderAndInsertItem(item, options.index);
    };

    CollectionView.prototype.itemRemoved = function(item) {
      return this.removeViewForItem(item);
    };

    CollectionView.prototype.itemsResetted = function() {
      return this.renderAllItems();
    };

    CollectionView.prototype.render = function() {
      CollectionView.__super__.render.apply(this, arguments);
      this.$list = this.listSelector ? this.$(this.listSelector) : this.$el;
      this.initFallback();
      return this.initLoadingIndicator();
    };

    CollectionView.prototype.initFallback = function() {
      if (!this.fallbackSelector) return;
      this.$fallback = this.$(this.fallbackSelector);
      this.bind('visibilityChange', this.showHideFallback);
      return this.modelBind('syncStateChange', this.showHideFallback);
    };

    CollectionView.prototype.showHideFallback = function() {
      var visible;
      visible = this.visibleItems.length === 0 && (typeof this.collection.isSynced === 'function' ? this.collection.isSynced() : true);
      return this.$fallback.css('display', visible ? 'block' : 'none');
    };

    CollectionView.prototype.initLoadingIndicator = function() {
      if (!(this.loadingSelector && typeof this.collection.isSyncing === 'function')) {
        return;
      }
      this.$loading = this.$(this.loadingSelector);
      this.modelBind('syncStateChange', this.showHideLoadingIndicator);
      return this.showHideLoadingIndicator();
    };

    CollectionView.prototype.showHideLoadingIndicator = function() {
      var visible;
      visible = this.collection.length === 0 && this.collection.isSyncing();
      return this.$loading.css('display', visible ? 'block' : 'none');
    };

    CollectionView.prototype.filter = function(filterer) {
      var included, index, item, view, _len, _ref;
      this.filterer = filterer;
      if (!_(this.viewsByCid).isEmpty()) {
        _ref = this.collection.models;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          item = _ref[index];
          included = typeof filterer === 'function' ? filterer(item, index) : true;
          view = this.viewsByCid[item.cid];
          if (!view) {
            throw new Error('CollectionView#filter: ' + ("no view found for " + item.cid));
          }
          view.$el.stop(true, true).css('display', included ? '' : 'none');
          this.updateVisibleItems(item, included, false);
        }
      }
      return this.trigger('visibilityChange', this.visibleItems);
    };

    CollectionView.prototype.renderAllItems = function() {
      var cid, index, item, items, remainingViewsByCid, view, _i, _len, _len2, _ref;
      items = this.collection.models;
      this.visibleItems = [];
      remainingViewsByCid = {};
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        view = this.viewsByCid[item.cid];
        if (view) remainingViewsByCid[item.cid] = view;
      }
      _ref = this.viewsByCid;
      for (cid in _ref) {
        if (!__hasProp.call(_ref, cid)) continue;
        view = _ref[cid];
        if (!(cid in remainingViewsByCid)) this.removeView(cid, view);
      }
      for (index = 0, _len2 = items.length; index < _len2; index++) {
        item = items[index];
        view = this.viewsByCid[item.cid];
        if (view) {
          this.insertView(item, view, index, 0);
        } else {
          this.renderAndInsertItem(item, index);
        }
      }
      if (!items.length) {
        return this.trigger('visibilityChange', this.visibleItems);
      }
    };

    CollectionView.prototype.renderAndInsertItem = function(item, index) {
      var view;
      view = this.renderItem(item);
      return this.insertView(item, view, index);
    };

    CollectionView.prototype.renderItem = function(item) {
      var view;
      view = this.viewsByCid[item.cid];
      if (!view) {
        view = this.getView(item);
        this.viewsByCid[item.cid] = view;
      }
      view.render();
      return view;
    };

    CollectionView.prototype.insertView = function(item, view, index, animationDuration) {
      var $list, $next, $previous, $viewEl, children, included, length, position, viewEl;
      if (index == null) index = null;
      if (animationDuration == null) animationDuration = this.animationDuration;
      position = typeof index === 'number' ? index : this.collection.indexOf(item);
      included = typeof this.filterer === 'function' ? this.filterer(item, position) : true;
      viewEl = view.el;
      $viewEl = view.$el;
      if (included) {
        if (animationDuration) $viewEl.css('opacity', 0);
      } else {
        $viewEl.css('display', 'none');
      }
      $list = this.$list;
      children = $list.children(this.itemSelector);
      length = children.length;
      if (length === 0 || position === length) {
        $list.append(viewEl);
      } else {
        if (position === 0) {
          $next = children.eq(position);
          $next.before(viewEl);
        } else {
          $previous = children.eq(position - 1);
          $previous.after(viewEl);
        }
      }
      view.trigger('addedToDOM');
      this.updateVisibleItems(item, included);
      if (animationDuration && included) {
        return $viewEl.animate({
          opacity: 1
        }, animationDuration);
      }
    };

    CollectionView.prototype.removeViewForItem = function(item) {
      var view;
      this.updateVisibleItems(item, false);
      view = this.viewsByCid[item.cid];
      return this.removeView(item.cid, view);
    };

    CollectionView.prototype.removeView = function(cid, view) {
      view.dispose();
      return delete this.viewsByCid[cid];
    };

    CollectionView.prototype.updateVisibleItems = function(item, includedInFilter, triggerEvent) {
      var includedInVisibleItems, visibilityChanged, visibleItemsIndex;
      if (triggerEvent == null) triggerEvent = true;
      visibilityChanged = false;
      visibleItemsIndex = _(this.visibleItems).indexOf(item);
      includedInVisibleItems = visibleItemsIndex > -1;
      if (includedInFilter && !includedInVisibleItems) {
        this.visibleItems.push(item);
        visibilityChanged = true;
      } else if (!includedInFilter && includedInVisibleItems) {
        this.visibleItems.splice(visibleItemsIndex, 1);
        visibilityChanged = true;
      }
      if (visibilityChanged && triggerEvent) {
        this.trigger('visibilityChange', this.visibleItems);
      }
      return visibilityChanged;
    };

    CollectionView.prototype.dispose = function() {
      /*console.debug 'CollectionView#dispose', this, 'disposed?', @disposed
      */
      var cid, prop, properties, view, _i, _len, _ref;
      if (this.disposed) return;
      this.collection.off(null, null, this);
      _ref = this.viewsByCid;
      for (cid in _ref) {
        if (!__hasProp.call(_ref, cid)) continue;
        view = _ref[cid];
        view.dispose();
      }
      properties = ['$list', '$fallback', '$loading', 'viewsByCid', 'visibleItems'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      return CollectionView.__super__.dispose.apply(this, arguments);
    };

    return CollectionView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "chaplin/views/view": function(exports, require, module) {
    (function() {
  var Subscriber, View, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  utils = require('chaplin/lib/utils');

  Subscriber = require('chaplin/lib/subscriber');

  require('lib/view_helper');

  module.exports = View = (function(_super) {
    var wrapMethod;

    __extends(View, _super);

    _(View.prototype).extend(Subscriber);

    View.prototype.autoRender = false;

    View.prototype.containerSelector = null;

    View.prototype.containerMethod = 'append';

    View.prototype.subviews = null;

    View.prototype.subviewsByName = null;

    wrapMethod = function(obj, name) {
      var func;
      func = obj[name];
      return obj[name] = function() {
        func.apply(obj, arguments);
        return obj["after" + (utils.upcase(name))].apply(obj, arguments);
      };
    };

    function View() {
      if (this.initialize !== View.prototype.initialize) {
        wrapMethod(this, 'initialize');
      }
      if (this.initialize !== View.prototype.initialize) {
        wrapMethod(this, 'render');
      } else {
        this.render = _(this.render).bind(this);
      }
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.initialize = function(options) {
      /*console.debug 'View#initialize', this, 'options', options
      */      this.subviews = [];
      this.subviewsByName = {};
      if (this.model || this.collection) this.modelBind('dispose', this.dispose);
      if (this.initialize === View.prototype.initialize) {
        return this.afterInitialize();
      }
    };

    View.prototype.afterInitialize = function() {
      var autoRender;
      autoRender = this.options.autoRender != null ? this.options.autoRender : this.autoRender;
      if (autoRender) return this.render();
    };

    View.prototype.delegate = function(eventType, second, third) {
      var handler, selector;
      if (typeof eventType !== 'string') {
        throw new TypeError('View#delegate: first argument must be a string');
      }
      if (arguments.length === 2) {
        handler = second;
      } else if (arguments.length === 3) {
        selector = second;
        if (typeof selector !== 'string') {
          throw new TypeError('View#delegate: ' + 'second argument must be a string');
        }
        handler = third;
      } else {
        throw new TypeError('View#delegate: ' + 'only two or three arguments are allowed');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('View#delegate: ' + 'handler argument must be function');
      }
      eventType += ".delegate" + this.cid;
      handler = _(handler).bind(this);
      if (selector) {
        return this.$el.on(eventType, selector, handler);
      } else {
        return this.$el.on(eventType, handler);
      }
    };

    View.prototype.undelegate = function() {
      return this.$el.unbind(".delegate" + this.cid);
    };

    View.prototype.modelBind = function(type, handler) {
      var model;
      if (typeof type !== 'string') {
        throw new TypeError('View#modelBind: ' + 'type must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('View#modelBind: ' + 'handler argument must be function');
      }
      model = this.model || this.collection;
      if (!model) {
        throw new TypeError('View#modelBind: no model or collection set');
      }
      model.off(type, handler, this);
      return model.on(type, handler, this);
    };

    View.prototype.modelUnbind = function(type, handler) {
      var model;
      if (typeof type !== 'string') {
        throw new TypeError('View#modelUnbind: ' + 'type argument must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('View#modelUnbind: ' + 'handler argument must be a function');
      }
      model = this.model || this.collection;
      if (!model) return;
      return model.off(type, handler);
    };

    View.prototype.modelUnbindAll = function() {
      var model;
      model = this.model || this.collection;
      if (!model) return;
      return model.off(null, null, this);
    };

    View.prototype.pass = function(attribute, selector) {
      var _this = this;
      return this.modelBind("change:" + attribute, function(model, value) {
        var $el;
        $el = _this.$(selector);
        if ($el.is(':input')) {
          return $el.val(value);
        } else {
          return $el.text(value);
        }
      });
    };

    View.prototype.subview = function(name, view) {
      if (name && view) {
        this.removeSubview(name);
        this.subviews.push(view);
        this.subviewsByName[name] = view;
        return view;
      } else if (name) {
        return this.subviewsByName[name];
      }
    };

    View.prototype.removeSubview = function(nameOrView) {
      var index, name, otherName, otherView, view, _ref;
      if (!nameOrView) return;
      if (typeof nameOrView === 'string') {
        name = nameOrView;
        view = this.subviewsByName[name];
      } else {
        view = nameOrView;
        _ref = this.subviewsByName;
        for (otherName in _ref) {
          otherView = _ref[otherName];
          if (view === otherView) {
            name = otherName;
            break;
          }
        }
      }
      if (!(name && view && view.dispose)) return;
      view.dispose();
      index = _(this.subviews).indexOf(view);
      if (index > -1) this.subviews.splice(index, 1);
      return delete this.subviewsByName[name];
    };

    View.prototype.getTemplateData = function() {
      var modelAttributes, templateData;
      modelAttributes = this.model && this.model.getAttributes();
      templateData = modelAttributes ? utils.beget(modelAttributes) : {};
      if (this.model && typeof this.model.state === 'function') {
        templateData.resolved = this.model.state() === 'resolved';
      }
      return templateData;
    };

    View.prototype.getTemplateFunction = function() {
      throw new Error('View#getTemplateFunction must be overridden');
    };

    View.prototype.render = function() {
      /*console.debug 'View#render', this
      */
      var html, templateData, templateFunc;
      if (this.disposed) return;
      templateData = this.getTemplateData();
      templateFunc = this.getTemplateFunction();
      if (typeof templateFunc === 'function') {
        html = templateFunc(templateData);
        this.$el.empty().append(html);
      }
      return this;
    };

    View.prototype.afterRender = function() {
      var container, containerMethod;
      container = this.options.container != null ? this.options.container : this.containerSelector;
      if (container) {
        containerMethod = this.options.containerMethod != null ? this.options.containerMethod : this.containerMethod;
        $(container)[containerMethod](this.el);
        this.trigger('addedToDOM');
      }
      return this;
    };

    View.prototype.disposed = false;

    View.prototype.dispose = function() {
      /*console.debug 'View#dispose', this, 'disposed?', @disposed
      */
      var prop, properties, view, _i, _j, _len, _len2, _ref;
      if (this.disposed) return;
      _ref = this.subviews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.dispose();
      }
      this.unsubscribeAllEvents();
      this.modelUnbindAll();
      this.off();
      this.$el.remove();
      properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
      for (_j = 0, _len2 = properties.length; _j < _len2; _j++) {
        prop = properties[_j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return View;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "controllers/controller": function(exports, require, module) {
    (function() {
  var ChaplinController, Controller,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinController = require('chaplin/controllers/controller');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(ChaplinController);

}).call(this);

  }
}));
(this.require.define({
  "controllers/image_controller": function(exports, require, module) {
    (function() {
  var Controller, ImageController, ImagePageView, mediator,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Controller = require('controllers/controller');

  ImagePageView = require('views/image_page_view');

  mediator = require('mediator');

  module.exports = ImageController = (function(_super) {

    __extends(ImageController, _super);

    function ImageController() {
      ImageController.__super__.constructor.apply(this, arguments);
    }

    ImageController.prototype.random = function() {
      var _this = this;
      return mediator.allImages.synced(function() {
        var rand;
        rand = Math.floor(mediator.allImages.length * Math.random());
        return _this.detail({
          idx: rand
        });
      });
    };

    ImageController.prototype.detail = function(params) {
      var idx,
        _this = this;
      idx = parseInt(params.idx);
      return mediator.allImages.synced(function() {
        var model, nextUrl, previousUrl;
        model = mediator.allImages.at(idx);
        previousUrl = idx > 0 ? "image/" + (idx - 1) : null;
        nextUrl = idx + 1 < mediator.allImages.length ? "image/" + (idx + 1) : null;
        return _this.view = new ImagePageView({
          model: model
        }, previousUrl, nextUrl);
      });
    };

    ImageController.prototype.detail_tag = function(params) {
      var idx, tag,
        _this = this;
      idx = parseInt(params.idx);
      tag = params.tag;
      return mediator.allImages.synced(function() {
        var filteredImageIndex, filteredImages, image, index, model, nextImage, nextUrl, previousImage, previousUrl, _len;
        model = mediator.allImages.at(idx);
        filteredImages = _(mediator.allImages.toJSON()).filter(function(image) {
          return __indexOf.call(image.urlized_tags, tag) >= 0;
        });
        filteredImageIndex = 0;
        for (index = 0, _len = filteredImages.length; index < _len; index++) {
          image = filteredImages[index];
          if (image.idx === idx) {
            filteredImageIndex = index;
            break;
          }
        }
        previousUrl = null;
        if (filteredImageIndex > 0) {
          previousImage = filteredImages[filteredImageIndex - 1];
          previousUrl = "image/" + tag + "/" + previousImage.idx;
        }
        nextUrl = null;
        if (filteredImageIndex + 1 < filteredImages.length) {
          nextImage = filteredImages[filteredImageIndex + 1];
          nextUrl = "image/" + tag + "/" + nextImage.idx;
        }
        return _this.view = new ImagePageView({
          model: model
        }, previousUrl, nextUrl);
      });
    };

    return ImageController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/images_controller": function(exports, require, module) {
    (function() {
  var Controller, ImagesController, ImagesView, mediator,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/controller');

  ImagesView = require('views/images_view');

  mediator = require('mediator');

  module.exports = ImagesController = (function(_super) {

    __extends(ImagesController, _super);

    function ImagesController() {
      ImagesController.__super__.constructor.apply(this, arguments);
    }

    ImagesController.prototype.index = function() {
      return this.view = new ImagesView({
        collection: mediator.allImages
      });
    };

    ImagesController.prototype.list_with_tag = function(params) {
      return this.view = new ImagesView({
        collection: mediator.allImages
      }, params.tag);
    };

    return ImagesController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/navigation_controller": function(exports, require, module) {
    (function() {
  var Controller, NavigationController, NavigationView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/controller');

  NavigationView = require('views/navigation_view');

  module.exports = NavigationController = (function(_super) {

    __extends(NavigationController, _super);

    function NavigationController() {
      NavigationController.__super__.constructor.apply(this, arguments);
    }

    NavigationController.prototype.initialize = function() {
      NavigationController.__super__.initialize.apply(this, arguments);
      return this.view = new NavigationView;
    };

    return NavigationController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/session_controller": function(exports, require, module) {
    (function() {
  var Controller, SessionController, mediator, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  Controller = require('controllers/controller');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {};

    return SessionController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/support": function(exports, require, module) {
    (function() {
  var chaplinSupport, support, utils;

  utils = require('lib/utils');

  chaplinSupport = require('chaplin/lib/support');

  support = utils.beget(chaplinSupport);

  module.exports = support;

}).call(this);

  }
}));
(this.require.define({
  "lib/utils": function(exports, require, module) {
    (function() {
  var chaplinUtils, mediator, utils;

  mediator = require('mediator');

  chaplinUtils = require('chaplin/lib/utils');

  utils = chaplinUtils.beget(chaplinUtils);

  _(utils).extend({
    urlize: function(url) {
      url = $.trim(url.replace(/[^\w\s-]/g, ''));
      return url.replace(/[-\s]+/g, '-');
    }
  });

  module.exports = utils;

}).call(this);

  }
}));
(this.require.define({
  "lib/view_helper": function(exports, require, module) {
    (function() {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('./utils');

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('urlize', function(data) {
    return new Handlebars.SafeString(utils.urlize(data));
  });

}).call(this);

  }
}));
(this.require.define({
  "mediator": function(exports, require, module) {
    (function() {
  var createMediator, mediator, support;

  createMediator = require('chaplin/lib/create_mediator');

  support = require('chaplin/lib/support');

  mediator = createMediator();

  mediator.allImages = null;

  if (support.propertyDescriptors && Object.seal) Object.seal(mediator);

  module.exports = mediator;

}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var ChaplinCollection, Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinCollection = require('chaplin/models/collection');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(ChaplinCollection);

}).call(this);

  }
}));
(this.require.define({
  "models/image": function(exports, require, module) {
    (function() {
  var Image, Model, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  utils = require('lib/utils');

  module.exports = Image = (function(_super) {
    var idx;

    __extends(Image, _super);

    function Image() {
      Image.__super__.constructor.apply(this, arguments);
    }

    idx = 0;

    Image.prototype.parse = function(data) {
      data.idx = idx++;
      data.pub_date = new Date(data.pub_date);
      data.file_raw = "" + Settings.raw + "/" + data.file;
      data.file_medium = "" + Settings.medium + "/" + data.file;
      data.file_small = "" + Settings.small + "/" + data.file;
      data.urlized_tags = _(data.tags).map(utils.urlize);
      return data;
    };

    return Image;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/images": function(exports, require, module) {
    (function() {
  var Collection, Image, Images,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Collection = require('./collection');

  Image = require('./image');

  module.exports = Images = (function(_super) {

    __extends(Images, _super);

    function Images() {
      Images.__super__.constructor.apply(this, arguments);
    }

    Images.prototype.model = Image;

    Images.prototype.url = 'images.json';

    Images.prototype.initialize = function() {
      Images.__super__.initialize.apply(this, arguments);
      return this.initSyncMachine();
    };

    Images.prototype.fetch = function() {
      var _this = this;
      this.beginSync();
      return Images.__super__.fetch.call(this, {
        success: function() {
          return _this.finishSync();
        }
      });
    };

    return Images;

  })(Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var ChaplinModel, Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinModel = require('chaplin/models/model');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(ChaplinModel);

}).call(this);

  }
}));
(this.require.define({
  "routes": function(exports, require, module) {
    (function() {

  module.exports = function(match) {
    match('', 'image#random');
    match('image/:idx', 'image#detail');
    match('image/:tag/:idx', 'image#detail_tag');
    match('list', 'images#index');
    return match('list/:tag', 'images#list_with_tag');
  };

}).call(this);

  }
}));
(this.require.define({
  "views/image_page_view": function(exports, require, module) {
    (function() {
  var ImagePageView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('views/view');

  template = require('views/templates/image_page');

  module.exports = ImagePageView = (function(_super) {

    __extends(ImagePageView, _super);

    function ImagePageView() {
      ImagePageView.__super__.constructor.apply(this, arguments);
    }

    ImagePageView.prototype.template = template;

    ImagePageView.prototype.containerSelector = '#content-container';

    ImagePageView.prototype.containerMethod = 'html';

    ImagePageView.prototype.id = 'image-page-view';

    ImagePageView.prototype.autoRender = true;

    ImagePageView.prototype.initialize = function(options, previousUrl, nextUrl) {
      this.previousUrl = previousUrl;
      this.nextUrl = nextUrl;
      return ImagePageView.__super__.initialize.apply(this, arguments);
    };

    ImagePageView.prototype.getTemplateData = function() {
      var data;
      data = ImagePageView.__super__.getTemplateData.apply(this, arguments);
      data.previousUrl = this.previousUrl;
      data.nextUrl = this.nextUrl;
      return data;
    };

    return ImagePageView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/image_view": function(exports, require, module) {
    (function() {
  var ImageView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('views/view');

  template = require('views/templates/image');

  module.exports = ImageView = (function(_super) {

    __extends(ImageView, _super);

    function ImageView() {
      ImageView.__super__.constructor.apply(this, arguments);
    }

    ImageView.prototype.template = template;

    ImageView.prototype.tagName = 'a';

    ImageView.prototype.autoRender = true;

    ImageView.prototype.initialize = function(options, tag) {
      var detailLink, idx;
      this.tag = tag;
      ImageView.__super__.initialize.apply(this, arguments);
      idx = this.model.get('idx');
      detailLink = this.tag ? "image/" + this.tag + "/" + idx : "image/" + idx;
      return this.$el.attr({
        href: detailLink
      });
    };

    return ImageView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/images_view": function(exports, require, module) {
    (function() {
  var CollectionView, ImageView, ImagesView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CollectionView = require('chaplin/views/collection_view');

  ImageView = require('./image_view');

  template = require('views/templates/images');

  module.exports = ImagesView = (function(_super) {

    __extends(ImagesView, _super);

    function ImagesView() {
      ImagesView.__super__.constructor.apply(this, arguments);
    }

    ImagesView.prototype.getTemplateFunction = function() {
      return template;
    };

    ImagesView.prototype.containerSelector = '#content-container';

    ImagesView.prototype.containerMethod = 'html';

    ImagesView.prototype.id = 'imageslist-view';

    ImagesView.prototype.listSelector = '.images';

    ImagesView.prototype.animationDuration = 0;

    ImagesView.prototype.initialize = function(options, tag) {
      if (options == null) options = {};
      this.tag = tag != null ? tag : null;
      if (this.tag) {
        options.filterer = function(image) {
          var _ref;
          return _ref = this.tag, __indexOf.call(image.get('urlized_tags'), _ref) >= 0;
        };
      }
      return ImagesView.__super__.initialize.apply(this, arguments);
    };

    ImagesView.prototype.getView = function(item) {
      return new ImageView({
        model: item
      }, this.tag);
    };

    ImagesView.prototype.insertView = function(item, view) {
      ImagesView.__super__.insertView.apply(this, arguments);
      if (view.$el.css('display') === 'none') return;
      view.$el.css('opacity', 0);
      return this.$el.queue(function(next) {
        view.$el.animate({
          opacity: 1
        }, {
          duration: 1000
        });
        return _.delay(next, 100);
      });
    };

    return ImagesView;

  })(CollectionView);

}).call(this);

  }
}));
(this.require.define({
  "views/navigation_view": function(exports, require, module) {
    (function() {
  var NavigationView, View, mediator, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/view');

  template = require('views/templates/navigation');

  module.exports = NavigationView = (function(_super) {

    __extends(NavigationView, _super);

    function NavigationView() {
      NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.template = template;

    NavigationView.prototype.id = 'navigation';

    NavigationView.prototype.className = 'navigation';

    NavigationView.prototype.containerSelector = '#navigation-container';

    NavigationView.prototype.autoRender = true;

    NavigationView.prototype.initialize = function() {
      NavigationView.__super__.initialize.apply(this, arguments);
      return this.subscribeEvent('startupController', this.render);
    };

    return NavigationView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/image": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<img src=\"";
  foundHelper = helpers.file_small;
  stack1 = foundHelper || depth0.file_small;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "file_small", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" />\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/image_page": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <a id=\"leftBtn\" href=\"";
  foundHelper = helpers.previousUrl;
  stack1 = foundHelper || depth0.previousUrl;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "previousUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" class=\"button\"></a>\r\n";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <a href=\"list/";
  stack1 = depth0;
  foundHelper = helpers.urlize;
  stack2 = foundHelper || depth0.urlize;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, { hash: {} }); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "urlize", stack1, { hash: {} }); }
  else { stack1 = stack2; }
  buffer += escapeExpression(stack1) + "\" class=\"tag\">";
  stack1 = depth0;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\r\n    ";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <a id=\"rightBtn\" href=\"";
  foundHelper = helpers.nextUrl;
  stack1 = foundHelper || depth0.nextUrl;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "nextUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" class=\"button\"></a>\r\n";
  return buffer;}

  foundHelper = helpers.previousUrl;
  stack1 = foundHelper || depth0.previousUrl;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<div id=\"detailImage\">\r\n  <a href=\"";
  foundHelper = helpers.file_raw;
  stack1 = foundHelper || depth0.file_raw;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "file_raw", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"><img src=\"";
  foundHelper = helpers.file_medium;
  stack1 = foundHelper || depth0.file_medium;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "file_medium", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" /></a>\r\n  \r\n  <div id=\"tags\">\r\n    ";
  foundHelper = helpers.tags;
  stack1 = foundHelper || depth0.tags;
  stack2 = helpers.each;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </div>\r\n</div>\r\n\r\n";
  foundHelper = helpers.nextUrl;
  stack1 = foundHelper || depth0.nextUrl;
  stack2 = helpers['if'];
  tmp1 = self.program(5, program5, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/images": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"images\">\n</div>\n<div id=\"waypoint\"></div>\n";});
  }
}));
(this.require.define({
  "views/templates/navigation": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<h1><a href=\"list\">Gallery</a></h1>";});
  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    (function() {
  var ChaplinView, View,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinView = require('chaplin/views/view');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(ChaplinView);

}).call(this);

  }
}));
