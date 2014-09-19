module.exports.controller = function(app,db) {

// get list all post product //
app.get('/listpost', function(req,res){
	
	var sql = 'SELECT a.*,b.*,c.likes,d.comment,e.rate, group_concat(f.path separator ",") as imgpost, group_concat(f.thumb separator ",") as imgpost_thumb, group_concat(f.thumb2 separator ",") as imgpost_thumb120 FROM tbProduct AS a '+
						'LEFT JOIN (SELECT id as user, username, pickup_location FROM tbUser) b ON a.userid = b.user '+
						'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) c ON c.postid = a.id '+
						'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) d ON d.postid = a.id '+
						'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) e ON e.postid = a.id '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 1) f ON f.belong = a.id '+
						'GROUP BY a.id '+
						'ORDER BY RAND() DESC';
	
	db.query(sql, function(err,result){
		if (err){
			res.json({'Message':'Not Found', 'code':0});
		}else {
			if (result.length === 0){
				res.json({'Message':'Result Empty', 'code':0});
			}else {
				var data = new Array();
				for (index = 0; index < result.length; ++index) {
					var obj = new Object();
					obj.productid = result[index].id;
					obj.userid = result[index].userid;
					obj.username = result[index].username;
					
					if (result[index].meet_in_person === 1){
						obj.meet_in_person = 'Yes';
						obj.pickup_location = result[index].pickup_location;
					}else if (result[index].meet_in_person === 0){
						obj.meet_in_person = 'No';
						obj.pickup_location = null;
					}
					
					obj.location = result[index].location;
					obj.add_to_map = (result[index].add_to_map == 1) ? 'Yes' : 'No';
					obj.price = result[index].price;
					if (result[index].shipping === 1){
						obj.shipping = 'Yes';
						obj.country = result[index].country;
					}else if(result[index].shipping === 0){
						obj.shipping = 'No';
						obj.country = null;
					}
					obj.numOfLike = (result[index].likes == null) ? 0 : result[index].likes;
					obj.numOfComment = (result[index].comment == null) ? 0 : result[index].comment;
					obj.avgrate = (result[index].rate == null) ? 0 : result[index].rate;
					obj.sold = result[index].sold;
					obj.createtime = result[index].createtime;
					
					//obj.description = result2[i].description;
						obj.typepost = result[index].type;
						obj.type = result[index].type;
						if (result[index].type == 1){
								var img = [];
								var obj2 = new Object();
								obj2.path = (result[index].description == '') ? '/uploads/new_product.png' : result[index].description;
								img[0] = obj2;
								obj.imgpost = img;
						}else {
							obj.description = utf8_decode(result[index].description);
						
							//img original
							if (result[index].imgpost == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product.png';
								img[0] = obj2;
								obj.imgpost = img;
							}else {
								var array = result[index].imgpost.split(',');
								var i2;
								var newarr = [];
								for (i2 = 0;i2 < array.length; i2++){
									var obj3 = new Object();
									obj3.path = array[i2];
									newarr[i2] = obj3;
								}
								obj.imgpost = newarr;
							}
	
							//img thumb 300
							if (result[index].imgpost_thumb == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product.png';
								img[0] = obj2;
								obj.imgpost_thumb = img;
							}else {
								var array = result[index].imgpost_thumb.split(',');
								var i2;
								var newarr = [];
								for (i2 = 0;i2 < array.length; i2++){
									var obj3 = new Object();
									obj3.path = array[i2];
									newarr[i2] = obj3;
								}
								obj.imgpost_thumb = newarr;
							}
							
							//img thumb 120
							if (result[index].imgpost_thumb120 == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product.png';
								img[0] = obj2;
								obj.imgpost_thumb120 = img;
							}else {
								var array = result[index].imgpost_thumb120.split(',');
								var i2;
								var newarr = [];
								for (i2 = 0;i2 < array.length; i2++){
									var obj3 = new Object();
									obj3.path = array[i2];
									newarr[i2] = obj3;
								}
								obj.imgpost_thumb120 = newarr;
							}
						}
				
					data[index] = obj;
				}
				res.json({'obj':data,'code':1});
				
			}
		}
	});
});

