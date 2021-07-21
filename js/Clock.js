export default class Clock {

    constructor() {
        this.elapsedMiliseconds = 0;
        this.millisecondsIntervalId = null;
        this.millisecondsHandlers = [];
        this.millisecondsIntervalTimeout = 10;
    }

    startMillisecondsClock() {
        this.log('Start milliseconds clock');
        this.millisecondsIntervalId = setInterval(() => this.millisecondsClockTick(), this.millisecondsIntervalTimeout);
    }

    onMilliseconds(milliseconds, callback) {
        this.log(`Added ${milliseconds} milliseconds handler`);
        return this.millisecondsHandlers.push({
            milliseconds,
            callback,
        }) - 1;
    }

    removeMillisecondsHandler(id) {
        this.log(`Removed ${id} milliseconds handler`);
        this.millisecondsHandlers.splice(id, 1);
    }

    millisecondsClockTick() {
        for (const {milliseconds, callback} of this.millisecondsHandlers) {
            if (this.elapsedMiliseconds === 0 || milliseconds === 0) {
                continue;
            }
            if (this.elapsedMiliseconds % milliseconds === 0) {
                this.log(`Callback at ${milliseconds}ms, elapsed: ${this.elapsedMiliseconds}ms`);
                callback();
            }
        }
        this.elapsedMiliseconds += this.millisecondsIntervalTimeout;
    }

    stopMillisecondsClock() {
        this.log('Stop milliseconds clock');
        this.millisecondsIntervalId && clearInterval(this.millisecondsIntervalId);
    }

    log(...args) {
        console.log(`%c[Clock]`, 'color: black; background-color: green');
        args.forEach((arg) => console.log(arg));
    }

}