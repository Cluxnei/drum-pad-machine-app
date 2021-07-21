export default class PadControl {
    constructor() {
        this.domElements = this.getDomElements();
        this.padMachine = null;
        this.gridControl = null;
        this.gridControlSounds = null;
        this.gridSoundsMatrix = [];
    }

    getDomElements() {
        return {
            gridControlId: 'grid-control',
            gridControlSoundsId: 'grid-control-sounds',
            baseGridControlSoundContainerClass: 'pad-row',
            baseGridControlSoundClass: 'pad-control',
            baseGridControlSoundSelectClass: 'pad-control-select',
            baseGridControlSoundShortCodeInputClass: 'pad-control-shortcode-input',
        };
    }

    queryDomElements() {
        this.gridControl = document.getElementById(this.domElements.gridControlId);
        this.gridControlSounds = document.getElementById(this.domElements.gridControlSoundsId);
        this.log('Control elements queried');
    }

    watchControlsChange(only = '') {
        if (only === '' || only === 'grid-control') {
            this.gridControl.addEventListener('change', () => this.onGridControlChange());
            this.gridControl.dispatchEvent(new Event('change'));
        }
        if (only === '' || only === 'grid-sounds') {
            const gridSoundsSelect = document.getElementsByClassName(this.domElements.baseGridControlSoundSelectClass);
            for (const gridSoundSelect of gridSoundsSelect) {
                const row = parseInt(gridSoundSelect.parentElement.getAttribute('data-row'));
                const col = parseInt(gridSoundSelect.parentElement.getAttribute('data-col'));
                gridSoundSelect.addEventListener('change', () => {
                    this.onGridControlSoundSelectChange(row, col, gridSoundSelect);
                });
            }
            const gridSoundsShortcodesInputs = document.getElementsByClassName(this.domElements.baseGridControlSoundShortCodeInputClass);
            for (const shortcodeInput of gridSoundsShortcodesInputs) {
                const row = parseInt(shortcodeInput.parentElement.getAttribute('data-row'));
                const col = parseInt(shortcodeInput.parentElement.getAttribute('data-col'));
                shortcodeInput.addEventListener('change', () => {
                    this.onGridControlSoundShortcodeInputChange(row, col, shortcodeInput);
                });
            }
        }
        if (only === '' || only === 'bind-shortcodes') {
            window.addEventListener('keydown', (event) => {
                this.bindKeyShortCode(event.key);
            });
        }
        this.log('Watching controls');
    }

    bindKeyShortCode(key) {
        if (!key) {
            return;
        }
        let i = 0;
        for (const row of this.gridSoundsMatrix) {
            let j = 0;
            for (const padControlSound of row) {
                if (padControlSound.shortcodeKey === key) {
                    this.padMachine.matrix[i][j].sound.cloneNode().play().then(() => {
                        this.log('Pad sound played by shortcode');
                    });
                }
                j++;
            }
            i++;
        }
    }

    onGridControlSoundSelectChange(i, j, select) {
        const old = this.gridSoundsMatrix[i][j].soundSrc;
        this.gridSoundsMatrix[i][j].soundSrc = select.value;
        this.padMachine.matrix[i][j].sound = new Audio(this.gridSoundsMatrix[i][j].soundSrc);
        this.log(`Sound [${i}][${j}] change from ${old} to ${this.gridSoundsMatrix[i][j].soundSrc}`);
    }

    onGridControlSoundShortcodeInputChange(i, j, input) {
        const old = this.gridSoundsMatrix[i][j].shortcodeKey;
        this.gridSoundsMatrix[i][j].shortcodeKey = input.value;
        this.log(`Shortcode to pad [${i}][${j}] change from ${old} to ${this.gridSoundsMatrix[i][j].shortcodeKey}`);
    }

    onGridControlChange() {
        if (!this.padMachine) {
            return;
        }
        this.log(`Grid control change to ${this.gridControl.value}`);
        const [rows, padPerRow] = this.gridControl.value.split('x').map(n => parseInt(n, 10));
        this.setGridSounds(rows, padPerRow);
        this.padMachine.setGrid(rows, padPerRow);
        this.padMachine.render();
        this.renderGridSounds();
    }

    generatePadControlElement(pad, i, j) {
        return `
            <div 
                class="${this.domElements.baseGridControlSoundClass}" 
                data-row="${i}"
                data-col="${j}"
            >
                <select class="${this.domElements.baseGridControlSoundSelectClass}">
                    <option value="audio/kick1.wav">kick1</option>
                    <option value="audio/clap1.wav">clap1</option>
                    <option value="audio/hihat1.wav">hihat1</option>
                    <option value="audio/snare1.wav">snare1</option>
                    <option value="audio/tom1.wav">tom1</option>
                    <option value="audio/tom2.wav">tom2</option>
                    <option value="audio/tom3.wav">tom3</option>
                </select>
                <br>
                <input 
                    type="text"
                    placeholder="Tecla de atalho"
                    value="" 
                    class="${this.domElements.baseGridControlSoundShortCodeInputClass}" 
                />
            </div>
        `;
    }

    generatePadControlRowElement(content) {
        return `<div class="${this.domElements.baseGridControlSoundContainerClass}">${content}</div>`;
    }

    setGridSounds(rows, padPerRow) {
        this.log('Grid sounds set');
        this.gridSoundsMatrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < padPerRow; j++) {
                row.push(this.generateNewPadSoundControl(i, j));
            }
            this.gridSoundsMatrix.push(row);
        }
    }

    generateNewPadSoundControl(i, j) {
        return {
            soundSrc: 'audio/kick1.wav',
            shortcodeKey: null,
        };
    }

    renderGridSounds() {
        if (!this.gridControlSounds) {
            return;
        }
        this.log('Render grid sounds');
        let html = '', i = 0;
        for (const row of this.gridSoundsMatrix) {
            let rowHtml = '', j = 0;
            for (const pad of row) {
                rowHtml += this.generatePadControlElement(pad, i, j);
                j++;
            }
            html += this.generatePadControlRowElement(rowHtml);
            i++;
        }
        this.gridControlSounds.innerHTML = html;
        this.watchControlsChange('grid-sounds');
    }

    setPadMachine(padMachine) {
        this.padMachine = padMachine;
    }

    log(...args) {
        console.log(`%c[PadControl]`, 'color: black; background-color: yellow');
        args.forEach((arg) => console.log(arg));
    }

    getSoundByPadPosition(i, j) {
        return new Audio(this.gridSoundsMatrix[i][j].soundSrc);
    }
}