var dropdown = $('.dropdown-pane');
dropdown.attr('style', 'width: 75vw')

// create list item elements for dropdown
var activity1 =$('#activity1')
var listItem = $('<li>')
var input = $('#input');
var checkbox = $('<input>');
checkbox.attr('type', "checkbox");
checkbox.attr('id', 'checkbox4');
var label = $('<label>');
label.attr('for', 'checkbox4');
label.text('Checkbox 4')
listItem.append(checkbox);
listItem.append(label);
console.log(listItem.text());
activity1.append(listItem)

var required = $('.required-field');
required.addClass("callout alert");
var requiredAlert = $('#required');
requiredAlert.text("You must select at least one state to search!")