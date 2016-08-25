$(function() {

  // FIT list
  var $fitList = $('#fit-list tbody');

  // FIT activity log form
  var $entryCreateBtn = $('#entry-create');
  var $entryDate = $('#entry-date');
  var $entryActivity = $('#entry-activity');
  var $entryType = $('#entry-type');
  var $entryMeasurement = $('#entry-measurement');

  // FIT edit modal
  var $editEntryModal = $('#edit-entry-modal');
  var $entryUpdateBtn = $('#entry-update');
  var $editEntryDate = $('#edit-entry-date');
  var $editEntryActivity = $('#edit-entry-activity');
  var $editEntryType = $('#edit-entry-type');
  var $editEntryMeasurement = $('#edit-entry-measurement');

  // Weather
  var $weatherData = $('#weather-data');

  // FIT event listerners
  $entryCreateBtn.on('click', createEntry);
  $entryUpdateBtn.on('click', updateEntry);
  $fitList.on('click','.edit', editEntry);
  $fitList.on('click','.delete', deleteEntry);

  // initalize firebase database
  firebase.database().ref('fit-list/').on('value', renderFitList);

  // FIT create
  function createEntry() {
    firebase.database().ref('fit-list/').push({
      date: $entryDate.val(),
      act: $entryActivity.val(),
      type: $entryType.val(),
      measurement: $entryMeasurement.val()
    });
  }

  // FIT edit
  function editEntry() {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('fit-list/' + id).once('value').then(function(snapshot) {
      var entry = snapshot.val();
      $editEntryModal.data('entry-id', id);
      $editEntryDate.val(entry.date);
      $editEntryActivity.val(entry.act);
      $editEntryType.val(entry.type);
      $editEntryMeasurement.val(entry.measurement);
      $('#edit-entry-modal').openModal();
    });
  }

  // FIT update
  function updateEntry() {
    var id = $editEntryModal.data('entry-id');
    firebase.database().ref('/fit-list/' + id).set({
      date: $editEntryDate.val(),
      act: $editEntryActivity.val(),
      type: $editEntryType.val(),
      measurement: $editEntryMeasurement.val()
    });
  }

  // FIT delete
  function deleteEntry(e) {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('fit-list/' + id).remove();
  }

  // FIT populate list
  function loadFitList() {
    firebase.database().ref('fit-list/').once('value').then(renderFitList);
    // console.log('does this load?');
  }

  // FIT render list
  function renderFitList(data) {
    $fitList.empty();
    var entryList = data.val();
    for(var id in entryList) {
      var entry = entryList[id];
      $fitList.append('<tr data-id="'+id+'"><td>'+entry.date+'</td><td>'+entry.act+'</td><td class="text-right">'+entry.measurement+'</td><td>'+entry.type+'</td><td class="text-center">'+'<button class="waves-effect waves-light grey lighten-1 btn edit"><i class="material-icons">mode_edit</i></button><button class="btn delete red accent-1"><i class="material-icons">clear</i></button></td></tr>');
    }
  }

  // Weather App
  loadWeather('30.5546695,-97.8291481)');
  /* Does your browser support geolocation? */
  if ("geolocation" in navigator) {
    $('.js-geolocation').show();
  } else {
    $('.js-geolocation').hide();
  }

  // grabs users coordinates
  $('.js-geolocation').on('click', function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
  });

  function loadWeather(location) {
    var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + ' select item.condition from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="('+location+')")';
    console.log(weatherUrl);
    $.ajax({
      type: 'GET',
      url: weatherUrl,
      dataType: 'xml',
      success: function (xml) {
        $(xml).find("item").each(function () {
          var $this = $(this);
          var temp = $this.find('[temp]').attr('temp');
          var text = $this.find('[text]').attr('text');
          var weatherContent = '<div class="weather-item weather-temp text-center">'+temp+'&deg;F'+'</div><div class="weather-item weather-text text-center">'+text+'</div>';
          $weatherData.empty();
          $weatherData.append(weatherContent);
        });
      },
      error: function() {
        $weatherData.append('<p> class="center red-text">Content is not available.</p>');
      }
    });
  }

});