app.post('/post/showmore', function(req,res){
    if (typeof req.body.postid == 'undefined' || typeof req.body.userid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.postid == '' || req.body.userid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var postid = req.body.postid;
	var userid = req.body.userid;
	
	var sql = 'SELECT a.*,b.*,c.likes,d.comment,e.rate,g.path as avatar,g.thumb as avatar_thumb300,g.thumb2 as avatar_thum120, f.imgpost, f.imgpost_thumb, f.imgpost_thumb120 ,group_concat(i.name) as listkey '+
						'FROM tbProduct AS a '+
						'INNER JOIN (SELECT id, username, pickup_location, token FROM tbUser) b ON a.userid = b.id '+
						'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) c ON c.postid = a.id '+
						'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) d ON d.postid = a.id '+
						'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) e ON e.postid = a.id '+
						'LEFT JOIN (SELECT keyword_id,postid FROM tbKeyword_product) h ON h.postid = a.id '+
						'LEFT JOIN (SELECT name,id FROM tbKeyword WHERE status = 1 ) i ON i.id = h.keyword_id '+
						'LEFT JOIN (SELECT belong,group_concat(path) as imgpost, group_concat(thumb) as imgpost_thumb ,group_concat(thumb2) as imgpost_thumb120 FROM tbImage where status = 1 GROUP BY belong) f ON f.belong = a.id '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) g ON g.belong = a.userid '+
						'WHERE a.id = ? '+
						'GROUP BY a.id '+
						'ORDER BY a.createtime DESC';
						
	var sql2 = 'SELECT * FROM tbImage WHERE belong = ? AND status = ?';
	var sql3 = 'select * from tbActivity where userid = ? AND postid = ?';
	
	db.query(sql,postid,function(err,result){
		db.query(sql2,[postid,1],function(err2,result2){
			db.query(sql3,[userid,postid],function(err3,result3){
				if (err){
					res.json({'Message':'Not Found', 'code':404});
				}else {
					if (result.length === 0){
						res.json({'Message':'Result Empty', 'code':405});
					}else {
									var obj = new Object();
									
									obj.productid = postid;
									obj.token = result[0].token;
									obj.userid = result[0].userid;
									obj.username = result[0].username;
									
									if (result[0].meet_in_person === 1){
										obj.meet_in_person = 'Yes';
										obj.pickup_location = result[0].pickup_location;
									}else if (result[0].meet_in_person === 0){
										obj.meet_in_person = 'No';
										obj.pickup_location = null;
									}
									
									if (result3 != ''){
										var i;
										var data = [];
										var rate = [];
										for (i=0;i<result3.length; i++){
											data.push(result3[i].status);
											if (result3[i].status === 1){
												rate.push(result3[i].content);
											}
										}
										obj.statuslike = (in_array(0,data) === true) ? 1 : 0;
										obj.statusrate = (in_array(1,data) === true) ? rate[0] : 0;
									}else {
										obj.statuslike = 0;
										obj.statusrate = 0;
									}
									
									obj.contentMeetInPerson = result[0].contentMeetInPerson;
									obj.location = result[0].location;
									obj.add_to_map = (result[0].add_to_map == 1) ? 'Yes' : 'No'; 
									obj.price = result[0].price;
									if (result[0].shipping === 1){
										obj.shipping = 'Yes';
										obj.country = result[0].country;
									}else if(result[0].shipping === 0){
										obj.shipping = 'No';
										obj.country = null;
									}
									
									obj.numOfLike = (result[0].likes == null) ? 0 : result[0].likes;
									obj.numOfComment = (result[0].comment == null) ? 0 : result[0].comment;
									obj.avgrate = (result[0].rate == null) ? 0 : result[0].rate;
									obj.sold = result[0].sold;
									obj.createtime = result[0].createtime;
									
									obj.keyword = (result[0].listkey == null) ? '' : utf8_decode(result[0].listkey);
									
									obj.avatar = (result[0].avatar == null) ? '/uploads/default.png' : result[0].avatar;
									obj.avatar_300 = (result[0].avatar_thumb300 == null) ? '/uploads/default_300.png' : result[0].avatar_thumb300;
									obj.avatar_120 = (result[0].avatar_thumb120 == null) ? '/uploads/default_120.png' : result[0].avatar_thumb120;
									
									obj.typepost = result[0].type;
									obj.type = result[0].type;
									if (result[0].type == 1){
										var img = [];
										var obj2 = new Object();
										obj2.path = (result[0].description == '') ? '/uploads/new_product_300.png' : result[0].description;
										obj2.width = result[0].width;
										obj2.height = result[0].height;
										obj2.text = result[0].text;
										img[0] = obj2;
										obj.imgpost = img;
									}else {
										obj.description = utf8_decode(result[0].description);
									
										//img original
										if (result[0].imgpost == null){
											var img = [];
											var obj2 = new Object();
											obj2.path = '/uploads/new_product.png';
											img[0] = obj2;
											obj.imgpost = img;
										}else {
											var array = result[0].imgpost.split(',');
											var i2;
											var newarr = [];
											for (i2 = 0;i2 < array.length; i2++){
												var obj3 = new Object();
												obj3.path = array[i2];
												newarr[i2] = obj3;
											}
											obj.imgpost = newarr;
										}
										//img thumb 300
										if (result[0].imgpost_thumb == null){
											var img = [];
											var obj2 = new Object();
											obj2.path = '/uploads/new_product_300.png';
											img[0] = obj2;
											obj.imgpost_thumb = img;
										}else {
											var array = result[0].imgpost_thumb.split(',');
											var i2;
											var newarr = [];
											for (i2 = 0;i2 < array.length; i2++){
												var obj3 = new Object();
												obj3.path = array[i2];
												newarr[i2] = obj3;
											}
											obj.imgpost_thumb = newarr;
										}
										//img thumb 120
										if (result[0].imgpost_thumb120 == null){
											var img = [];
											var obj2 = new Object();
											obj2.path = '/uploads/new_product_120.png';
											img[0] = obj2;
											obj.imgpost_thumb120 = img;
										}else {
											var array = result[0].imgpost_thumb120.split(',');
											var i2;
											var newarr = [];
											for (i2 = 0;i2 < array.length; i2++){
												var obj3 = new Object();
												obj3.path = array[i2];
												newarr[i2] = obj3;
											}
											obj.imgpost_thumb120 = newarr;
										}	
										
									}
									
									res.json({'obj':obj,'code':1});
						}
					}
			});
		});
	});
    }
});



