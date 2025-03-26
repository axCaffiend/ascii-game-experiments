const showUnlockBtn = document.querySelector(".btn.toggle-unlock");
const unlockSeq = document.querySelector(".unlock-sequence");
const asciiTitle = `_______ _______ _______ _______ __   _ ______
|_____| |______ |       |______ | \\  | |     \\
|     | ______| |_____  |______ |  \\_| |_____/`;

showUnlockBtn.addEventListener("click", showTitleSequence);

function showTitleSequence() {
    unlockSeq.classList.add("show-sequence");
    let unlockSeqTxt = document.createElement("p");
    let txtNode = document.createTextNode(asciiTitle);
    unlockSeqTxt.appendChild(txtNode);
    unlockSeq.appendChild(unlockSeqTxt);
    unlockSeq.addEventListener("animationend", () => {
        setTimeout(()=> unlockSeqTxt.classList.add("titleGlow"), 500);
    })
}

export {showTitleSequence};