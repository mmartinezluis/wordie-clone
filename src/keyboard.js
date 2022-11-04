const keyboardConfig = {
    keyboardLayout: { 
        shift:  [        
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m {backspace}",
            "{space} {ent}"
        ],
        default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{ent} Z X C V B N M {backspace}",
            "{space}"
          ],
        numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
    },
    keyboardDisplay:  {
        "{ent}": "Enter",
        "{space}": "Placeholder",
        "{backspace}": "delete"
    }
}

export const {
    keyboardLayout, 
    keyboardDisplay 
} = keyboardConfig;




