document
    .getElementById("Survey")
    .addEventListener("submit",
        function (event) {
            const overlay = document.getElementById('popupOverlay');
            checked = $("input[name^=genre]:checked").length;

            if (!checked) {
                alert("Please select at least one genre.");
                event.preventDefault();
                return false;

            } else {
                window.alert("Thank you! Your response has been documented!");
                $.post("/submit",
                    {
                        book: "bookValue",
                        author: authorValue
                    },
                    function (data, status) {
                        console.log(data);
                    }
                );
                overlay.classList.remove('show');
            }
        }
    );

let stars =
    document.getElementsByClassName("star");

function setOne() {
    changeRating(1);
}

window.onload = setOne;

function changeRating(n) {
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = n;
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

let bookValue;
let authorValue;
document.getElementById("Proceed").addEventListener('click', function () {
    const bookValue = document.getElementById('data').value;
    const authorValue = document.getElementById('dataAuthor').value;

    document.getElementById("bookName").textContent = "Book: " + bookValue + " by " + authorValue;
})
