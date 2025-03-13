const output = document.querySelector(".display .output");

let userControl = document.querySelector(".control");
let userInput = [];

// Upddates userInput array on user inputs change
addEventListener("input", (e) => {

        // Reset
        console.log(e.target.name + e.data);
        userInput = [];
        output.textContent = "";

        // Add values from text inputs to userInput array
        for (const child of userControl.children) {
            if (child.value)
                userInput.push(child.value);
            else {
                userInput.push(" ");
            }
        }
        console.log(userInput);

        
        // // displayText - test 1
        // const displayText = output.appendChild(document.createElement("p"));
        // displayText.classList.add("display-text");
        // // Create string from userInput array and add to displayText <p> element in output box
        // text = userInput.join("");
        // // console.log(typeof text);
        // displayText.textContent = text;


        // displayText2 - test 2
        const displayText2 = output.appendChild(document.createElement("div"));
        displayText2.classList.add("display-text-2");

        // displayText2 test - input chars added as spans to divs, output laid out with grid (like input)
        for (const i in userInput) {
            box = document.createElement("div");
            char = document.createElement("span");
            console.log(userInput[i]);
            char.textContent = userInput[i];
            box.appendChild(char);
            displayText2.appendChild(box);

        }
    })
