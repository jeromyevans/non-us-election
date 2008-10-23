/*global blueskyminds*/
// create the global blueskyminds namespace
if (typeof blueskyminds == 'undefined') {
    var blueskyminds = {};
}

/**
 * Initialise new namespace(s) if they don't exist
 *
 * NOTE: Do not use reserved words in package/namespace names
 *
 * @param  one or more namespaces to initialise
 * @return last created namespace
 **/
blueskyminds.namespace = function(namespaces) {
    var args = arguments;
    var packageNames;
    var currentNamespace;

    for (var i = 0; i < args.length; i++) {
        currentNamespace = window;  // start at the window object
        packageNames = args[i].split('.');
        for (var j = 0; j < packageNames.length; j++) {
            // check if the child namespace exists
            if (!currentNamespace[packageNames[j]]) {
                // initialise the new child namespace
                currentNamespace[packageNames[j]] = {};
            }
            // iterate deeper into hierarchy
            currentNamespace = currentNamespace[packageNames[j]];
        }
    }
    return currentNamespace;
};

/**
 * Method to log debug messages
 * Logged messages can be viewed via the blueskyminds.ui.Log
 *
 * Depends on blueskyminds.events but will not throw an error if its not defined
 *
 * @param message
 */
blueskyminds.log = function() {

    /**
     * If the events haven't been regsitered yet, attemts to register them now
     *
     * @return true if events are enabled and registered
     */
    function eventsLoaded() {
        return (typeof blueskyminds.events.log != 'undefined');
    }

    return {
        debug : function(message) {
            if (eventsLoaded()) {
                blueskyminds.events.log.debug(message);
            }
        },
        info : function(message) {
            if (eventsLoaded()) {
                blueskyminds.events.log.info(message);
            }
        },
        error : function(message) {
            if (eventsLoaded()) {
                blueskyminds.events.log.error(message);
            }
        }
    };
}();

/**
 * @description date,time and calendar tools
 */
blueskyminds.calendar = function() {

    //var Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var _ShortMonths = ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    /**
     * @description format a date as a string in shortDateFormat dd MMM yy
     *
     * @param oDate
     */
    function _shortDateFormat(oDate) {
        if (YAHOO.lang.isObject(oDate)) {
            var year = oDate.getYear();
            if (year < 1000) {
                year += 1900;
            }
            return oDate.getDate() + " " + _ShortMonths[oDate.getMonth()] + " " + year;
        } else {
            return null;
        }
    }

    /**
     * @description format a date as a string in shortDateFormat dd MMM yy hh:mm:ss
     *
     * @param oDate
     */
    function _shortDateTimeFormat(oDate) {
        if (YAHOO.lang.isObject(oDate)) {
            var year = oDate.getYear();
            if (year < 1000) {
                year += 1900;
            }
            return oDate.getDate() + " " + _ShortMonths[oDate.getMonth()] + " " + year + " " + oDate.getHours() + ":" + oDate.getMinutes() + ":" + oDate.getSeconds();
        } else {
            return null;
        }
    }

    return {
        /**
         * @description format a date as a string in shortDateFormat dd MMM yy
         *
         * @param oDate
         */
        shortDateFormat: function(oDate) {
            return _shortDateFormat(oDate);
        },
        /**
         * @description format a date as a string in shortDateFormat dd MMM yy hh:mm:ss
         *
         * @param oDate
         */
        shortDateTimeFormat : function(oDate) {
            return _shortDateTimeFormat(oDate);
        },
        /**
         * Creates a javascript Date object set to today plus on year
         * @return oDate
         */
        inOneYear: function() {
            var today = new Date();
            var year = today.getYear();
            if (year < 1000) {
                year += 1900;
            }
            return new Date(year + 1, today.getMonth(), today.getDate());
        }
    };
}();
//
//blueskyminds.utils = function() {
//    return {
//        /**
//         * Merge values into a template
//         * @param template
//         * @param values
//         */
//        mergeTemplate : function(template, values) {
//            return YAHOO.Tools.printf(template, values);
//        }
//    };
//}();

// Dependencies:
//   blueskyminds-core
/*global blueskyminds,YAHOO*/
blueskyminds.namespace("blueskyminds.dom");

blueskyminds.dom.escapeHTML = function(text, preserveBreaks) {
    if (text) {
        var result = text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
        if (preserveBreaks) {
            result = result.replace(/\n/, "<br/>");
        }
        return result;
    } else {
        return null;
    }
};

/** Resolves whether a reference to a node is by id or directly */
blueskyminds.dom.resolveReference = function(idOrNode) {
    var el;
    if (YAHOO.lang.isObject(idOrNode)) {
        el = idOrNode;
    } else {
        if (YAHOO.lang.isString(idOrNode)) {
            el = document.getElementById(idOrNode);
        }
    }
    return el;
};

/**
 * Insert the specified text into the DOM
 *
 * Escaped by default
 *
 * Replaces the existing HTML content of the container
 *
 * @param idOrElement   {String|Element} idOrElement of the container
 * @param text
 * @param dontEscape    optional
 */
blueskyminds.dom.insertHTML = function (idOrElement, text, dontEscape) {
    var el = blueskyminds.dom.resolveReference(idOrElement);
    if (el) {
        var escaped = (dontEscape ? text : blueskyminds.dom.escapeHTML(text));
        if (escaped) {
            el.innerHTML = escaped;
        } else {
            blueskyminds.dom.clearHTML(el);
        }
    }
};

/**
 * Append the specified text into the DOM
 *
 * Escaped by default
 *
 * Appends to HTML content after the last child of the container
 *
 * @param {String|Element} idOrElement   id/element of the container
 * @param tagName       the name of the tag that will be used as a container for the text.  eg. span
 * @param text
 * @param dontEscape    optional
 */
blueskyminds.dom.appendHTML = function (idOrElement, tagName, text, dontEscape) {
    var el = blueskyminds.dom.resolveReference(idOrElement);
    if (el) {
        var escaped = (dontEscape ? text : blueskyminds.dom.escapeHTML(text));
        if (escaped) {
            var sibling = document.createElement(tagName);
            sibling.innerHTML = escaped;
            el.appendChild(sibling);
        }
    }
};

/**
 * Clear the child elements of el
 *
 * @param el
 */
