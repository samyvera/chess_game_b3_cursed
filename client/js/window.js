class Window {
    constructor(name, pos, size) {
        this.name = name;
        this.pos = pos;
        this.size = size;
    }
}

class OptionWindow extends Window {
    constructor(name, pos, size, options) {
        super(name, pos, size);
        this.options = options;
        this.index = 0;
    }
}

class KeyboardWindow extends OptionWindow {
    constructor(name, pos, size, options) {
        super(name, pos, size, options);
        this.index = 0;
        this.string = "";
    }
}