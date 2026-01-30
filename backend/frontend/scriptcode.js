

document.getElementById("submitButton").addEventListener("click",
    function (event) {
        event.preventDefault();
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
    document.getElementById("Survey").reset();
    document.querySelectorAll('input[type=text]').forEach(checked = false);
    document.querySelectorAll('input[type=text]').forEach
    setOne();
}

let stars =
    document.getElementsByClassName("star");

function setOne() {
    changeRating(1);
}

window.onload = setOne();

function changeRating(newRating) {
    remove();
    for (let i = 0; i < newRating; i++) {
        if (newRating == 1) cls = "one";
        else if (newRating == 2) cls = "two";
        else if (newRating == 3) cls = "three";
        else if (newRating == 4) cls = "four";
        else if (newRating == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = newRating;
    rating = document.getElementById(n);
    rating.checked = true;
}

function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

function togglePopup() {
    const overlay =
        document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}

function togglePopup0() {
    const overlay =
        document.getElementById('popupOverlay0');
    overlay.classList.toggle('show');
}

function removeShow() {
    const overlay =
        document.getElementById('popupOverlay');
    overlay.classList.remove('show');
}

function removeShow0() {
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
