import { CLOSE, MISSED, RIGHT } from "./gameSettings";

const keyboardConfig = {
    keyboardLayout: { 
        default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "ENTER Z X C V B N M BACKSPACE",
            "SPACE"
          ]
    },
    keyboardDisplay:  {
        "ENTER": "Enter",
        "SPACE": "Placeholder",
        "BACKSPACE": "⌫"
    },
    buttonTheme: [
        {class: MISSED, buttons: " "},
        {class: CLOSE, buttons: " "},
        {class: RIGHT, buttons: " "}
    ]
}

export const {
    keyboardLayout, 
    keyboardDisplay,
    buttonTheme 
} = keyboardConfig;