blueskyminds.dom.clearHTML = function(idOrElement) {
    var el = blueskyminds.dom.resolveReference(idOrElement);
    if (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
};

blueskyminds.namespace("blueskyminds.xml");
/** 
 * Parse XML
 * @return root node
 * */
blueskyminds.xml.parse = function(xmlText) {
    var rootNode;
    var browser = YAHOO.Tools.getBrowserEngine();
    if (browser.msie) {
        window.status = "IE!";
        var doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(xmlText);
    } else {
        var parser = new DOMParser();
        doc = parser.parseFromString(xmlText, "text/xml");
    }

    rootNode = doc.documentElement;

    window.status = rootNode;

    return rootNode;
};

/**
 * @description Parse a string to ensure it is a save function name prior to evaluation. This implementation
 * ensures the name contains only letters and dots.
 *
 *
 * @param name    the candidate function name
 */
blueskyminds.dom.isSafeFunctionName = function(name) {
    return name.match(/^\w[\w|\d|\.]+$/);
};// dependencies:
//  blueskyminds-core
//
/*global blueskyminds,YAHOO*/
blueskyminds.namespace("blueskyminds");

/**
 * Management of application-wide events
 */
blueskyminds.events = function() {

    /**
     description:  Map of events registered by name
     */
    var eventMap = {};

    /**
     *  A proxy for an event that hasn't been defined yet.
     * Allows subscribers to subscribe before the event has been registered
     *
     * @param eventName
     */
    var EventProxy = function(eventName) {

        var subscribers = [];

        /** Records a reference to a subscriber */
        var SubscriberRef = function(callback, context) {
            this.callback = callback;
            this.context = context;
        };

        return {
            isProxy: true,
            subscribe : function(callback, context) {
                subscribers[subscribers.length] = new SubscriberRef(callback, context);
            },
            fire : function(args) {
                // no op
            },
            subscribers: function() {
                return subscribers;
            }
        };
    };

    /**
     * Replace an existing event proxy with a real event
     * Subscribers to the proxy are transferred to the event
     * */
    function replaceProxy(eventName, proxy, event) {
        eventMap[eventName] = event;

        for (var subscriber in proxy.subscribers()) {
            if (proxy.hasOwnProperty(subscriber)) {
                event.subscribe(subscriber.callback, subscriber.context);
            }
        }
        blueskyminds.log.debug(eventName + " event proxy replaced");
    }

    /**
     * Create a proxy for an event that isn't defined yet.  This allows subscriptions to the
     * event to be recorded prior to registration of the event
     *
     * @param eventName
     * @param callback
     * @param context
     */
    function createProxy(eventName) {
        var proxy = new EventProxy(eventName);
        eventMap[eventName] = proxy;
        blueskyminds.log.debug(eventName + " event proxy registered");
        return proxy;
    }

    /**
     * Get the named event
     * If the event doesn't a proxy for the event is returned
     *
     * @param eventName
     * @return CustomEvent object if defined
     */
    function getEvent(eventName) {
        var event = eventMap[eventName];
        if (!event) {
            return createProxy(eventName);
        } else {
            return event;
        }
    }

    function setEvent(eventName, event) {
        var existing = eventMap[eventName];
        if (!existing) {
            eventMap[eventName] = event;
            blueskyminds.log.debug(eventName + " event registered");
        } else {
            if (existing.isProxy) {
                replaceProxy(eventName, existing, event);
            } else {
                // replace existing event      // todo: should subscribers be copied?
                eventMap[eventName] = event;
            }
        }
    }

    function init() {
        // setup special-purpose events
        eventMap.debug = new YAHOO.util.CustomEvent("debug");
        eventMap.info = new YAHOO.util.CustomEvent("info");
        eventMap.error = new YAHOO.util.CustomEvent("error");
    }

    init();

    return {

        /**
         Register a named event with the controller.
         Named events can be listened to through the suburb method
         @param event   the event instance
         */
        register : function(eventName, event) {
            setEvent(eventName, event);
        },

        /**
         Subscribe to the named event.
         If the event has not been registered a placeholder will be saved and the subscription enabled
         upon registration

         When the event occurs, the callback will be executed with the context as an argumentt

         @param callback   callback method to invoke when the event occurs
         @param context    optional context that will be provided to the callback when the event occurs

         */
        subscribe : function(eventName, callback, context) {
            var event = getEvent(eventName);
            // subscribe to the event/eventProxy
            event.subscribe(callback, context);
            //blueskyminds.log.debug(eventName+" event subscribed");                           
        },

        /**
         Fire the named event

         @param args   object/array to pass to the subscribers as the event payload

         */
        fire : function(eventName, args) {
            var event = getEvent(eventName);
            if (event) {
                event.fire(args);
                blueskyminds.log.debug(eventName + " event fired");
            }
        },
        /** Special namespace for firing logging events to ensure it's not logged (otherwise infinite recursion would result).
         * The explict methods are provided to ensure this mechanism can't be used to fire non-logging events */
        log : {
            debug : function(message) {
                var event = getEvent('logDebug');
                if (event) {
                    event.fire(message);
                }
            },
            info : function(message) {
                var event = getEvent('logInfo');
                if (event) {
                    event.fire(message);
                }
            },
            warn : function(message) {
                var event = getEvent('logInfo'); // todo: add another log level
                if (event) {
                    event.fire("WARN: " + message);
                }
            },
            error : function(message) {
                var event = getEvent('logError');
                if (event) {
                    event.fire(message);
                }
            }
        }
    };
}();


/** Calls the callback if not reset for the specified number of ticks to wait */
blueskyminds.events.IdleTimer = function(tickInterval, millisToWait, callback) {

    var tickCounter;
    var lastFired;
    var ticksToWait;

    /** Executed every interval tick */
    function tickListener() {
        tickCounter++;
        if (tickCounter - lastFired > ticksToWait) {
            callback();
            lastFired = tickCounter;
        }
    }

    function init() {
        tickCounter = 0;
        lastFired = 0;
        ticksToWait = (millisToWait / tickInterval);
        setInterval(tickListener, tickInterval);
    }

    init();

    return {
        reset : function() {
            tickCounter = 0;
            lastFired = 0;
        }
    };
};// Dependencies:
//   blueskyminds-core
/*global blueskyminds*/
blueskyminds.namespace("blueskyminds.net", "blueskyminds.net.json");

/**
 * Evaluate a JSON structure into an object
 * Strips trailing and leading comments
 * @return the corresponding object or null if invalid
 * */
blueskyminds.net.json.evaluate = function(response) {
    var obj = null;
    if (response) {
        if ((response.indexOf("/*") >= 0) && (response.lastIndexOf("*/") >= 0)) {
            try {
                obj = eval("(" + response.substring(response.indexOf("/*") + 2, response.lastIndexOf("*/")) + ")");
            } catch (ex) {
                // ingore invalid json
                blueskyminds.log.error("Exception evaluating JSON-commented response" + ex);
            }
        } else {
            try {
                obj = eval("(" + response + ")");
            } catch (ex2) {
                // ingore invalid json
                blueskyminds.log.error("Exception evaluating JSON response" + ex2);
            }
        }
    }
    return obj;
};

blueskyminds.net.json.isJSON = function(str) {
    var trimmed = str.replace(/^\s+/, '');
    return trimmed.match(/^\{/) || trimmed.match(/^\/\*/);
};
/**
 * returns an error message corresponding to an asyc request error response
 */
blueskyminds.net.errorMessage = function(o) {
    var result = null;

    if (o) {
        switch (o.status) {
            case 0 :
                result = "Unable to contact the server: communication error";
                break;
            case -1:
                result = "Transaction aborted";
                break;
            default:
                result = "The server reported an error: " + o.status;
                break;
        }
    } else {
        result = "Invalid server response";
    }
    return result;
};

/**
 * @description calculate the relative path for a URL
 * @param url
 */
blueskyminds.net.relativePath = function(url) {
    if (url && url.length > 0) {
        return url.substring(url.indexOf(location.host) + location.host.length);
    } else {
        return url;
    }
};

/**
 * @description hostname of the server (according to the window)
 */
blueskyminds.net.hostname = function() {
    return location.hostname;
};
/*global blueskyminds,YAHOO,document,window*/
// dependencies:
//   blueskyminds-core
//   blueskyminds-dom
//   blueskyminds-events
blueskyminds.namespace("blueskyminds.ui", "blueskyminds.ui.datatable");

/**
 * A simple console for displaying messages
 */
blueskyminds.ui.MessageConsole = function(containerId) {

    var container;

    function init() {
        container = document.getElementById(containerId);
    }

    init();

    return {
        clear : function() {
            blueskyminds.dom.clearHTML(container);
        },
        println : function(message) {
            blueskyminds.dom.appendHTML(container, 'div', message);
        },
        print : function(message) {
            blueskyminds.dom.appendHTML(container, 'span', message);
        },
        isEnabled : function() {
            return container !== null;   // note: !== is deliberate
        }
    };
};

/**
 * A specialisation of a Console for logging debug information
 *
 * @param containerId
 */
blueskyminds.ui.Logger = function(containerId) {

    var msgConsole;

    /** Logs a message or messages using the specified method
     *
     * @param method     function to use (eg. debug, info)
     * @param message    {String|Array} messsage(s)
     */
    function log(method, message) {
        if (YAHOO.lang.isString(message)) {
            method(message);
        } else {
            if (message.length > 0) {
                for (var i = 0; i < message.length; i++) {
                    method(message[i]);
                }
            }
        }
    }

    function debug(message) {
        msgConsole.println("debug:" + message);
    }

    function info(message) {
        msgConsole.println("info:" + message);
    }

    function error(message) {
        msgConsole.println("error:" + message);
    }

    /** Listener for the debug event */
    function onDebug(type, args, context) {
        log(debug, args);
    }

    /** Listener for the info event */
    function onInfo(type, args, context) {
        log(info, args);
    }

    /** Listener for the error event */
    function onError(type, args, context) {
        log(error, args);
    }

    function init() {
        msgConsole = new blueskyminds.ui.MessageConsole(containerId);
        blueskyminds.events.subscribe("logDebug", onDebug);
        blueskyminds.events.subscribe("logInfo", onInfo);
        blueskyminds.events.subscribe("logError", onError);
        log(info, "Logger started");
    }

    init();

    return {
        debug : function(/*{String|Array}*/message) {
            log(debug, message);
        },
        info : function(/*{String|Array}*/message) {
            log(info, message);
        },
        error : function(/*{String|Array}*/message) {
            log(error, message);
        }
    };
};

/**
 * Progress indicator is used to show that an asynchronous operation is in progress
 * @param startEventName
 * @param stopEventName
 * @param indicatorId
 */
blueskyminds.ui.ProgressIndicatorController = function(indicatorId, startEventName, stopEventName) {

    /** Callback when the startEvent is fired */
    function onStart(type, args, context) {
        var indicator = document.getElementById(indicatorId);
        if (indicator) {
            indicator.style.display = "inline";
        }
    }

    /** Callback when the stopEvent is fired */
    function onStop(type, args, context) {
        var indicator = document.getElementById(indicatorId);
        if (indicator) {
            indicator.style.display = "none";
        }
    }

    blueskyminds.events.subscribe(startEventName, onStart);
    blueskyminds.events.subscribe(stopEventName, onStop);
};


/**
 * ErrorController subscribes to error events and displays them
 *
 * @param errorContainerId parent container
 * @param errorEventName  name of the error event to listen for
 * @param optCallback     callback that will insert the relevant node(s) into the dom instead of using a template
 * @param optTemplate     optional template to use to decorate the error message.  If a template
 *    is not provided the escaped message will be inserted directly into the container
 *    The templateContext replaces ${message}
 *   The template is a JST Template object
 *
 */
blueskyminds.ui.ErrorController = function(errorContainerId, errorEventName, optCallback, optTemplate) {

    var containerId = errorContainerId;

    /**
     * This callback is executed when the error event is fired
     **/
    function errorCallback(type, args, context) {
        var paraBody = args[0];
        var container = document.getElementById(containerId);
        if (optCallback) {
            var node = optCallback(paraBody);
            if (node && container) {
                blueskyminds.dom.clearHTML(containerId);
                container.appendChild(node);
            }
        } else {
            if (container) {
                if (optTemplate) {
                    var templateContext = {
                        message: paraBody
                    };
                    var html = optTemplate.process(templateContext);
                    blueskyminds.dom.insertHTML(containerId, html, true);
                    container.style.display = 'block';
                } else {
                    var timestamp = blueskyminds.calendar.shortDateTimeFormat(new Date());
                    blueskyminds.dom.insertHTML(containerId, timestamp + ":" + paraBody);
                    container.style.display = 'block';
                }
            }
        }
    }

    // the ErrorController instance will be the scope for the event
    blueskyminds.events.register(errorEventName, new YAHOO.util.CustomEvent(errorEventName, this));
    blueskyminds.events.subscribe(errorEventName, errorCallback, null);

    return {
        dismissErrors: function() {
            var container = document.getElementById(containerId);
            if (container) {
                blueskyminds.dom.clearHTML(container);
            }
        }
    };
};

/**
 * @description a registry of handlers for forms, keyed by the form id or class
 */
blueskyminds.ui.forms = function() {

    var _formHandlersById = {};
    var _formHandlersByClass = {};

    return {
        /**
         * @description register a handler for the form with the specified id
         * @param id
         */
        registerHandlerForForm : function(id, handler) {
            _formHandlersById[id] = handler;
        },
        /**
         * @description register a handle for all the forms with the specified class
         * @param class
         */
        registerHandlerForForms : function(className, handler) {
            _formHandlersByClass[className] = handler;
        },
        /**
         * Get the handler for the form if defined
         * @param id
         * @param defaultHandler    handler to return if there's no match
         * @return the handler found, otherwise the default handler
         */
        getHandler : function(formEl, defaultHandler) {
            var Dom = YAHOO.util.Dom;
            var handler = null;

            if (!YAHOO.lang.isNull(formEl) && !YAHOO.lang.isUndefined(formEl) && formEl.tagName === "FORM") {

                // lookup the handler from the attribute of the form
                var handlerName = formEl.getAttribute("data-handler");
                if (handlerName) {
                    if (blueskyminds.dom.isSafeFunctionName(handlerName)) {
                        var handlerRef = eval(handlerName);          // todo: check if there's an alternative approach
                        if (YAHOO.lang.isObject(handlerRef)) {       // todo: check interface
                            handler = handlerRef;
                        }
                    }
                }

                if (!YAHOO.lang.isValue(handler)) {
                    if (formEl.id) {
                        // lookup the handler by id
                        handler = _formHandlersById[formEl.id];
                    }
                }

                if (!YAHOO.lang.isValue(handler)) {
                    // lookup the handler by class
                    for (var className in _formHandlersByClass) {
                        if (Dom.hasClass(formEl, className)) {
                            handler = _formHandlersByClass[className];
                        }
                    }
                }
            }
            if (handler === null) {
                return defaultHandler;
            } else {
                return handler;
            }
        }
    };

}();

blueskyminds.ui.components = function() {


    /**
     * @description convert inline tables into YUI DataTables using the inline data as the DataSource
     *
     * @param containerId
     */
    function initDataTables(containerId) {
        // create datatables
        var Dom = YAHOO.util.Dom;

        var datagrids = Dom.getElementsByClassName("datatable", "div", containerId);
        var tableDataSourceEl;
        var inlineDataSource;
        var headers;
        var columnDefs;
        var dataTable;
        for (j = 0; j < datagrids.length; j++) {
            tableDataSourceEl = Dom.getFirstChildBy(datagrids[j], isTableDataSource);
            if (tableDataSourceEl) {
                inlineDataSource = new YAHOO.util.DataSource(tableDataSourceEl);
                inlineDataSource.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;

                // read column definitions from the table header
                headers = Dom.getElementsBy(isTableHeaderData, null, Dom.getFirstChildBy(tableDataSourceEl, isTableHeader));
                columnDefs = [];
                inlineDataSource.responseSchema = {
                    fields :[]
                };
                for (k = 0; k < headers.length; k++) {
                    columnDefs[k] = {
                        key : headers[k].className.split(" ", 2)[0],  // todo: check if this is the first class
                        sortable : Dom.hasClass(headers[k], "sortable")
                    };
                    inlineDataSource.responseSchema.fields[k] = { key :columnDefs[k].key };
                }

                dataTable = new YAHOO.widget.DataTable(datagrids[j], columnDefs, inlineDataSource);
            }
        }
    }

    /**
     * @description callback for a generic YUI DataTable populated from a TableModel
     *
     * @param containerId
     */
    var genericDataTableCallback = {
        success: function(o) {
            try {
                var tableModel = YAHOO.lang.JSON.parse(o.responseText);
            } catch (e) {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e.message);
            }

            if (YAHOO.lang.isObject(tableModel)) {
                var container = document.getElementById(this.containerId);
                if (container) {
                    // remember the last table model for the sidebar
                    _lastTableModel = tableModel;
                    HousePad.ui.dataTable.render(container, tableModel);
                } else {
                    blueskyminds.events.log.info("The target container for rendering a TableModel does not exist (containerId:" + this.containerId + ").");
                }
            } else {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not a valid TableModel.");
            }
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        }
    };

    /**
     * @description Discover XHR DataTables and issue requests to populate them
     *
     * @param containerId
     */
    function initXHRDataTables(containerId) {
        var Connect = YAHOO.util.Connect;
        var Dom = YAHOO.util.Dom;

        // create datatables
        var datagrids = Dom.getElementsByClassName("xhr-datatable", "div", containerId);
        var actionName;
        for (j = 0; j < datagrids.length; j++) {
            actionName = datagrids[j].className.split(" ", 2)[0];  // todo: revisit this - getting action name from class
            if (actionName) {
                // ensure the container has an id
                if ((YAHOO.lang.isNull(datagrids[j].id) || (datagrids[j].id.length === 0))) {
                    Dom.generateId(datagrids[j]);
                }

                Connect.resetFormState();

                // issue the XHR request.  The containerId will be passed through the scope.
                YAHOO.util.Connect.asyncRequest('GET', _mainPath + "/" + actionName + ".json", {
                    success: genericDataTableCallback.success,
                    failure: genericDataTableCallback.failure,
                    scope: { containerId: datagrids[j].id },
                    cache: true
                });
            }
        }
    }

    /**
     * @description callback for a generic List populated from a TableModel
     *
     * @param containerId
     */
    var genericListCallback = {
        success: function(o) {
            try {
                var tableModel = YAHOO.lang.JSON.parse(o.responseText);
            } catch (e) {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e.message);
            }

            if (YAHOO.lang.isObject(tableModel)) {
                var container = document.getElementById(this.containerId);
                if (container) {
                    HousePad.ui.dataTable.renderAsList(container, tableModel);
                } else {
                    blueskyminds.events.log.info("The target container for rendering a List does not exist (containerId:" + this.containerId + ").");
                }
            } else {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not a valid TableModel.");
            }
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        }
    };

    /**
     * @description Discover XHR Lists and issue requests to populate them
     *
     * @param containerId
     */
    function initXHRLists(containerId) {
        var Connect = YAHOO.util.Connect;
        var Dom = YAHOO.util.Dom;

        // create datatables
        var lists = Dom.getElementsByClassName("xhr-list", "div", containerId);
        var actionName;
        for (j = 0; j < lists.length; j++) {
            actionName = lists[j].className.split(" ", 2)[0];  // todo: revisit this - getting action name from class
            if (actionName) {
                // ensure the container has an id
                if ((YAHOO.lang.isNull(lists[j].id) || (lists[j].id.length === 0))) {
                    Dom.generateId(lists[j]);
                }

                Connect.resetFormState();

                // issue the XHR request.  The containerId will be passed through the scope.
                YAHOO.util.Connect.asyncRequest('GET', _mainPath + "/" + actionName + ".json", {
                    success: genericListCallback.success,
                    failure: genericListCallback.failure,
                    scope: { containerId: lists[j].id },
                    cache: true
                });
            }
        }
    }

    /**
     * @description Discover TabViews in the container
     *
     * @param containerId
     */
    function initTabViews(containerId) {

        var Dom = YAHOO.util.Dom;

        var tabviews = Dom.getElementsByClassName("yui-navset", "div", containerId);
        var tabView;
        for (j = 0; j < tabviews.length; j++) {
            // ensure the container has an id
            if ((YAHOO.lang.isNull(tabviews[j].id) || (tabviews[j].id.length === 0))) {
                Dom.generateId(tabviews[j]);
            }
            tabView = new YAHOO.widget.TabView(tabviews[j]);
        }
    }

    /**
     * Initialise the components and widgets in the specified container
     * @param containerId
     */
    function _initialiseComponents(containerId) {
        blueskyminds.ui.commands.init(containerId);
        initXHRDataTables(containerId);
        initXHRLists(containerId);
        initTabViews(containerId);
    }

    return {
        initialiseComponents: function(containerId) {
            _initialiseComponents(containerId);
        }
    };
}();

