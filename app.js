var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var cookieParser = require('cookie-parser');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var md5 = require('MD5');

var app = express();
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'));
var io     = require('socket.io').listen(server);
//var io = require('socket.io').listen(app.listen(8080));


// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var mysql = require('mysql');

var configdb = {
    host: 'aa5bilh1o0uc00.c5cfpvazprxp.us-west-2.rds.amazonaws.com',
    user: 'ebroot',
    password: 'Guomao12#',
    database: 'ebdb',
    insecureAuth: true,
    multipleStatements: true,
};
var db;

function handleDisconnect() {
	
	db = mysql.createPool(configdb);
                                    
  db.on('error', function(err) {
    console.log('appjs',err.code);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                         
    } else {                                      
      throw err; 
    } 
  });
  
}

handleDisconnect();


var usernames = {};
var rooms = [];
var address = [];
var numOfChat;
var listusers = [];

io.sockets.on('connection', function(socket){

	socket.on('joinchat',function(data){
		socket.userid = 'userid'+data.userid;
		socket.username_join = data.username;
		listusers['userid'+data.userid] = data.username;
		var listsocket = [];
		if (typeof address['userid'+data.userid] == 'undefined') {
			listsocket.push(socket.id);
		}else {
			var i;
			var sockets = address['userid'+data.userid];
			for (i = 0;i < sockets.length; i++){
				if (sockets[i] != socket.id){
					listsocket.push(sockets[i]);
				}
			}
			listsocket.push(socket.id);
		}
		address['userid'+data.userid] = listsocket;
	});
	
	socket.on('sendmessage', function (data) {
		var fromid = data.sender;
		var toid = data.receiver;
		var message = utf8_encode(data.message);
		var uuid = data.uuid;
		var time = data.time;
        var fullname = data.fullname;
		var status;
		var type = 0; //0: is personal
		if (address['userid'+toid] == null){
			status = 0; //0: is pending
		}else {
			status = 1; //1: is sent
		}
		var width = (typeof data.width != "undefined") ? data.width : 0;
		var height = (typeof data.height != "undefined") ? data.height : 0;
			
		db.query('INSERT INTO tbMessage (`fromUser`,`toUser`,`message`,`width`,`height`,`status`,`type`,`uuid`,`time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',[fromid, toid, message, width, height, status, type, uuid, time],function(err,rsl){
			db.query('select belong,path,thumb,thumb2 from tbImage where belong = ? and status = ?',[fromid,0],function(err2,rsl2){
					if (err){
						console.log(err);
					}else {
						//push
							var sql = 'select a.*,b.thumb2 from tbUser as a left join (select belong, path, thumb, thumb2, status from tbImage where status = 0) b on b.belong = a.id where a.id = ? ';
							db.query(sql,fromid,function(error1,result1){
								db.query(sql,toid,function(error2,result2){
									if (result1 != '' && result2 != ''){
										if (result2[0].send_mes_via_chat == 1 && result2[0].device_token != ''){
											db.query('select * from tbUser where device_token = ? ',result2[0].device_token,function(err1,rsl1){
												if (rsl1 != ''){
													var push = rsl1[0].numPush + 1;
													db.query('update tbUser set numPush = ? where device_token = ? ',[push,result2[0].device_token],function(er,rs){
														var path = (result1[0].thumb2 == null) ? '/uploads/default_120.png' : result1[0].thumb2;
                                                        //if(status == 0) {
                                                            pushNotifications(result1[0].fullname, path, result2[0].device_token, 2, fromid, message, rsl.insertId, path);
                                                        //}
														// db.end();
													});
												}
											});
											
										}
									}
								});
							});
						//end push
                        var obj = new Object();
						obj.uuid = uuid;
						obj.messageid = rsl.insertId;
						obj.message = utf8_decode(message);
						obj.status = status;
						obj.time = new Date();
						obj.senderid = fromid;
                        obj.fullname = fullname;
						if (rsl2 != ''){
							obj.avatar = (rsl2[0].path == '') ? '/uploads/default_120.png' : rsl2[0].path;
						}else {
							obj.avatar = '/uploads/default_120.png';
						}

						if (typeof address['userid'+fromid] != 'undefined'){
						var listsocketfrom = array_merge(address['userid'+fromid]);
						for (x1 in listsocketfrom) {
							io.sockets.socket(listsocketfrom[x1]).emit('message', obj);
						}
						}
						if (typeof address['userid'+toid] != 'undefined'){
							var listsocketto = array_merge(address['userid'+toid]);
							for (x2 in listsocketto) {
								io.sockets.socket(listsocketto[x2]).emit('message', obj);
							}
						}
					}
					
			});
		});
	});

	socket.on('disconnect', function(){
		var userid = socket.userid;
		console.log('useridtop',userid);
		delete address[socket.userid];
		delete listusers[socket.userid];
		io.sockets.emit('updateusers', listusers);
		console.log('socketusername',socket.username_join,'userid',userid);
		var obj = new Object();
		var i = socket.username_join;
		if (typeof i !== "undefined"){
			obj.message = socket.username_join;
		}else {
			obj.message = '';
		}
		
		socket.broadcast.emit('updatechat',obj);
	});
	
/*************ROOM******************/
	socket.on('joinroom', function(data){
		socket.senderid = data.userid;
		socket.username = data.username;
		socket.room = data.groupname;
		
		console.log(data);
		usernames[data.username] = data.username;
		socket.join(data.groupname);
		var obj = new Object();
		obj.message = 'you have connected to '+data.groupname+'';
		socket.emit('updatechat',obj);
		socket.broadcast.to(data.groupname).emit('updatechat', 'SERVER', data.username + ' has connected to this room');
	});

	socket.on('sendmessage_room', function (data) {
		var fromid = data.sender;
		var groupid = data.groupid;
		var groupname = data.groupname;
		var message = utf8_encode(data.message);
		var time = data.time;
		var uuid = data.uuid;
		var status;
		if (fromid == socket.senderid){
			status = 1; //1: is sent
		}else {
			status = 0; //0: is pending
		}
		var type = 1; //1: is room
		
		var width = (typeof data.width != "undefined") ? data.width : 0;
		var height = (typeof data.height != "undefined") ? data.height : 0;
		
		db.query('insert into tbMessage (`from`, `to`, `message`, `width`, `height`, `status`, `type`, `uuid`, `time`) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',[fromid, groupid, message, width, height, status, type, uuid, time],function(err,rsl){
			db.query('select belong,path,thumb,thumb2 from tbImage where belong =? and status = ?',[fromid,0],function(err2,rsl2){
				db.query('select a.user_id,b.username from tbGroup_user as a inner join (select id,username from tbUser) b on b.id = a.user_id where a.group_id = ? and a.user_id <> ? ',[groupid,fromid],function(err3,rsl3){
						var obj = new Object();
						obj.uuid = uuid;
						obj.messageid = rsl.insertId;
						obj.message = utf8_decode(message);
						obj.status = status;
						obj.groupid = groupid;
						obj.time = new Date();
						obj.senderid = fromid;
						obj.width = '"'+width+'"';
						obj.height = '"'+height+'"';
						var avatar;
						if (rsl2 != ''){
							avatar = (rsl2[0].thumb2 == '') ? '/uploads/default_120.png' : rsl2[0].thumb2;
						}else {
							avatar = '/uploads/default_120.png';
						}
						obj.avatar = avatar;
						
						if (rsl3 != ''){
							var i;
							for (i = 0;i<rsl3.length;i++){
								if (usernames[rsl3[i].username] == null) {
									io.sockets.socket(address['userid'+rsl3[i].user_id]).emit('message', obj);
								}
							}
						}
						io.sockets.in(socket.room).emit('updatechat',obj );
						//socket.broadcast.to(groupname).emit('updatechat', obj);
				});
			});
		});
	});

	socket.on('disconnect_group', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		var obj = new Object();
		
		console.log(socket.username);
		
		obj.message = 'SERVER '+socket.username+' has disconnected';
		socket.broadcast.emit('updatechat',obj );
		socket.leave(socket.room);
	});

});

