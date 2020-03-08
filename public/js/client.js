let user = 'default';
let product = 'rubberDuck';

$(document).ready(function() {
  loadUserScore();

  $('.bob').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/user/5e5194d73bd64b4eb0936d0b',
      success: function(data) {
        user = data;
      }
    });
  });

  $('.ariel').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/user/5e4f8b54da75f806d4ee8d03',
      success: function(data) {
        user = data;
      }
    });
  });

  $('.logout').click(function() {
    user = 'default';
  });
});

function loadUserScore() {
  $.ajax({
    type: 'GET',
    url: 'https://my-json-server.typicode.com/typicode/demo/posts',
    success: function(data) {
      console.log('Went through!');
      $('.default-score').html('Whats good');
    }
  });
}
