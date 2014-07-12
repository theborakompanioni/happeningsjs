/**
 * @license
 * Happeningsjs <http://example.com/>
 * Copyright 2014 tbk <theborakompanioni+git@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/*--------------------------------------------------------------------------*/
// http://dustindiaz.com/rock-solid-addevent
// http://ejohn.org/projects/flexible-javascript-events/
 ;(function(window, document) {
    'use strict';
    var Cache = (function () {
        var events = [];

        var _push = function(/*node, sEventName, fHandler*/) {
            events.push(arguments);
            return events.length - 1;
        };

        return {
            add: function(obj, type, fn, capture) {
                if (obj.addEventListener) {
                    obj.addEventListener(type, fn, !!capture);
                    return _push(obj, type, fn, !!capture);
                } else if (obj.attachEvent) {
                    var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
                    obj.attachEvent('on' + t, function () {
                        fn.call(obj, window.event);
                    });
                    return _push(obj, t, fn);
                }
                return -1;
            },
            remove: function(i) {
                var item = events[i];
                if(!!item && !!item[0] && !!item[1] && !!item[2]) {
                    if (item[0].removeEventListener) {
                        item[0].removeEventListener(item[1], item[2], item[3]);
                    } else if (item[0].detachEvent) {
                        item[0].detachEvent('on' + item[1], item[2]);
                    }
                    events[i] = null;
                }
                return item;
            },
            _removeAll: function() {
                for (var i = events.length - 1; i >= 0; i--) {
                    this.remove(i);
                }
            }
        };
    })();

    var createEvent = function(eventName) {
        var event;

        if (document.createEvent) {
          event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, true);
        } else {
          event = document.createEventObject();
          event.eventType = eventName;
        }

        event.eventName = eventName;

        return event;
    };


    var dispatchEvent = function(element, event) {
        if (document.createEvent) {
          return element.dispatchEvent(event);
        } else {
          return element.fireEvent('on' + event.eventType, event);
        }
    };

    // flush all remaining events
    Cache.add(window, 'unload', function() {
        Cache._removeAll();
    });

    window.Happenings = {
        version: '0.0.1',
        addEvent: Cache.add,
        removeEvent: Cache.remove,
        createEvent: createEvent,
        dispatchEvent: dispatchEvent
    };

}(window, window.document));