'use strict';

const { EventEmitter } = require('events');

/**
 * The AlertEvents class.
 */
class AlertEvents {
  /**
   * The name of the event.
   *
   * @typedef {string}
   * @private
   */
  event_name = 'ALERT';

  /**
   * The node EventEmitter object.
   *
   * @typedef {Object} EventEmitter
   * @private
   */
  eventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Emit a new alert event with a given message.
   *
   * @param {string} message
   *  The message of the alert to be sent.
   */
  emitAlert(message) {
    this.eventEmitter.emit(this.event_name, message);
  }

  //

  /**
   * Provide a handler to react to alert events.
   *
   * @param {CallableFunction} handler
   *  Function to be called when alert is emitted.
   *  The alert event contains message text pertaining to the event.
   */
  onAlert(handler) {
    this.eventEmitter.on(this.event_name, handler);
  }
}

module.exports = new AlertEvents();
