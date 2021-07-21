import PadControl from './PadControl.js';

export default class PadMachine {
    constructor() {
        this.padControl = new PadControl();
        this.padControl.setPadMachine(this);
        this.matrix = [];
        this.domElement = null;
        this.baseElements = this.getBaseElements();
    }

    getBaseElements() {
        return {
            padMachineId: 'pad-machine',
            basePadContainerClass: 'pad-row',
            basePadClass: 'pad',
            activeClass: 'pad-active'
        };
    }

    setGrid(rows, padPerRow) {
        this.log('Grid set');
        this.matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < padPerRow; j++) {
                row.push(this.generateNewPad(i, j));
            }
            this.matrix.push(row);
        }
    }

    randomColor() {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateNewPad(i, j) {
        this.log('New pad generated');
        return {
            color: this.randomColor(),
            sound: this.padControl.getSoundByPadPosition(i, j),
        };
    }

    queryDomElement() {
        this.log('Dom element queried');
        this.domElement = document.getElementById(this.baseElements.padMachineId);
    }

    generatePadRowElement(content) {
        return `<div class="${this.baseElements.basePadContainerClass}">${content}</div>`;
    }

    generatePadElement(pad, i, j) {
        return `
            <div 
                class="${this.baseElements.basePadClass}" 
                style="background-color: ${pad.color};"
                data-row="${i}"
                data-col="${j}"
            ></div>
        `;
    }

    render() {
        if (!this.domElement) {
            this.queryDomElement();
        }
        this.log('Render');
        let html = '', i = 0;
        for (const row of this.matrix) {
            let rowHtml = '', j = 0;
            for (const pad of row) {
                rowHtml += this.generatePadElement(pad, i, j);
                j++;
            }
            html += this.generatePadRowElement(rowHtml);
            i++;
        }
        this.domElement.innerHTML = html;
        this.watchPadElements();
    }

    watchPadElements() {
        this.log('Watch pad elements');
        const domPadElements = document.getElementsByClassName(this.baseElements.basePadClass);
        for (const domPadElement of domPadElements) {
            const row = parseInt(domPadElement.getAttribute('data-row'));
            const col = parseInt(domPadElement.getAttribute('data-col'));
            domPadElement.addEventListener('click', () => this.onPadClick(row, col, domPadElement));
        }
    }

    onPadClick(row, col, padElement) {
        this.log('Pad clicked');
        this.touchPad(row, col, () => {
            this.log('Play pad sound');
        }, padElement);
    }

    touchPad(i, j, playSoundCallback, padDomElement) {
        this.matrix[i][j].sound.cloneNode().play().then(playSoundCallback);
        padDomElement.classList.add(this.baseElements.activeClass);
        setTimeout(() => {
            padDomElement.classList.remove(this.baseElements.activeClass);
        }, 200);
    }

    log(...args) {
        console.log(`%c[PadMachine]`, 'color: black; background-color: deeppink');
        args.forEach((arg) => console.log(arg));
    }
}