let user = 'default';
let product = 'rubberDuck';

$(document).ready(function() {
  // loadUserScore();

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

  $('.duck').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/product/Shampoo/1999',
      success: function(data) {
        product = data;
      }
    });
  });

  $('.cerave').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/product/FaceWash/56789',
      success: function(data) {
        product = data;
        alert('Hi');
      }
    });
  });

  $('.calculate').click(function() {
    $.ajax({
      type: 'GET',
      url:
        'http://localhost:5000/api/calculate/5e5194d73bd64b4eb0936d0b/FaceWash/56789',
      success: function(data) {
        // data = JSON.parse(data);
        console.log(data);
        alert('Your Score is: ' + data.score.toString());
      }
    });
  });

  $('.logout').click(function() {
    user = 'default';
  });
});

// function loadUserScore() {
//   $.ajax({
//     type: 'GET',
//     url: 'http://localhost:5000/api/product/FaceWash/56789',
//     success: function(data) {
//       console.log('Went through!');
//       console.log(data.name);
//       alert(data);
//       // $('.default-score').html();
//     }
//   });
// }
