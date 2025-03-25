const userControl = document.querySelector(".control");
const output = document.querySelector(".display .output");
const messageDisplay = document.querySelector(".display .message");
// Add a test div for outputting display
const displayText2 = output.appendChild(document.createElement("div"));
displayText2.classList.add("display-text-2");

//Import dialogue.json as object
let dialogueData;

fetch("./dialogue.json")
.then((response) => {
    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    } else {
        console.log(`JSON retrieved\nstatus: ${response.status}`);
        return response.json();
    }
})
.then((json) => {
    console.log("*** Loaded dialogue.json ***")
    dialogueData = json;
    // console.log(dialogueData["message"]["start"]);
    displayMsg(dialogueData);
})
.catch((error) => {
    console.error(`Could not load dialogue.json: ${error}`);
});

function displayMsg (data) {
    console.log("*** displayMsg running ***");
    messageDisplay.textContent = data.message.start;

}


// Upddates userInput array on user inputs change
userControl.addEventListener("input", (e) => {

        // Reset
        console.log(e.target.name + e.data);
        let userInput = [];

        // Add values from text inputs to userInput array
        for (const child of userControl.children) {
            if (child.value)
                userInput.push(child.value);
            else {
                userInput.push(" ");
            }
        }
        console.log(userInput);
        
        // First if block checks whether character tiles have been added to displayText2 container by checking for child nodes
        // displayText2 div structure: input chars added as spans to divs, output laid out with grid (like input)
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


    