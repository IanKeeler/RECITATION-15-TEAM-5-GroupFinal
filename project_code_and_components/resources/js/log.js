function togglePassengers() {
    const travelMode = document.getElementById("travel_mode").value;
    const passengersText = document.getElementById("passengers-label");
    const passengersBox = document.getElementById("passengers");
    if(travelMode == "car") {
        passengersText.classList.remove("hidden");
        passengersBox.classList.remove("hidden");
    } else {
        passengersText.classList.add("hidden");
        passengersBox.classList.add("hidden");
    }
}
function showMode(){
    const inputMode = document.getElementById("input_mode").value;
    const travelForm = document.getElementById("travel");
    const electricForm = document.getElementById("household");
    const freightForm = document.getElementById("food");
    const outerBox = document.getElementById("outer-box");
    const resultsWrapper = document.getElementById("log-results-wrapper");
    const starterPrompt = document.getElementById("starter-prompt");
    if(inputMode == "travel"){
        travelForm.classList.remove("hidden");
        electricForm.classList.add("hidden");
        freightForm.classList.add("hidden");
        starterPrompt.classList.add("hidden");
        outerBox.style.display = "";
        resultsWrapper.style.display = "";
    }
    if(inputMode == "household"){
        travelForm.classList.add("hidden");
        electricForm.classList.remove("hidden");
        freightForm.classList.add("hidden");
        starterPrompt.classList.add("hidden");
        outerBox.style.display = "";
        resultsWrapper.style.display = "";
    }
    if(inputMode == "food"){
        travelForm.classList.add("hidden");
        freightForm.classList.remove("hidden");
        electricForm.classList.add("hidden");
        starterPrompt.classList.add("hidden");
        outerBox.style.display = "";
        resultsWrapper.style.display = "";
    }
}