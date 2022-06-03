// Handles Minecraft's colouring code

const COLOR_DELIMITER = '§';
const DEFAULT_ACTIVE = {
    color: 'f',
    bold: false,
    strike: false,
    underline: false,
    italic: false,
};


/* The Section class is a container for the characters in a string. */
export class Section {
    constructor(details) {
        this.chars = "";
        this.details = details;
    }

    /**
     * The function addChar() takes a character as an argument and adds it to the array chars
     * @param char - The character to add to the string.
     */
    addChar(char) {
        this.chars += char;
    }

    getColourString() {
        switch(this.details.color) {
            case '0':
                return "black"
            case '1':
                return "dark_blue"
            case '2':
                return "dark_green"
            case '3':
                return "dark_aqua"
            case '4':
                return "dark_red"
            case '5':
                return "dark_purple"
            case '6':
                return "gold"
            case '7':
                return "gray"
            case '8':
                return "dark_gray"
            case '9':
                return "blue"
            case 'a':
                return "green"
            case 'b':
                return "aqua"
            case 'c':
                return "red"
            case 'd':
                return "light_purple"
            case 'e':
                return "yellow"
            case 'f':
                return "white"
        }

        throw "Invalid colour code";
    }
}

export class ColouredString {
    constructor(string) {
        let active = Object.assign({}, DEFAULT_ACTIVE);
        let newSection = true;
        this.sections = [];
        
        for (let i = 0; i < string.length; i++) {
            let char = string.charAt(i);
        
            if (char === COLOR_DELIMITER) {
                // eval next char
                i += 1;
                let char = string.charAt(i);
                switch(char) {
                    case 'k':
                        continue
                    case 'l':
                        active.bold = true;
                    case 'm':
                        active.strike = true;
                    case 'n':
                        active.underline = true;
                    case 'o':
                        active.italic = true;
                    case 'r':
                        active = DEFAULT_ACTIVE;
                    default:
                        active.color = char;
                }

                newSection = true;
        
                continue;
            } else {
                if (newSection) {
                    // details are modified, make a new section
                    // clone
                    this.sections.push(new Section(Object.assign({}, active)));
                    this.sections[this.sections.length - 1].addChar(char);
                    newSection = false;
                } else {
                    // details are not modified, add it to the last
                    // (most recent) section
                    this.sections[this.sections.length - 1].addChar(char);
                }
            }
        }
    }

    // Convert sections to html code
    toHtml() {
        let rv = (
            <div className="coloured">
                {
                    this.sections.map(function(section) {
                        let classnames = "";

                        if (section.details.bold) {classnames += "bold "}
                        if (section.details.strike) {classnames += "strike "}
                        if (section.details.underline) {classnames += "underline "}
                        if (section.details.italic) {classnames += "italic "}
                        
                        classnames += section.getColourString();

                        return (
                            <span className={classnames}>{section.chars}</span>
                        );
                    })
                }
            </div>
        );
        return rv;
    }
}

function debug_sections(sections) {
    return "   : " + sections.map(i => `${i.chars} (${i.details.color}) // `).join();
}