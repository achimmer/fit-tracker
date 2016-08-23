$(function() {

  // card list
  var $cards = $('#card-list tbody');

  // create panel
  var $cardCreateBtn = $('#card-create');
  var $cardTitle = $('#card-title');
  var $cardDesc = $('#card-desc');

  // edit modal
  var $editCardModal = $('#edit-card-modal');
  var $cardUpdateBtn = $('#card-update');
  var $editCardTitle = $('#edit-card-title');
  var $editCardDesc = $('#edit-card-desc');

  $cardCreateBtn.on('click', createCard);
  $cardUpdateBtn.on('click', updateCard);
  $cards.on('click','.delete', deleteCard);
  $cards.on('click','.edit', editCard);

  loadFlashCards();

  firebase.database().ref('cards/').on('value', renderCards);

  function createCard() {
    firebase.database().ref('cards/').push({
      title: $cardTitle.val(),
      desc: $cardDesc.val()
    });
  }

  function editCard() {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('cards/' + id).once('value').then(function(snapshot) {
      var card = snapshot.val();
      $editCardModal.data('card-id', id);
      $editCardTitle.val(card.title);
      $editCardDesc.val(card.desc);
      $('#edit-card-modal').openModal();
    });
  }

  function updateCard() {
    var id = $editCardModal.data('card-id');
    firebase.database().ref('/cards/' + id).set({
      title: $editCardTitle.val(),
      desc: $cardDesc.val()
    });
  }

  function deleteCard(e) {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('cards/' + id).remove();
  }

  function loadFlashCards() {
    firebase.database().ref('cards/').once('value').then(renderCards);
  }

  function renderCards(data) {
    $cards.empty();
    var cards = data.val();
    for(var id in cards) {
      var card = cards[id];
      $cards.append('<tr data-id="'+id+'"><td>'+card.title+'</td><td>'+card.desc+'</td><td><button class="edit waves-effect waves-light btn">Edit</button><button class="btn delete red">Delete</button></td></tr>');
    }
  }
});