blueskyminds.ui.loader = function() {

    var MAIN_BODY_ID = "main";

    /** The path loaded into the "main" area */
    var _mainPath;

    /**
     * Event fired after a XHR component is rendered
     * @param event
     */
    var _renderedEvent = new YAHOO.util.CustomEvent("rendered");

    /**
     * The loading event has two a single string argument [ 'start' | 'stop' ]
     * @param event
     */
    var _loadingEvent = new YAHOO.util.CustomEvent("loading");

    /**
     * Event fired when the context for the main area is about to change.  This is used to trigger updates
     * in the sidebar
     *
     * @param event
     */
    var _beforeMainContextChange = new YAHOO.util.CustomEvent("beforeMainContextChange");

    /**
     * Event fired after the context on the main area is changed.  This is used to trigger updates
     * in the sidebar
     *
     * @param event
     */
    var _afterMainContextChange = new YAHOO.util.CustomEvent("afterMainContextChange");

    /**
     * @description map of events keys by name used by the public addListener method
     * @param event    name of the event
     */
    var _customEvents = {
        rendered : _renderedEvent,
        loading  : _loadingEvent,
        beforeMainContextChange : _beforeMainContextChange,
        afterMainContextChange : _afterMainContextChange
    };

    /**
     * @description an id mapping between a parent containers and target child-container so the findTarget search only
     * has to be performed once per parent/child instance
     */
    var _cachedTargetContainers = {};

    /**
     * True if the id is the id of the main container
     *
     * @param id
     */
    function isMainContainer(id) {
        return (id === MAIN_BODY_ID);
    }

    /**
     * @description Async callback for a loadBody request.  Inserts the HTML response into the body of the
     *  main code at a target identify through the scope
     *
     * If the target was hidden it is automatically revealed
     *
     * @scope object containing targetId and href
     * */
    var loadBodyCallback = {
        success: function(o, args) {
            _loadingEvent.fire("stop");

            if (isMainContainer(this.targetId)) {
                //                _beforeMainContextChange.fire(this.href);

                _mainPath = this.href; // href passed through the scope
                blueskyminds.events.log.debug("_mainPath=" + _mainPath);
            }

            if (YAHOO.util.Dom.hasClass(this.targetId, "restorable")) {
                // backup the target so it can be restored
                blueskyminds.ui.effects.backupChildren(this.targetId);
            }

            // detect whether the result is HTML or JSON
            if (YAHOO.lang.JSON.isValid(o.responseText)) {
                try {
                    var tableModel = YAHOO.lang.JSON.parse(o.responseText);

                    if (YAHOO.lang.isObject(tableModel)) {
                        HousePad.ui.dataTable.render(this.targetId, tableModel);
                    } else {
                        blueskyminds.events.fire("error", "Invalid json table model");
                    }
                } catch (e) {
                    blueskyminds.events.fire("error", "Invalid json response");
                }
            } else {
                blueskyminds.dom.insertHTML(this.targetId, o.responseText, true);
                blueskyminds.ui.components.initialiseComponents(this.targetId);
            }

            // reveal hidden target
            if (YAHOO.util.Dom.hasClass(this.targetId, "hidden")) {
                YAHOO.util.Dom.setStyle(this.targetId, "display", "block");
            }
            //            _renderedEvent.fire();

            //            if (isMainContainer(this.targetId)) {
            //                _afterMainContextChange.fire(this.href);
            //            }
        },
        failure: function(o) {
            _loadingEvent.fire("stop");
            blueskyminds.events.fire("error", blueskyminds.net.errorMessage(o));
        },
        cache : false
    };

    /**
     * @description Async callback for a loadBody request with a command.  Invokes the command upon completion of
     * the request
     *
     * @scope object containing command and href
     * */
    var loadCommandCallback = {
        success: function(o, args) {
            _loadingEvent.fire("stop");

            this.command.invoke(this.href, o);
        },
        failure: function(o) {
            _loadingEvent.fire("stop");
            blueskyminds.events.fire("error", blueskyminds.net.errorMessage(o));
        },
        cache : false
    };


    /**
     * Load the specified fragment into the current DOM
     *
     * @param method        http method to use
     * @param url           resource URL
     * @param formEl        [optional] form to attach to the request
     * @param targetId      [ id | object ] id of the container element to target with the result, or the command to invoke
     * @param cache         [true | false ] false to prevent caching (default true)
     */
    function fetchPageFragment(method, url, formEl, target, cache) {
        if ((url) && (url !== '/')) {
            var Connect = YAHOO.util.Connect;
            Connect.resetFormState();

            if (YAHOO.lang.isValue(formEl)) {
                Connect.setForm(formEl);
            }

            cache = YAHOO.lang.isValue(cache);


            _loadingEvent.fire("start");

            var callback;
            if (YAHOO.lang.isString(target)) {
                // pass the href and target through the scope
                callback = {
                    success: loadBodyCallback.success,
                    failure: loadBodyCallback.failure,
                    scope: {
                        href: url,
                        targetId: target
                    },
                    cache:cache
                };
            } else {
                // invoke a command
                callback = {
                    success: loadCommandCallback.success,
                    failure: loadCommandCallback.failure,
                    scope: {
                        href: url,
                        command: target
                    },
                    cache:cache
                };
            }

            var transaction = Connect.asyncRequest(method, url, callback);
        } else {
            // clear the target div
            blueskyminds.dom.clearHTML(target);
        }
    }

    /**
     * Fetch a new page. Http method is always GET
     *
     * @param url           page URL
     * @param formEl        [optional] form to attach to the request
     */
    function fetchPage(url, formEl) {
        if ((url) && (url !== '/')) {

            if (YAHOO.lang.isValue(formEl)) {
                formEl.method = "GET";
                formEl.action = url;
                formEl.submit();
            } else {
                window.location = url;
            }
        }
    }


    /**
     * Fetch an HTML page or page fragment
     *
     * Source Element
     * If the source element has the refresh class, the request will not be cached
     *
     * URI patterns:
     *
     *  #<id> if preset, identifies a target element by it's id.  If not present, a new page is loaded
     *
     *  ;<class-name> identifies an ancestor element with the specified class.  If found, the children of the
     *   element are hidden (so they can be restored by a cancel)
     *
     *  !
     *
     * @param method     http method to use (GET|POST)
     * @param href       the href including the pattern identifying the target
     * @param sourceEl   the element that the request originates from
     * @param formEl     [optional] form to attach to the request
     */
    function fetchHTML(method, url, sourceEl, formEl) {
        var parts;
        var cache = !YAHOO.util.Dom.hasClass(sourceEl, "refresh");

        var index = url.indexOf("#");
        if (index >= 0) {
            parts = url.split("#", 2);
            fetchPageFragment(method, parts[0], formEl, parts[1], cache);
        } else {
            index = url.indexOf(";");
            if (index >= 0) {
                // load into an ancestor element identified by its classname
                parts = url.split(";", 2);
                var targetEl = YAHOO.util.Dom.getAncestorByClassName(sourceEl, parts[1]);
                if (targetEl) {
                    // if the target doesn't have an id, generate one for it
                    if ((YAHOO.lang.isNull(targetEl.id) || (targetEl.id.length === 0))) {
                        YAHOO.util.Dom.generateId(targetEl);
                    }
                    fetchPageFragment(method, parts[0], formEl, targetEl.id, cache);
                }
            } else {
                index = url.indexOf("!");
                if (index >= 0) {
                    parts = url.split("!", 2);
                    // make a request and invoke the specified command afterwards
                    // todo: okay? the command needs to be defined in the scope of the window
                    fetchPageFragment(method, url, formEl, window[parts[1]], cache);
                } else {
                    // load via the History manager
                    //                    if (_usingHistoryManager && "GET" === method) {
                    //                        History.navigate(MAIN_BODY_HISTORY, blueskyminds.net.relativePath(url));
                    //                    } else {
                    fetchPage(url, formEl);
                    //                    }
                }
            }
        }
    }


    /**
     * @description searches for a target container within a section of the DOM where the search is constrained
     * by a parent element with class matching <prefix>-parent and the target is a descendant with a class
     * matching <prefix>-container.   The search will cache the id of the matching element for the next use
     * for faster searching, generating the id if necessary
     *
     * @param prefix
     * @param startEl       element to start searching (up) from
     */
    var _findTarget = function(prefix, startEl) {
        var Dom = YAHOO.util.Dom;
        var target = null;

        // find the parent container searching up
        var parentDiv = Dom.getAncestorBy(startEl, function(el) {
            return el.nodeName === 'DIV' && Dom.hasClass(el, prefix + "-parent");
        });

        if (parentDiv) {
            var parentDivId = parentDiv.id;

            // check the cache for a matching child id
            var targetId = _cachedTargetContainers[parentDivId];
            if (targetId) {
                target = Dom.get(targetId);
                if (!target) {
                    // the element no longer exists - clear it
                    _cachedTargetContainers[parentDivId] = null;
                    targetId = null;
                }
            }

            if (!targetId) {
                // search for the container
                var targetContainers = Dom.getElementsByClassName(prefix + "-container", "div", parentDiv);

                if (targetContainers !== null && targetContainers.length > 0) {
                    target = targetContainers[0];

                    // cache this parent and child Ids use again later to avoid the search
                    _cachedTargetContainers[Dom.generateId(parentDiv)] = Dom.generateId(target);
                }
            }
        }
        return target;
    };

    return {
        /**
         * Load target container using an href that identifies it
         *
         *  #<id> identifies a target element by it's id
         *  ;<class-name> identifies an ancestor element with the specified class.  If found, the children of the
         *   element are hidden (so they can be restored by a cancel)
         *
         * @param method     http method to use (GET|POST)
         * @param href       the href including the pattern identifying the target
         * @param sourceEl   the element that the request originates from
         * @param formEl     [optional] form to attach to the request
         */
        loadTarget : function(method, href, sourceEl, formEl) {
            fetchHTML(method, href, sourceEl, formEl);
        },
        /**
         * @description searches for a target container within a section of the DOM where the search is constrained
         * by a parent element with class matching <prefix>-parent and the target is a descendant with a class
         * matching <prefix>-container.   The search will cache the id of the matching element for the next use
         * for faster searching, generating the id if necessary
         *
         * @param prefix
         * @param startEl       element to start searching (up) from
         * @return the matched element
         */
        findTarget : function(prefix, startEl) {
            return _findTarget(prefix, startEl);
        }
    };
}();


