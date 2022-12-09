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

$('.main-content').addClass("callout alert");
$('#state-names').append($('<p class="required" id="state-name-required">You must enter a state name.</p>'));

<div class="callout alert">
<form>
    <div class="grid-container">
      <div class="grid-x grid-padding-x">
        <div class="medium-6 cell ui-widget" id="choose-a-state">
          <label for="state-names">Enter a state name below:
            <input id="state-names" type="text" placeholder=".medium-6.cell">
              <p class="required " id="state-name-required">You must enter a state name.</p>
          </label>
        </div>
      </div>
    </div>
  </form>
</div>