function formatJSONDate(jsonDate) {
  var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
  return date;
}

//list user like for post
app.post('/post/like', function(req,res){
    if (typeof req.body.postid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.postid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var postid = req.body.postid;
	var status = 0;
	var sql = 'SELECT * FROM tbActivity AS a '+
						'LEFT JOIN (SELECT id,username,email,website,country,token,access_location FROM tbUser) b ON b.id = a.userid '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) c ON c.belong = b.id '+
						'WHERE a.postid = ? AND status = ?';
						
						
	db.query(sql, [postid,status], function(err,result){
		if (result == null){
			res.json({'Message':'Not Found', 'code':0});
		}else{
			var i;
			var data = new Array();
			for (i = 0; i < result.length ; i++){
				var obj = new Object();
				obj.userid = result[i].userid;
				obj.postid = result[i].postid;
				obj.content = result[i].content;
				obj.status = result[i].status;
				obj.createtime = result[i].createtime;
				obj.username = result[i].username;
				obj.email = result[i].email;
				obj.website = result[i].website;
				obj.country = result[i].country;
				obj.token = result[i].token;
				obj.avatar = (result[i].path == null) ? '/uploads/default.png' : result[i].path;
				obj.avatar_thumb = (result[i].thumb == null) ? '/uploads/default_300.png' : result[i].thumb;
				obj.avatar_thumb120 = (result[i].thumb2 == null) ? '/uploads/default_120.png' : result[i].thumb2;
				obj.content = result[i].content;
				data[i] = obj;
			}
			res.json({'obj':data,'code':1});
		}
	});
    }
});

