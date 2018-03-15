$(function () {
  var socket = io.connect();
  socket.on('connect', function(data) {
    socket.emit('update');
  });

  socket.on('position', function(data) {
    $('#module').val(data.position);
  });

  socket.on('mode', function(data) {
    $('#mode').val(data.mode);
  });

  socket.on('status', function(data) {
    if ($('body').hasClass('index')) {
      $('#mode').val(data.mode);
      $('#module').val(data.position);
    } else if ($('body').hasClass('information')) {
      $('#info-status, #info-serial, #info-network').removeClass('text-success, text-danger');

      $('#info-status').text((data.isReady) ? 'ready' : 'not ready').addClass((data.isReady) ? 'text-success' : 'text-danger');
      $('#info-serial').text((data.serial) ? 'connected' : 'not connected').addClass((data.serial) ? 'text-success' : 'text-danger');
      $('#info-network').text((data.network) ? 'connected' : 'not connected').addClass((data.network) ? 'text-success' : 'text-danger');

      $('#info-type').text(data.type);
      $('#info-mode').text(data.mode);
      $('#info-position').text(data.position);
    }

    $('.info-address').text(data.address);
  });

  if ($('body').hasClass('index')) {
    $.getJSON('//' + location.host + '/list', function(data) {
      var input = $('<select id="module"></select>');

      $.each(data, function (index, message) {
        if (index == 0 || message.length > 0) {
          var select = $('<option value="' + index + '">' + message + '</option>');
          input.append(select);
        }
      });

      $('#modules').append(input);
    });

    $('body').on('change', '#mode', function () {
      var action = ($(this).val() == 'static') ? 'stop' : 'start';

      $.get('//' + location.host + '/random/' + action, function(data) {
      }, 'json');
    });

    $('body').on('change', '#module', function () {
      $.get('//' + location.host + '/move/' + $(this).val(), function(data) {
      }, 'json');
    });
  }
});
