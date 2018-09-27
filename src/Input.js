
// TODO bug when maj is active
class Input {
    static downKeys = {};

    static getKeyDown(key) {
        return key in this.downKeys;
    }

    static hook(element) {
        element = element || window;
        this.hookedElement = element;

        element.addEventListener('keydown', this.handleKeyDown, false);
        element.addEventListener('keyup', this.handleKeyUp, false);
    }

    static unhook() {
        this.hookedElement.removeEventListener('keydown', this.handleKeyDown);
        this.hookedElement.removeEventListener('keyup', this.handleKeyUp);
    }

    static handleKeyDown = (e) => {
        Input.downKeys[e.key] = true;
    }

    static handleKeyUp = (e) => {
        delete Input.downKeys[e.key];
    }
}

export default Input;
