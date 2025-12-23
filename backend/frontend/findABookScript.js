/*function searchOrAddBookTitles() {
    let input =
        document.getElementById('search').value
    input = input.toLowerCase();
    let data = "placeholder";
    let result = data.includes(input);


}*/

$(document).ready(function () {
    $('select').selectize({
        sortField: 'text'
    });
});
