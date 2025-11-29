document
    .getElementById("Survey")
    .addEventListener("submit",
        function (event) {
            checked = $("input[name=genre]:checked").length;

            if (!checked) {
                alert("Please select at least one genre.");
                event.preventDefault();
                return false;

            } else {
                window.close();
                window.alert("Thank you! Your response has been documented!");
            }
        }
    );

let stars =
    document.getElementsByClassName("star");

function setOne() {
    gfg(1);
}

window.onload = setOne;

function gfg(n) {
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
}

function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

/*document
    .getElementById("Survey")
    .addEventListener("submit",
        function (event) {
            event.preventDefault();

            let errorText =
                document.getElementById(
                    "errorText"
                );

        }
    );*/
