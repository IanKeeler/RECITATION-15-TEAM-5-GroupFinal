function togglePassengers() {
    const travelMode = document.getElementById("travel_mode").value;
    const extraInput = document.getElementById("extra_input")
    if(travelMode == "car" || travelMode == "bus") {
        extraInput.classList.remove("hidden")
    } else {
        extraInput.classList.add("hidden")
    }
}
function showMode(){
    const inputMode = document.getElementById("input_mode").value;
    const travelForm = document.getElementById("travel")
    const electricForm = document.getElementById("household")
    const freightForm = document.getElementById("food")
    const outerBox = document.getElementById("outer-box")
    if(inputMode == "travel"){
        travelForm.classList.remove("hidden")
        electricForm.classList.add("hidden")
        freightForm.classList.add("hidden")
        outerBox.style.display = ""
    }
    if(inputMode == "household"){
        travelForm.classList.add("hidden")
        electricForm.classList.remove("hidden")
        freightForm.classList.add("hidden")
        outerBox.style.display = ""
    }
    if(inputMode == "food"){
        travelForm.classList.add("hidden")
        freightForm.classList.remove("hidden")
        electricForm.classList.add("hidden")
        outerBox.style.display = "";
    }
}