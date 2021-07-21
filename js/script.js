import PadMachine from './PadMachine.js';

const padMachine = new PadMachine();

const init = () => {
    padMachine.padControl.queryDomElements();
    padMachine.padControl.watchControlsChange();
};

window.addEventListener('load', init);