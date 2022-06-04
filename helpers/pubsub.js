const events = require('events');
const eventsEmitter = new events.EventEmitter();


class PubSub {
    constructor(event_name) {
        this.eventName = event_name;
    }

    sub(res) {
        eventsEmitter.on(this.eventName, (msg) => {
            if (! res.headersSent) {
                return res.status(200).json({'success':true,'msg':'greeting: ' + msg}).end();
            }
        });
    }
    pub(res) {
        let message = 'yo';
        eventsEmitter.emit(this.eventName, message);
        return res.status(200).json({'success':true,'msg':'request sent: '});
    }
}


module.exports = PubSub;