var dropdown = $('.dropdown-pane');
console.log("dropdown: " + dropdown);

dropdown.attr('style', 'width: 75vw')

var input = $('#input');
var dropdownList =$('<grid-x>')
console.log(dropdownList);
var checkbox = $('<input>');
checkbox.attr('type', "checkbox");
checkbox.attr('id', 'checkbox4');
var label = $('<label>');
label.attr('for', 'checkbox4');
label.text('Checkbox 4')
input.append(checkbox);
input.append(label);