export default class Clock {

    constructor() {
        this.elapsedMiliseconds = 0;
        this.millisecondsIntervalId = null;
    }

    startMillisecondsClock() {
        this.log('Start milliseconds clock');
        this.millisecondsIntervalId = setInterval(() => this.millisecondsClockTick(), 1);
    }

    millisecondsClockTick() {
        this.elapsedMiliseconds++;
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