export const QUEUE = new Array(6).fill(0).map((v,i) => i);
export const COUNTER = 0;
export const ALPHABET = {A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z'};
export const target_function = (word_list) => word_list[Math.floor(Math.random()*(word_list.length))].toUpperCase();
export const TARGET_MAP_CONSTANT = {};
export const PLACEHOLDERCOUNTER = 0;
export const ATTEMPTS = {};
export const BLANK = "";
// constants for assertion matrix and page keyboard dynamic button settings
export const MISSED = "missed";
export const CLOSE = "close";
export const RIGHT = "right";
// matrices 
export const inputs_matrix = () => new Array(6).fill(0).map(el => new Array(5).fill(""));
export const assertion_matrix = () => new Array(6).fill(0).map(el => new Array(5).fill(BLANK));