//list comment for post
app.post('/post/comment', function(req,res){
    if (typeof req.body.postid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.postid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var postid = req.body.postid;
	var status = 2;
	var sql = 'SELECT a.*,b.*,c.* FROM tbActivity AS a '+
						'LEFT JOIN (SELECT id,username,email,website,country FROM tbUser) b ON b.id = a.userid '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage where status = 0) c ON c.belong = b.id '+
						'WHERE a.postid = ? AND a.status = ?';
						
	db.query(sql, [postid,status], function(err,result){
			if (result == null){
				res.json({'Message':'Not Found', 'code':0});
			}else{
				var i;
				var data = [],data2 = [];
				for (i = 0; i < result.length ; i++){
					var obj = new Object();
					obj.userid = result[i].userid;
					obj.postid = result[i].postid;
					obj.content = utf8_decode(result[i].content);
					obj.status = result[i].status;
					obj.createtime = result[i].createtime;
					obj.username = result[i].username;
					obj.email = result[i].email;
					obj.website = result[i].website;
					obj.country = result[i].country;
				  if (result[i].thumb2 == null){
				  	obj.path = '/uploads/default_120.png';
				  }else {
				  	obj.path = result[i].thumb2;
				  }
					data[i] = obj;
				}
				res.json({'obj':data,'code':1});
			}
		});
    }
});


//post stories
app.post('/pushstories',function(req,res){
    if (typeof req.body.postid == 'undefined' || typeof req.body.userid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.postid == '' || req.body.userid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var userid = req.body.userid;
	var sql = 'select * from tbUser where id = ?';
	var postid = req.body.postid;
	var userids = req.body.struserid; //string userid tag
	var useridsnew = userids.substring(0, userids.length - 1);
	var listuserid = useridsnew.split(",");
	
	db.query(sql,userid,function(err1,rsl1){
		if (rsl1 != ''){
				if (listuserid != ''){
					var data = [];
					var i;
					for (i=0; i<listuserid.length; i++){
							db.query('insert into tbTag (postid,userid) values (?,?)',[postid,listuserid[i]]);
							//push
							db.query(sql,listuserid[i],function(err3,rsl3){
								if (rsl3 != ''){
									if (rsl3[0].tag == 1){
										if (rsl3[0].device_token != ''){
											db.query('select * from tbUser where device_token = ? ',devicetoken,function(err1,rsl1){
												if (rsl1 != ''){
													db.query('update tbUser set numPush = ? where device_token = ? ',[(rsl1[0].numPush+1),devicetoken],function(er,rs){
														pushNotifications(rsl3[0].username,rsl3[0].device_token,6);
													});
												}
											});
										}
									}
								}
							});
							//end push
					}
				}
				res.json({'Message':'Push stories success','code':1});
			
		}
	});
    }
});


//delete post or stories
app.post('/deletepost',function(req,res){
    if (typeof req.body.postid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.postid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var postid = req.body.postid;
	db.query('select * from tbProduct where id = ? ',postid,function(err1,rsl1){
		if (rsl1 == ''){
			res.json({'Message':'Not Found','code':0});
			// db.end();
		}else {
			db.query('delete from tbProduct where id = ?',postid,function(err2,rsl2){
				db.query('delete from tbImage where belong = ? and status = 1',postid,function(err3,rsl3){
					db.query('delete from tbKeyword_product where postid = ?', postid, function(err4,rsl4){
						db.query('delete from tbActivity where postid = ?',postid, function(err5,rsl5){
							res.json({'Message':'Success!','code':1});
						});
					});
				});
			});
		}
	});
    }
});



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



function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
// 
function validateEmail(email)  
{  
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
	if(email.value.match(mailformat)){  
		return true;  
	}else {  
		alert("You have entered an invalid email address!");  
		return false;  
	}  
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



function pushNotifications(username,device_token,type){
	var apn = require('apn');
	var options = {
	    "passphrase": "12345687",
	    "production": true
	  };
	
	var apnConnection = new apn.Connection(options);
	var myDevice = new apn.Device(device_token);
	var note = new apn.Notification();
	
	
	db.query('select * from tbUser where device_token = ? ',device_token,function(err,rsl){
	
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = (rsl == '') ? 0 : rsl[0].numPush;
		//note.sound = "ping.aiff";
		note.sound = "default";
		
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
			
		
		//note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
		note.payload = {'messageFrom': 'Caroline'};
		
		apnConnection.pushNotification(note, myDevice);
		
		// db.end();
	});
	
}


};