blueskyminds.ui.effects = {

    show: function(el) {
        YAHOO.util.Dom.setStyle(el, "display", "block");
    },

    hide: function(el) {
        YAHOO.util.Dom.setStyle(el, "display", "none");
    },

    /**
     * @description Create a backup of the children of the specified htmlelement. Creates a new hidden element at the
     * end of the body and moves the children to it
     *
     * @param id    id of the source container.  the backup container will have the id "id-backup"
     */
    backupChildren: function(id) {
        var el = document.getElementById(id);

        var container = YAHOO.util.Dom.create('div', {
            id : id + "-backup",
            style: "display:none"
        });

        document.body.appendChild(container);

        // move children from the element to the backup container
        while (el.hasChildNodes()) {
            container.appendChild(el.firstChild);
        }
    },

    /**
     * @description Restore the backup of the child nodes ot the specified htmlelement.  Creates a new hidden element
     * at the end of the body and moves the children to it
     *
     * @param id    id of the source container.  the backup container will have the id "id-backup"
     */
    restoreChildren: function(id) {
        var el = document.getElementById(id);

        blueskyminds.dom.clearHTML(el);

        var backup = document.getElementById(id + "-backup");
        if (backup) {
            // move children from the backup element to the target container
            while (backup.hasChildNodes()) {
                el.appendChild(backup.firstChild);
            }

            // remove the backup
            document.body.removeChild(backup);
        }
    }
};

