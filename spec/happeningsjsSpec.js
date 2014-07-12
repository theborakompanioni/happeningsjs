/*global Happenings,describe,it,expect,beforeEach,afterEach,jasmine*/
describe('Happeningsjs', function() {
  'use strict';

  var noop = function() {};

  /*var simulateClick = function (id) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
          false, false, false, false, 0, null);

      var cb = document.getElementById(id);
      cb.dispatchEvent(evt);
  };*/

  var update = noop;
  var update2 = noop;
  var update3 = noop;

  var ie = null;

  beforeEach(function() {
      update = jasmine.createSpy('update');
      update2 = jasmine.createSpy('update2');
      update3 = jasmine.createSpy('update3');

      //jasmine.clock().install();

      //jasmine.clock().mockDate();

      ie = {
        attachEvent : function() {
          window.addEventListener.apply(window, arguments);
        },
        detachEvent : function() {
          window.removeEventListener.apply(window, arguments);
        }
      };
  });

  afterEach(function() {
      //jasmine.clock().uninstall();

    // flush event cache after each test
    var unloadEvent = Happenings.createEvent('unload');
    Happenings.dispatchEvent(window, unloadEvent);
  });

  it('should get the version of Happeningsjs', function () {
    expect(Happenings.version).toBe('0.0.1');
  });

  it('should add and remove an event listener', function () {

    var listenerId = Happenings.addEvent(window, 'click', noop);

    var item = Happenings.removeEvent(listenerId);

    expect(listenerId).toBe(1); // event 0 is the 'unload' cleanup handler

    expect(item).toBeDefined();
  });

  it('should return undefined for non-existing listeners', function () {
    var item = Happenings.removeEvent(-1);
    expect(item).not.toBeDefined();
  });

  it('should return null for removed listeners', function () {
    var listenerId = Happenings.addEvent(window, 'click', noop);

    expect(listenerId).toBe(2);

    var item = Happenings.removeEvent(listenerId);

    expect(item).toBeDefined();

    item = Happenings.removeEvent(listenerId);

    expect(item).toBe(null);
  });

  it('should add and remove an event listener (with attachEvent)', function () {

    var loadedListenerId = Happenings.addEvent(ie, 'DOMContentLoaded', noop);
    var clickListenerId = Happenings.addEvent(ie, 'click', noop);

    expect(loadedListenerId).toBe(3);
    expect(clickListenerId).toBe(4);

    var loadedListener = Happenings.removeEvent(loadedListenerId);
    var clickListener = Happenings.removeEvent(clickListenerId);

    expect(loadedListener).toBeDefined();
    expect(clickListener).toBeDefined();

  });

  it('should add and trigger DOMContentLoaded', function () {

    var loadedListenerId = Happenings.addEvent(window, 'DOMContentLoaded', update);

    expect(loadedListenerId).toBe(5);

    var readystatechangeEvent = Happenings.createEvent('DOMContentLoaded');
    Happenings.dispatchEvent(window, readystatechangeEvent);

    expect(update.calls.count()).toEqual(1);

    var loadedListener = Happenings.removeEvent(loadedListenerId);

    expect(loadedListener).toBeDefined();

  });

  it('should attach an event to an incompatible object', function () {

    var listenerId = Happenings.addEvent({}, 'click', noop);
    var item = Happenings.removeEvent(listenerId);

    expect(listenerId).toBe(-1);

    expect(item).not.toBeDefined();

  });
});