/* eslint-disable */
import {
    isFunction,
    isArray,
    isNumber,
    bind,
    assign
} from 'min-dash';

var FN_REF = '__fn';

var DEFAULT_PRIORITY = 1000;

var slice = Array.prototype.slice;

export default function EventBusMock() {
    this._listeners = {};

    this.on('diagram.destroy', 1, this._destroy, this);
}

EventBusMock.prototype.on = function (events, priority, callback, that) {

    events = isArray(events) ? events : [events];

    if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY;
    }

    if (!isNumber(priority)) {
        throw new Error('priority must be a number');
    }

    var actualCallback = callback;

    if (that) {
        actualCallback = bind(callback, that);

        // make sure we remember and are able to remove
        // bound callbacks via {@link #off} using the original
        // callback
        actualCallback[FN_REF] = callback[FN_REF] || callback;
    }

    var self = this;

    events.forEach(function (e) {
        self._addListener(e, {
            priority: priority,
            callback: actualCallback,
            next: null
        });
    });
};


EventBusMock.prototype.once = function (event, priority, callback, that) {
    var self = this;

    if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY;
    }

    if (!isNumber(priority)) {
        throw new Error('priority must be a number');
    }

    function wrappedCallback() {
        var result = callback.apply(that, arguments);

        self.off(event, wrappedCallback);

        return result;
    }

    wrappedCallback[FN_REF] = callback;

    this.on(event, priority, wrappedCallback);
};


EventBusMock.prototype.off = function (events, callback) {

    events = isArray(events) ? events : [events];

    var self = this;

    events.forEach(function (event) {
        self._removeListener(event, callback);
    });

};


EventBusMock.prototype.createEvent = function (data) {
    var event = new InternalEvent();

    event.init(data);

    return event;
};


EventBusMock.prototype.fire = function (type, data) {

    var event,
        firstListener,
        returnValue,
        args;

    args = slice.call(arguments);

    if (typeof type === 'object') {
        data = type;
        type = data.type;
    }

    if (!type) {
        throw new Error('no event type specified');
    }

    firstListener = this._listeners[type];

    if (!firstListener) {
        return;
    }

    // we make sure we fire instances of our home made
    // events here. We wrap them only once, though
    if (data instanceof InternalEvent) {

        // we are fine, we already have an event
        event = data;
    } else {
        event = this.createEvent(data);
    }

    // ensure we pass the event as the first parameter
    args[0] = event;

    // original event type (in case we delegate)
    var originalType = event.type;

    // update event type before delegation
    if (type !== originalType) {
        event.type = type;
    }

    try {
        returnValue = this._invokeListeners(event, args, firstListener);
    } finally {

        // reset event type after delegation
        if (type !== originalType) {
            event.type = originalType;
        }
    }

    // set the return value to false if the event default
    // got prevented and no other return value exists
    if (returnValue === undefined && event.defaultPrevented) {
        returnValue = false;
    }

    return returnValue;
};


EventBusMock.prototype.handleError = function (error) {
    return this.fire('error', { error: error }) === false;
};


EventBusMock.prototype._destroy = function () {
    this._listeners = {};
};

EventBusMock.prototype._invokeListeners = function (event, args, listener) {

    var returnValue;

    while (listener) {

        // handle stopped propagation
        if (event.cancelBubble) {
            break;
        }

        returnValue = this._invokeListener(event, args, listener);

        listener = listener.next;
    }

    return returnValue;
};

EventBusMock.prototype._invokeListener = function (event, args, listener) {

    var returnValue;

    try {

        // returning false prevents the default action
        returnValue = invokeFunction(listener.callback, args);

        // stop propagation on return value
        if (returnValue !== undefined) {
            event.returnValue = returnValue;
            event.stopPropagation();
        }

        // prevent default on return false
        if (returnValue === false) {
            event.preventDefault();
        }
    } catch (e) {
        if (!this.handleError(e)) {
            console.error('unhandled error in event listener');
            console.error(e.stack);

            throw e;
        }
    }

    return returnValue;
};

EventBusMock.prototype._addListener = function (event, newListener) {

    var listener = this._getListeners(event),
        previousListener;

    // no prior listeners
    if (!listener) {
        this._setListeners(event, newListener);

        return;
    }

    // ensure we order listeners by priority from
    // 0 (high) to n > 0 (low)
    while (listener) {

        if (listener.priority < newListener.priority) {

            newListener.next = listener;

            if (previousListener) {
                previousListener.next = newListener;
            } else {
                this._setListeners(event, newListener);
            }

            return;
        }

        previousListener = listener;
        listener = listener.next;
    }

    // add new listener to back
    previousListener.next = newListener;
};


EventBusMock.prototype._getListeners = function (name) {
    return this._listeners[name];
};

EventBusMock.prototype._setListeners = function (name, listener) {
    this._listeners[name] = listener;
};

EventBusMock.prototype._removeListener = function (event, callback) {

    var listener = this._getListeners(event),
        nextListener,
        previousListener,
        listenerCallback;

    if (!callback) {

        // clear listeners
        this._setListeners(event, null);

        return;
    }

    while (listener) {

        nextListener = listener.next;

        listenerCallback = listener.callback;

        if (listenerCallback === callback || listenerCallback[FN_REF] === callback) {
            if (previousListener) {
                previousListener.next = nextListener;
            } else {

                // new first listener
                this._setListeners(event, nextListener);
            }
        }

        previousListener = listener;
        listener = nextListener;
    }
};

/**
 * A event that is emitted via the event bus.
 */
function InternalEvent() { }

InternalEvent.prototype.stopPropagation = function () {
    this.cancelBubble = true;
};

InternalEvent.prototype.preventDefault = function () {
    this.defaultPrevented = true;
};

InternalEvent.prototype.init = function (data) {
    assign(this, data || {});
};

function invokeFunction(fn, args) {
    return fn.apply(null, args);
}