/**
 * @description command-based event handling
 */
blueskyminds.ui.commands = function() {

    var Dom = YAHOO.util.Dom;
    var _commandRegistry = [];

    /**
     * @description a mapping between a bsm-help-parent and its bsm-help-container so the search only has to be performed
     * once per parent instance
     */
    //var _cachedHelpContainers = {};

    /**
     * @description Generic listener that does nothing except prevent the default event
     *
     * @param event
     */
    function preventDefault(event) {
        YAHOO.util.Event.preventDefault(event);
    }

    /**
     * @description test whether an element is an input
     *
     * @param el
     *
     * @return true if the element is an input (by tag name);
     */
    function isInput(el) {
        return el.tagName === "INPUT";
    }

    /**
     * @description test whether an element is a textarea
     *
     * @param el
     *
     * @return true if the element is a textarea(by tag name);
     */
    function isTextArea(el) {
        return el.tagName === "TEXTAREA";
    }

    /**
     * @description test whether an element is a select
     *
     * @param el
     *
     * @return true if the element is a select (by tag name);
     */
    function isSelect(el) {
        return el.tagName === "SELECT";
    }

    /**
     * @description test whether an element is a submit button
     *
     * @param el
     *
     * @return true if the element is a submit button
     */
    function isSubmit(el) {
        return el.tagName === "INPUT" && el.type.toUpperCase() === "SUBMIT";
    }

    /**
     * @description test whether an element is a button
     *
     * @param el
     * @return true if the element is an button (by tag name);
     */
    function isButton(el) {
        return el.tagName === "BUTTON";
    }

    /**
     * @description test whether an element is an anchor
     *
     * @param el
     * @return true if the element is an anchor (by tag name);
     */
    function isAnchor(el) {
        return el.tagName === "A";
    }

    /**
     * @description test whether an element is a table datasource
     *
     * @param el
     * @return true if the element is a table and has class datasource
     */
    function isTableDataSource(el) {
        return el.tagName === "TABLE" && Dom.hasClass(el, "datasource");
    }

    /**
     * @description test whether an element is a table header
     *
     * @param el
     * @return true if the element is a table header(by tag name);
     */
    function isTableHeader(el) {
        return el.tagName === "THEAD";
    }

    /**
     * @description test whether an element is a table header data
     *
     * @param el
     * @return true if the element is a table header data(by tag name);
     */
    function isTableHeaderData(el) {
        return el.tagName === "TH";
    }

    /**
     * The default form handler loads the result into a target div
     *
     * @param event
     */
    var defaultFormHandler = {
        invoke: function(event, target, form) {
            var href = form.action;
            if (href) {
                blueskyminds.ui.loader.loadTarget((form.method.toUpperCase() || 'POST'), href, target, form);
            }
        }
    };

    /**
     * Set of default command behaviours
     *
     * @param event
     */
    var defaultCommands = {
        /**
         * If the target has the back class, the browser history goes back one page
         */
        back: {
            canHandle: function(event, target) {
                return Dom.hasClass(target, "back");
            },
            invoke : function(event, target) {
                history.go(-1);
                return true; // block other commands
            }
        },
        /**
         * If the target has the close-parent class, then the ancestor element with a closeable class is hidden
         */
        closeParent: {
            canHandle: function(event, target) {
                return Dom.hasClass(target, "bsm-close-parent");
            },
            invoke : function(event, target) {
                // find the closeable ancestor and hide it
                var closeableEl = Dom.getAncestorByClassName(target, "bsm-closeable");
                if (closeableEl) {
                    blueskyminds.ui.effects.hide(closeableEl);
                }
                return true; // block other commands
            }
        },
        /**
         * If the target has the cancel class, then the ancestor element with a restorable class is restored (if
         * a backup was made)
         */
        cancel: {
            canHandle: function(event, target) {
                return Dom.hasClass(target, "cancel");
            },
            invoke : function(event, target) {
                // find the restorable ancestor and restore it from the backup
                var restorableEl = Dom.getAncestorByClassName(target, "restorable");
                if (restorableEl) {
                    blueskyminds.ui.effects.restoreChildren(restorableEl.id);
                }
                return true; // block other commands
            }
        },
        home: {
            canHandle: function(event, target) {
                return Dom.hasClass(target, "home");
            },
            invoke : function(event, target) {
                blueskyminds.ui.loader.loadTarget('GET', "/", target);
                return true; // block other commands
            }
        },
        buttonPress: {
            canHandle: function(event, target) {
                return (isSubmit(target) || isButton(target));
            },
            invoke : function(event, target) {
                var form = target.form;
                if (form) {
                    var handler = blueskyminds.ui.forms.getHandler(form, defaultFormHandler);
                    if (handler !== null) {
                        handler.invoke(event, target, form);
                    }
                }
            }
        },
        /**
         * @description when an anchor is clicked, extract the target and use the URI to determine whether
         *  we need to load a new page or make an asynchronous request
         */
        anchor: {
            canHandle: function(event, target) {
                return isAnchor(target);
            },
            invoke : function(event, target) {
                var href = target.href;
                if (href) {
                    blueskyminds.ui.loader.loadTarget('GET', href, target);
                }
            }
        },
        nestedAnchor: {
            canHandle: function(event, target) {
                var actualTarget = Dom.getAncestorBy(target, function(el) {
                    return (Dom.hasClass(el, "command") && (el.nodeName === 'A'));
                });
                return (actualTarget !== null);
            },
            invoke : function(event, target) {
                var actualTarget = Dom.getAncestorBy(target, function(el) {
                    return (Dom.hasClass(el, "command") && (el.nodeName === 'A'));
                });
                blueskyminds.ui.loader.loadTarget('GET', actualTarget.href, actualTarget);
            }
        },
        keyPress: { /* keypress inside a command form */
            canHandle: function(event, target) {
                if (event.type === "keyup") {
                    if (isInput(target) || isTextArea(target) || isSelect(target)) {
                        var actualTarget = Dom.getAncestorBy(target, function(el) {
                            return el.nodeName === 'FORM';
                        });
                        return (actualTarget !== null);
                    }
                } else {
                    return false;
                }
            },
            invoke : function(event, target) {
                var form = Dom.getAncestorBy(target, function(el) {
                    return el.nodeName === 'FORM';
                });

                if (form) {
                    var handler = blueskyminds.ui.forms.getHandler(form, defaultFormHandler);
                    if (handler !== null) {
                        handler.invoke(event, target, form);
                    }
                }
            }
        },
        help: { /* focus/blur on an item with help */
            canHandle: function(event, target) {
                if (event.type === "focus" || event.type === "blur") {
                    if (isInput(target) || isTextArea(target || isSelect(target))) {
                        var id = target.getAttribute("data-helpId");
                        if (id) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            },
            invoke : function(event, target) {
                var id = target.getAttribute("data-helpId");
                target = blueskyminds.ui.loader.findTarget("bsm-help", target);

                if (target) {
                    if (event.type === "focus") {
                        HousePad.ui.help.show(target, id);
                    } else {
                        HousePad.ui.help.hide(target, id);
                    }
                }
            }
        },
        focus: { /* focus/blur on an item in a form */
            canHandle: function(event, target) {
                if (event.type === "focus" || event.type === "blur") {
                    if (Dom.hasClass(target, "bsm-watch-focus")) {
                        var actualTarget = Dom.getAncestorBy(target, function(el) {
                            return el.nodeName === 'FORM';
                        });
                        return (actualTarget !== null);
                    }
                } else {
                    return false;
                }
            },
            invoke : function(event, target) {
                var actualTarget = Dom.getAncestorBy(target, function(el) {
                    return el.nodeName === 'FORM';
                });

                if (actualTarget) {
                    var handler = blueskyminds.ui.forms.getHandler(actualTarget, defaultFormHandler);
                    if (handler !== null) {
                        handler.invoke(event, target, actualTarget);
                    }
                }
            }
        },
        change: { /* change of a on an item in a form */
            canHandle: function(event, target) {
                if (event.type === "change") {
                    if (Dom.hasClass(target, "bsm-watch-change")) {
                        var actualTarget = Dom.getAncestorBy(target, function(el) {
                            return el.nodeName === 'FORM';
                        });
                        return (actualTarget !== null);
                    }
                } else {
                    return false;
                }
            },
            invoke : function(event, target) {
                var actualTarget = Dom.getAncestorBy(target, function(el) {
                    return el.nodeName === 'FORM';
                });

                if (actualTarget) {
                    var handler = blueskyminds.ui.forms.getHandler(actualTarget, defaultFormHandler);
                    if (handler !== null) {
                        handler.invoke(event, target, actualTarget);
                    }
                }
            }
        }
    };

    /**
     * @description Listen for an event and invoke the matching command(s) in the command registry
     *
     * @param event
     */
    function eventCommandDispatcher(event) {
        var target;
        var i;
        var command;

        if (YAHOO.env.ua.ie) {
            target = event.srcElement;
        } else {
            target = event.target;
        }

        if (target) {
            var handled = false;
            // iterate through the commands
            for (i = 0; i < _commandRegistry.length; i++) {
                command = _commandRegistry[i];
                if (command.canHandle(event, target)) {
                    if (!handled) {
                        // cancel the default event as we know we'll handle it.
                        // Only invoke the first time in case a new global event has been defined (in IE)
                        YAHOO.util.Event.preventDefault(event);
                        handled = true;
                    }
                    if (command.invoke(event, target)) {
                        break;
                    }
                }
            }
        }
    }

    function alwaysTrue(el) {
        return true;
    }

    /**
     * Search for and enable Commands in the specified container
     *
     * Uses event bubbling to listen for the click event on the contained anchors, forms and buttons
     * Prevents the default events where possible
     **/
    function _initCommands(containerId) {
        var Dom = YAHOO.util.Dom,
                Event = YAHOO.util.Event;
        var i, j;

        var commandContainers = Dom.getElementsByClassName("commands", "div", containerId);
        for (i = 0; i < commandContainers.length; i++) {
            // bubbling to catch all click events
            Event.addListener(commandContainers[i], 'click', eventCommandDispatcher);

            // remove the default click listener from anchors
            /*var anchors = Dom.getElementsByClassName("command", "a", commandContainers[i]);
             for (j = 0; j < anchors.length; j++) {
             // remove all the default listeners and REALLY prevent the default click operation
             Event.removeListener(anchors[j], 'click');
             if (!YAHOO.env.ua.ie) {
             // prevent this event for non-IE browser as it's captured at the div
             Event.addListener(anchors[j], 'click', preventDefault);
             } else {
             // but on IE we need to capture it as it bubbling up
             Event.addListener(anchors[j], 'click', commandClickListener);
             }
             }*/

            // enable keypress listeners
            var textInputs = Dom.getElementsByClassName("bsm-watch-keypress", "input", commandContainers[i]);
            for (j = 0; j < textInputs.length; j++) {
                Event.addListener(textInputs[j], 'keyup', eventCommandDispatcher);
            }
            var textAreas = Dom.getElementsByClassName("bsm-watch-keypress", "textarea", commandContainers[i]);
            for (j = 0; j < textAreas.length; j++) {
                Event.addListener(textAreas[j], 'keyup', eventCommandDispatcher);
            }

            // enable focus/blur listeners
            textInputs = Dom.getElementsByClassName("bsm-watch-focus", "input", commandContainers[i]);
            for (j = 0; j < textInputs.length; j++) {
                Event.addListener(textInputs[j], 'focus', eventCommandDispatcher);
                Event.addListener(textInputs[j], 'blur', eventCommandDispatcher);
            }
            textAreas = Dom.getElementsByClassName("bsm-watch-focus", "textarea", commandContainers[i]);
            for (j = 0; j < textAreas.length; j++) {
                Event.addListener(textAreas[j], 'focus', eventCommandDispatcher);
                Event.addListener(textAreas[j], 'blur', eventCommandDispatcher);
            }

            // enable change listeners
            var selects = Dom.getElementsByClassName("bsm-watch-change", "select", commandContainers[i]);
            for (j = 0; j < selects.length; j++) {
                Event.addListener(selects[j], 'change', eventCommandDispatcher);
                // we need to invoke the listener for the initial value.
                // todo: This should probably be delayed, and the event simulation is crappy
                eventCommandDispatcher({type:"change",target:selects[j],srcElement:selects[j]});
            }

            // enable drag-and-drop
            //            var draggables = Dom.getElementsByClassName("draggable", "div", commandContainers[i]);
            //            for (j = 0; j < draggables.length; j++) {
            //                new YAHOO.util.DDProxy(draggables[j]);
            //            }

            // block submit events for forms
            var forms = Dom.getElementsBy(alwaysTrue, "form", commandContainers[i]);
            for (j = 0; j < forms.length; j++) {
                Event.addListener(forms[j], 'submit', preventDefault);
            }
        }
    }

    /**
     * @description registers the default command implementations
     */
    function _initDefaultCommands() {
        for (var key in defaultCommands) {
            if (typeof defaultCommands[key] !== 'function') {
                _commandRegistry[_commandRegistry.length] = defaultCommands[key];
            }
        }
    }

    _initDefaultCommands();

    return {
        /**
         * @description walk through the decedents of the specified element searching for nodes with
         * Command directives.  Register the listeners to invoke the corresponding Command
         *
         * @param containerId
         */
        init : function(containerId) {
            _initCommands(containerId);
        },
        registerCommand : function(command) {
            // todo: assert that the interface is correct
            // insert at the start of the array so it takes precedence
            _commandRegistry.unshift(command);
            // push onto end of the array
            //_commandRegistry[_commandRegistry.length] = command;
        },
        getCommandClickListener: function() {
            return eventCommandDispatcher;
        },
        /** @description get the default form handler */
        defaultFormHandler :  defaultFormHandler,
        /** onclick handler for region refs */
        viewRegion : function(el) {
            eventCommandDispatcher({type:"click", target:el, srcElement:el}); // emulate the event
            return false;
        }
    };
}();
/*global YAHOO,blueskyminds,document*/
(function() {
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var COOKIE_NAME = "voted";
    var SIGNATURE = "sbwm";
    var ALL_COUNTRIES = "all";
    var countryNames;

    /**
     * @description count of the number of results currently rendered, used for layout
     */
    var resultCount = 0;

    /** @description Render a single vertical var with one section empty and one section filled using the ratio provided */
    var renderBar = function(barEl, ratio) {
        var MAX_EMs = 10;

        var filledHeight = (MAX_EMs * ratio);
        var emptyHeight = (MAX_EMs - filledHeight);

        var percent = ("" + Math.round(ratio * 100)).substr(0, 4) + "%";

        var emptyBarEl = Dom.getElementsByClassName("empty", "div", barEl)[0];
        var filledBarEl = Dom.getElementsByClassName("filled", "div", barEl)[0];

        if (ratio > 0) {
            Dom.setStyle(emptyBarEl, "height", emptyHeight + "em");
            Dom.setStyle(filledBarEl, "height", filledHeight + "em");
            Dom.setStyle(filledBarEl, "display", "block");
        } else {
            Dom.setStyle(emptyBarEl, "height", MAX_EMs + "em");
            Dom.setStyle(filledBarEl, "display", "none");
        }

        if (filledHeight > 1) {
            blueskyminds.dom.clearHTML(emptyBarEl);
            blueskyminds.dom.insertHTML(filledBarEl, percent);
        } else {
            blueskyminds.dom.clearHTML(filledBarEl);
            blueskyminds.dom.insertHTML(emptyBarEl, percent);
        }
    };

    /** Initialise the list of countries */
    var initCountryNames = function() {
        var countryLookup = Dom.get("country");
        var option;
        countryNames = {};
        if (countryLookup) {
            for (var i = 0; i < countryLookup.options.length; i++) {
                option = countryLookup.options[i];
                if (option.value) {
                    countryNames[option.value] = option.text;
                }
            }
        }
    };

    /**
     * Lookup the country names from the options
     */
    var lookupCountryName = function(country) {
        var result;
        if (!countryNames) {
            initCountryNames();
        }

        try {
            result = countryNames[country];
            if (!result) {
                result = "???";
            }
        } catch (e) {
            result = "???";
        }
        return result;
    };


    /**
     * @description prepares the result element.  If the element already exists for the country it's resused
     * Increments the resultCount if appropriate
     */
    var prepareElement = function(voteResult) {
        var id = voteResult.country + "_";
        // check if the result already exists
        var resultEl = Dom.get(id);
        var newResultEl;
        if (resultEl) {
            // purge the old one and reuse it
            newResultEl = resultEl;
            if (Dom.getStyle(newResultEl, "display") === "none") {
                // recount the result for layout
                resultCount += 1;
            }
            // hide it for now: we don't want to count it in the layout
            Dom.setStyle(newResultEl, "display", "none");
        } else {
            var templateEl = Dom.get("resultTemplate");
            if (templateEl) {
                newResultEl = templateEl.cloneNode(true);

                // count the additional result for layout
                resultCount += 1;
            }
        }

        if (newResultEl) {
            newResultEl.setAttribute("id", id);
        }

        return newResultEl;
    };

    /**
     * @description render the result on the current page
     */
    var renderResult = function(voteResult, newResultEl) {

        var resultsEl = Dom.get("results");
        if (resultsEl) {
            var totalVotes = voteResult.democratic + voteResult.republican;
            var d;
            var r;
            if (totalVotes > 0) {
                d = Math.round(voteResult.democratic / totalVotes * 100) / 100;
                r = Math.round((1 - d) * 100) / 100;
            } else {
                d = 0;
                r = 0;
            }

            var democraticBar = Dom.getElementsByClassName("democraticBar", "div", newResultEl)[0];
            renderBar(democraticBar, d);

            var republicanBar = Dom.getElementsByClassName("republicanBar", "div", newResultEl)[0];
            renderBar(republicanBar, r);

            var countryName = lookupCountryName(voteResult.country);

            var title = Dom.getElementsByClassName("country", "h2", newResultEl)[0];
            blueskyminds.dom.insertHTML(title, countryName);
            var voteCount = Dom.getElementsByClassName("voteCount", "h3", newResultEl)[0];
            blueskyminds.dom.insertHTML(voteCount, "(" + totalVotes + " votes)");

            // insert/move into the last row
            var lastRowEl = Dom.getElementsByClassName("last-row", "div", resultsEl)[0];
            lastRowEl.appendChild(newResultEl);
            Dom.setStyle(newResultEl, "display", "block");
            resultCount += 1;
        }
    };

    /**
     * @description center aligns the results within the viewport
     */
    var layoutViewport = function() {
        var resultsEl = Dom.get("results");
        if (resultsEl) {
            var RESULT_WIDTH;
            if (YAHOO.env.ua.ie) {
                RESULT_WIDTH = 12 * 13.3333;  // 10 + 2 padding em's
            } else {
                RESULT_WIDTH = 12 * 13;  // 10 + 2 padding em's
            }
            var viewPortWidth = Dom.getViewportWidth();

            var maxResultsPerLine = (Math.floor(viewPortWidth / RESULT_WIDTH) - 1) || 1;
            var resultsRequired = (resultCount || 1);
            var resultsIncluded = 0;
            var rows = [];
            var resultsThisLine;
            var rowNo = 0;
            // calculate how many results need to be included on each line until all results
            // are accounted for
            do {
                resultsThisLine = Math.min(maxResultsPerLine, resultsRequired - resultsIncluded);
                if (resultsThisLine > 0) {
                    rows[rowNo] = resultsThisLine;
                    resultsIncluded += resultsThisLine;
                }
                rowNo += 1;
            } while (resultsIncluded < resultsRequired);


            resultCount = 0;
            // create/delete rows and move results up to the previous row if necessaru

            var rowElements = Dom.getElementsByClassName("row", "div", resultsEl);
            var resultElements;
            var gap = 0;
            for (rowNo = 0; rowNo < rowElements.length; rowNo++) {
                var visibleResults = [];
                resultElements = Dom.getElementsByClassName("result", "div", rowElements[rowNo], function(el) {
                    if (Dom.getStyle(el, "display") !== "none") {
                        visibleResults.push(el);
                    }
                });

                resultCount += visibleResults.length;

                if (gap > 0) {
                    // move results to the previous row
                    var resultNo;
                    for (resultNo = 0; resultNo < gap; resultNo++) {
                        rowElements[rowNo - 1].appendChild(resultElements[resultNo]);
                    }
                } else {
                    if (visibleResults.length < rows[rowNo]) {
                        gap = rows[rowNo] - visibleResults.length;
                    }
                }
            }

            if (rowElements.length > rows.length) {
                // purge the unnecessary row elements
                for (rowNo = rows.length; rowNo < rowElements.length; rowNo++) {
                    Event.purgeElement(rowElements[rowNo]);
                    resultsEl.removeChild(rowElements[rowNo]);
                }
            } else {
                // create new row elements
                if (rowElements.length < rows.length) {
                    for (rowNo = rowElements.length; rowNo < rows.length; rowNo++) {
                        var newRowEl = document.createElement("div");
                        newRowEl.setAttribute("id", "row" + rowNo);
                        newRowEl.setAttribute("class", "row");
                        resultsEl.appendChild(newRowEl);
                    }
                }
            }

            // set the left padding of each row to center it
            for (rowNo = 0; rowNo < rows.length; rowNo++) {
                var rowEl = Dom.get("row" + rowNo);
                Dom.setStyle(rowEl, "margin-left", Math.floor((viewPortWidth / 2 ) - (rows[rowNo] * RESULT_WIDTH / 2)) + "px");
                if (rowNo === rows.length - 1) {
                    Dom.addClass(rowEl, "last-row");
                } else {
                    Dom.removeClass(rowEl, "last-row");
                }
            }
        }
    };

    var resultCallback = {
        success: function(o) {
            var voteResult;
            try {
                voteResult = YAHOO.lang.JSON.parse(o.responseText);
            } catch(e1) {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e1.message);
            }
            try {
                if (YAHOO.lang.isObject(voteResult)) {
                    // todo: confirm that it matches the expected interface
                    var resultEl = prepareElement(voteResult);
                    layoutViewport();
                    renderResult(voteResult, resultEl);
                } else {
                    blueskyminds.events.fire("error", "The response from the server was invalid.");
                }
            } catch(e2) {
                blueskyminds.events.fire("error", "A client-side exception occured while updating the page. Message: " + e2.message);
            }
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        },
        cache: false
    };

    var loadResults = function(country) {
        if (country) {
            YAHOO.util.Connect.asyncRequest('GET', "poll/result/" + country + ".json", resultCallback);
        } else {
            YAHOO.util.Connect.asyncRequest('GET', "poll/result.json", resultCallback);
        }
    };

    var resultFormHandler = {
        invoke : function(event, target, formEl) {
            var country = formEl.country;
            if (YAHOO.lang.isValue(country.value)) {
                loadResults(country.value);
            }
        }
    };

    function showVoteForm() {
        Dom.setStyle("voteTemplate", "display", "block");
    }

    function hideVoteForm() {
        Dom.setStyle("voteTemplate", "display", "none");
    }

    var voteCallback = {
        /**
         * this is the country code
         * @param o
         */
        success: function(o) {
            YAHOO.util.Cookie.set(COOKIE_NAME, true, {expires: blueskyminds.calendar.inOneYear()});
            hideVoteForm();
            Dom.get("voteSubmit").disabled = false;
            if (this !== ALL_COUNTRIES) {
                loadResults(ALL_COUNTRIES);
            }
            loadResults(this);
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        }
    };

    var voteFormHandler = {
        invoke : function(event, target, formEl) {
            var Connect = YAHOO.util.Connect;
            Connect.resetFormState();
            formEl.action = "poll/vote";
            Connect.setForm(formEl);
            // setup a header for future http requests that includes the token
            Connect.initHeader("X-AuthToken", SIGNATURE, true);
            Connect.asyncRequest('POST', "poll/vote", {
                success: voteCallback.success,
                failure: voteCallback.failure,
                scope: formEl.country.value
            });
            return true;
        }
    };

    var voteFormListener = function(e) {
        var voted = YAHOO.util.Cookie.get(COOKIE_NAME);
        if (!voted) {
            var firstVoteEl = Dom.get("firstVote");
            var partyEl = Dom.get("party");
            var voteCountryEl = Dom.get("voteCountry");
            if (firstVoteEl.checked) {
                if (partyEl.selectedIndex > 0) {
                    if (voteCountryEl.selectedIndex > 0) {
                        Dom.get("voteSubmit").disabled = false;
                        return;
                    }
                }
            }
        }
        Dom.get("voteSubmit").disabled = true;
    };

    /**
     * @description replaces the default close-parent command with one the updates the resultCount
     */
    var closeResultCommand = {
        canHandle: function(event, target) {
            return Dom.hasClass(target, "close-result");
        },
        invoke : function(event, target) {
            // find the closeable ancestor and hide it
            var closeableEl = Dom.getAncestorByClassName(target, "bsm-closeable");
            if (closeableEl) {
                blueskyminds.ui.effects.hide(closeableEl);
                resultCount--;
                layoutViewport();
            }
            return true; // block other commands
        }
    };

    var onResizeListener = function(e) {
        layoutViewport();
    };

    var setupListeners = function() {
        blueskyminds.ui.forms.registerHandlerForForm("resultForm", resultFormHandler);
        Event.addListener("firstVote", "change", voteFormListener);
        Event.addListener("party", "change", voteFormListener);
        Event.addListener("voteCountry", "change", voteFormListener);
        blueskyminds.ui.forms.registerHandlerForForm("voteForm", voteFormHandler);
        blueskyminds.ui.commands.registerCommand(closeResultCommand);
        blueskyminds.ui.commands.init("bd");
        blueskyminds.ui.commands.init("ft");
        Event.addListener(window, 'resize', onResizeListener);
    };

    /**
     * @description initialise the list of countries available in the vote form. It's loaded from the list
     * of companies in the result form.
     */
    var initCountryList = function() {
        initCountryNames();
        var countryEl = Dom.get("voteCountry");

        if (countryEl) {
            var optionEl = document.createElement("option");
            optionEl.value = "";
            optionEl.text = "...";
            if (YAHOO.env.ua.ie) {
                countryEl.add(optionEl);
            } else {
                countryEl.add(optionEl, null);
            }
            var country;
            for (country in countryNames) {
                if (typeof countryNames[country] !== 'function') {
                    if (country !== ALL_COUNTRIES) {
                        optionEl = document.createElement("option");
                        optionEl.value = country;
                        optionEl.text = countryNames[country];

                        if (YAHOO.env.ua.ie) {
                            countryEl.add(optionEl);
                        } else {
                            countryEl.add(optionEl, null);
                        }
                    }
                }
            }
        }
    };

    var checkCookies = function() {
        var voted = YAHOO.util.Cookie.get(COOKIE_NAME);
        if (!voted) {
            // the marker node tells us we're on the home page
            if (Dom.get("marker")) {
                showVoteForm();
            }
        }
    };

    /**
     * @description Initialise the listeners on the forms and load initial results
     */
    var init = function() {
        var _errorController = new blueskyminds.ui.ErrorController("errors", "error");
        try {
            setupListeners();
            initCountryList();
            loadResults(ALL_COUNTRIES);
            checkCookies();
            layoutViewport();
        } catch (e) {
            blueskyminds.events.fire("error", "A client-side exception occurred during init. Message:" + e.message);
        }
    };

    YAHOO.util.Event.onDOMReady(init);
})();