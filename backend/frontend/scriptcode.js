

document.getElementById("submitButton").addEventListener("click",
    function (event) {
        const overlay = document.getElementById('popupOverlay');
        checked = $("input[name^=genre]:checked").length;

        if (!checked) {
            alert("Please select at least one genre.");
            event.preventDefault();
            return false;
        } else {
            window.alert("Thank you! Your response has been documented!");
            overlay.classList.remove('show');
        }
    }
);

function resetForm() {
    console.log("This thing is getting called.")
    document.getElementById("Survey").reset();
    toggleProceedButton();
    resetStarRating();
    document.getElementById('Proceed').disabled = true;
    console.log(document.getElementById("Proceed"));
}

let stars =
    document.getElementsByClassName("star");

function resetStarRating() {
    changeRating(1);
}

window.onload = resetStarRating();

function changeRating(newRating) {
    removeStarRating();
    for (let i = 0; i < newRating; i++) {
        if (newRating == 1) cls = "one";
        else if (newRating == 2) cls = "two";
        else if (newRating == 3) cls = "three";
        else if (newRating == 4) cls = "four";
        else if (newRating == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = newRating;
    rating = document.getElementById(newRating);
    rating.checked = true;
}

function removeStarRating() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

function toggleFormOverlay() {
    const overlay =
        document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}

function toggleAuthorInputOverlay() {
    const overlay =
        document.getElementById('popupOverlay0');
    overlay.classList.toggle('show');
}

function hideFormOverlay() {
    const overlay =
        document.getElementById('popupOverlay');
    overlay.classList.remove('show');
}

function hideAuthorDataOverlay() {
    const overlay =
        document.getElementById('popupOverlay0');
    overlay.classList.remove('show');
}

document.addEventListener('click', function (event) {
    const overlay = document.getElementById('popupOverlay');
    const popupBox = document.querySelector('.popup-box');
    const overlay0 = document.getElementById('popupOverlay0');
    const popupBox0 = document.querySelector('.popup-box0');

    // Check if the click target is not the popup box or the button that opens it
    if (!popupBox.contains(event.target) && !event.target.matches('.button') && !popupBox0.contains(event.target) && !event.target.matches('.small-button')) {
        overlay.classList.remove('show'); // Close the popup
    }
});

$(document).ready(function () {
    $('select').selectize({
        sortField: 'text'
    });
});

let titleValue;
let authorValue;

function toggleProceedButton() {
    const proceedButton = document.getElementById('Proceed');
    const titleValue = document.getElementById('dataBook').value;
    const authorValue = document.getElementById('dataAuthor').value;

    if (titleValue === "" || authorValue === "") {
        proceedButton.disabled = true;
        console.log("disabled");
    } else {
        proceedButton.disabled = false;
        console.log("continue");
    };

    document.getElementById("bookName").textContent = "Book to Review: " + titleValue + " by " + authorValue;
};
