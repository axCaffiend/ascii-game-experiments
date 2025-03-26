import { showTitleSequence } from "./show-unlock.js";

const userControl = document.querySelector(".control");
const output = document.querySelector(".display .output");
const messageDisplay = document.querySelector(".display .message");
const enterBtn = document.querySelector(".enter-btn");
// Add a test div for outputting display
const displayText2 = output.appendChild(document.createElement("div"));
displayText2.classList.add("display-text-2");
let userInput = [];
let dialogueData;

// ----- ADD GLOBAL METHOD ARRAY.EQUALS(ANOTHER_ARRAY) -----
// Adds .equals method to all Array prototypes - so can call on any array.
// COPIED From: https://stackoverflow.com/a/14853974
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
        return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
// ----- END COPIED CODE : Array.equals method. -----


//Import dialogue.json as object and assign to dialogueData variable.
fetch("./dialogue.json")
.then((response) => {
    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    } else {
        console.log(`dialogue.json retrieved\nstatus: ${response.status}`);
        // Converts Promise into json promise
        return response.json();
    }
})
.then((json) => {
    console.log("*** Parsed dialogue.json ***")
    // Assign object resolved from .json() promise to dialogueData global variable
    dialogueData = json;

    // Top level game function
    runLevel();
})
.catch((error) => {
    console.error(`Could not load dialogue.json: ${error}`);
});

// Top level game function - called after dialogue.json is loaded with Fetch API
function runLevel() {
    console.log("Data loaded - running level.");
    messageDisplay.textContent = dialogueData.message.start;
    enterBtn.addEventListener("click", checkUserInput);
}

function checkUserInput() {
    console.log("*** checkUserInput running ***");
    // console.log("--- checkUserInput: " + userInput + " ---" + typeof(userInput));
    // console.log([...userInput]);
    // console.log("--- rune: " + rune + typeof(rune));
    // console.log([...rune]);
    let rune = dialogueData.rune.key;

    if ([...rune].equals([...userInput])) {
        messageDisplay.textContent = dialogueData.message.solved;
        showTitleSequence();
    } else {
        messageDisplay.textContent = dialogueData.message.incorrect;
        setTimeout(()=> messageDisplay.textContent = dialogueData.message.start, 2000);
    }
}


// Upddates userInput array on userControl inputs change
console.log("Added userControl event listener");
userControl.addEventListener("input", (e) => {

        // Reset
        console.log(e.target.name + e.data);
        userInput = [];

        // Add values from text inputs to userInput array
        // If input is empty, convert to a whitespace
        for (const child of userControl.children) {
            if (child.value)
                userInput.push(child.value);
            else {
                userInput.push(" ");
            }
        }
        console.log(userInput);
        
        // First checks whether character divs have been added to displayText2 container by checking for child nodes
        if (displayText2.hasChildNodes()) {

            console.log("has child nodes")
            console.log(displayText2.childNodes);

            //displayText2 already has character tiles added (i.e. user input has occurred since page load)
            const displayText2Arr = [...displayText2.childNodes];
            console.log("DisplayText2 converted to an array");
            console.log(displayText2Arr);

            const currentDisplay = displayText2Arr.map(function (i) {
                console.log("map function - adding text content")
                console.log(i.firstChild.textContent);
                return i.firstChild.textContent;
            })

            console.log("Current display values array");
            console.log(currentDisplay);

            // Check that userInput array is same length as currentDisplay array
            if (userInput.length === currentDisplay.length) {
                console.log("userInput and currentDisplay length is same.")

                // Iterate with length of userInput array
                for (let i = 0; i < userInput.length; i++) {

                    // Compare values at same index in both arrays, if it's different then update the character
                    if (userInput[i] !== currentDisplay[i]) {
                        console.log("*** Change detected ***");
                        console.log(`User input ${userInput[i]} \n Current Display ${currentDisplay[i]}`)

                         displayText2.children[i].querySelector(".char").textContent = userInput[i];

                    } else {
                        // If not - log no change message
                        console.log("No change")
                        console.log(`User input ${userInput[i]} \n Current Display ${currentDisplay[i]}`)
                    }
                }

            } else {
                console.log("userInput and currentDisplay not same length...")
            }

        /* 
        No child nodes on displayText2 - creates character tiles 
        Structure: (<div class="box">
        <span class="char">INPUT_CHARACTER</span>
        </div>)
        INPUT_CHARACTER is added for each userInput text input.
        */
        } else {
            console.log("No child nodes - creating new");
            for (const i in userInput) {
                // Create elements and add classes
                const box = document.createElement("div");
                box.classList.add("box");
                const char = document.createElement("span");
                char.classList.add("char");
                box.appendChild(char);
                displayText2.appendChild(box);

                // Update from userInput
                console.log(userInput[i]);
                char.textContent = userInput[i];
            }
        }
    })

// COPIED CODE - adjusted from:
// https://stackoverflow.com/questions/15595652/focus-next-input-once-reaching-maxlength-value

// Automatically focus next or previous input in user control on input
userControl.addEventListener("keyup", (e) => {
    let target = e.target;
    let maxLength = parseInt(target.attributes["maxlength"].value, 10);
    let myLength = target.value.length;
    if (myLength >= maxLength) {
        let next = target;
        while (next = next.nextElementSibling) {
            if (next == null)
                break;
            if (next.tagName.toLowerCase() === "input") {
                next.focus();
                break;
            }
        }
    }
    // Move to previous field if empty (user pressed backspace)
    else if (myLength === 0) {
        let previous = target;
        while (previous = previous.previousElementSibling) {
            if (previous == null)
                break;
            if (previous.tagName.toLowerCase() === "input") {
                previous.focus();
                break;
            }
        }
    }
})


    