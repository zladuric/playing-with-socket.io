(function(){
  window.onload = function() {
    var app = {
      messages: []
      , users: []
      , socket: null
      , enabled: false
      , init: function() {
        var me = this;
        $('#messages-widget').hide();
        $('#join').bind('click', function() {
          me.nick = $('#nickname').val();
          if(me.nick.length > 0) {
            me.setupSocket(me.nick);
            me.addUser(me.nick);
            $('.right').html(me.nick);
            $('#name-widget').hide();
            $('#messages-widget').show();
            me.enabled = true;
            $('#send').bind('click', function() {
              console.log('lala');
              if(me.enabled && $('#sendMessage').val().length > 0) {
                me.sendMessage();
              }
            });
          }
        });
      } 
      , addUser: function(nick) {
        this.users.push(nick);
        $('#users').append('<p>' + nick + '</p>');
      }
      , setupSocket:  function(nick) {
        var me = this;
        this.socket = io.connect('http://zlayer.net:3002');
        this.socket.emit('join', {name: nick});
        this.socket.on('message', function(data) {
          if(data.message && data.nick != me.nick) {
            me.appendMsg(data.nick + ': ' + data.message, 'green');
          }
        });
        this.socket.on('join', function(data) {
          me.addUser(data.nick);
        });
          
        $('#send').keyup(function(ev) {
          if(ev.keyCode == 13)
            me.sendMessage();
        });
      }
      , appendMsg: function(msg, style) {
        var li = document.createElement('li');
        li.setAttribute('class', style)
        var text = document.createTextNode(msg);
        li.appendChild(text);
        if($('#messages li').length > 0) {
          $(li).insertBefore('#messages li:first-child');
        } else {
          $('#messages').append(li);
        }
      }
      , sendMessage: function() {
        var messages = document.getElementById('sendMessage');
        var message = messages.value;
        this.socket.emit('message', {message: message});
        messages.value = '';
        this.appendMsg(message, 'red');
      }
    }
    app.init();
  }

})(window);