function array_merge() {

  var args = Array.prototype.slice.call(arguments),
    argl = args.length,
    arg,
    retObj = {},
    k = '',
    argil = 0,
    j = 0,
    i = 0,
    ct = 0,
    toStr = Object.prototype.toString,
    retArr = true;

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
    }
  }

  if (retArr) {
    retArr = [];
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
    }
    return retArr;
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k];
          } else {
            retObj[k] = arg[k];
          }
        }
      }
    }
  }
  return retObj;
}

function in_array(needle, haystack, argStrict) {

  var key = '',
    strict = !! argStrict;
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}

function formatDate(d) {
  var dd = d.getDate();
  if ( dd < 10 ) dd = '0' + dd;
  var mm = d.getMonth()+1;
  if ( mm < 10 ) mm = '0' + mm;
  var yy = d.getFullYear() % 100;
  if ( yy < 10 ) yy = '0' + yy;
  return dd+'-'+mm+'-'+yy;
}

function utf8_decode(str_data) {
  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
      i += 4;
    }
  }

  return tmp_arr.join('');
}
function utf8_encode(argString) {

  if (argString === null || typeof argString === 'undefined') {
    return '';
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '');
  var utftext = '',
    start, end, stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      );
    } else if ((c1 & 0xF800) != 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) != 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      var c2 = string.charCodeAt(++n);
      if ((c2 & 0xFC00) != 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
}


function pushNotifications(username,path,device_token,type,userid,message,messageid){
	var apn = require('apn');
	var options = {
	    "passphrase": "12345678",
	    "production": false
	  };
	
	var apnConnection = new apn.Connection(options);
	var myDevice = new apn.Device(device_token);
	var note = new apn.Notification();
	db.query('select * from tbUser where device_token = ? ',device_token,function(err,rsl){
		
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = (rsl == '') ? 0 : rsl[0].numPush;
		
		console.log(rsl[0].numPush);
		
		//note.sound = "ping.aiff";
		note.sound = "Submarine.aiff";
		
		switch (type) {
			case 1: //1 is like
				note.alert = "\u2709 "+username+" liked your product on App";
				break;
			case 2: //2 is send a message via chat
				note.alert = "\u2709 "+username+" sent to you a message on App";
				break;
			case 3: //3 is buy one of items
				note.alert = "\u2709 "+username+" bought your product on App";
				break;
			case 4: //4 is comment one of items
				note.alert = "\u2709 "+username+" commented in your product";
				break;
			case 5: //5 is user follow
				note.alert = "\u2709 "+username+" sent request to follow you on App";
				break;
			case 6: //6 is tag
				note.alert = "\u2709 "+username+" tagged you on his post";
				break;				
		}
		
		note.payload = {'type': 2, 'userid':userid, 'username':username,'path':path, 'message':message, 'messageid':messageid};
		
		apnConnection.pushNotification(note, myDevice);
		
	});
	
}

var fs = require('fs');

fs.readdirSync('./app/controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
      route = require('./app/controllers/' + file);
        route.controller(app, db);
    }
});


//app.listen(4100);
