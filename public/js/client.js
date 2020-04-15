let user = 'default';
let product;

$(document).ready(function() {
  loadProduct();

  $('.bob').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/user/5e5194d73bd64b4eb0936d0b',
      success: function(data) {
        user = data._id;
        alert(JSON.stringify(data.metrics));
      }
    });
  });

  $('.ariel').click(function() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:5000/api/user/5e4f8b54da75f806d4ee8d03',
      success: function(data) {
        user = data._id;
        alert(JSON.stringify(data.metrics));
      }
    });
  });

  $('.logout').click(function() {
    user = 'default';
  });

  // $('.duck').click(function() {
  //   $.ajax({
  //     type: 'GET',
  //     url: 'http://localhost:5000/api/product/Shampoo/1999',
  //     success: function(data) {
  //       product = data;
  //     }
  //   });
  // });

  // $('.cerave').click(function() {
  //   $.ajax({
  //     type: 'GET',
  //     url: 'http://localhost:5000/api/product/FaceWash/56789',
  //     success: function(data) {
  //       product = data;
  //       alert('Hi');
  //     }
  //   });
  // });

  $('.calculate').click(function() {
    let url;
    if (user === 'default') {
      url =
        'http://localhost:5000/api/calculate/shopify/5e648c403801be668f7a4633';
    } else {
      url =
        'http://localhost:5000/api/calculate/shopify/' +
        user +
        '/5e648c403801be668f7a4633';
    }

    $.ajax({
      type: 'GET',
      url: url,
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

function loadProduct() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/api/shopifyProduct/5e648c403801be668f7a4633',
    success: function(data) {
      console.log('Went through!');
      console.log(data.title);
      alert('product loaded');
      product = data;
    }
  });
}
