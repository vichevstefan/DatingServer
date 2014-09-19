module.exports.controller = function(app,db) {
//creat group
app.post('/group/creatgroup',function(req,res){
	var token = req.body.token,
			name  = utf8_encode(req.body.name),
			caption = utf8_encode(req.body.caption);
			
	var sql = 'select id,token from tbUser where token =? ';
	var sql1 = 'select name from tbGroup where owner = ? ';
	
	db.query(sql,token,function(err1,rsl1){
		if (rsl1 == ''){
			res.json({'Message':'This token is incorrect or not exist','code':404});
			// db.end();
		}else {
			db.query(sql1,rsl1[0].id,function(err2,rsl2){
				var i,
						data = [];
				for (i=0;i<rsl2.length;i++){
					data[i] = rsl2[i].name;
				}
				if (name == ''){
					res.json({'Message':'This name group is empty! Please try again','code':629});
				}else if (in_array(name,data) == true){
					res.json({'Message':'This name group is existed','code':630});
				}else {
					db.query('insert into tbGroup (owner,name,caption) values (?,?,?)',[rsl1[0].id,name,caption],function(err3,rsl3){
						db.query('insert into tbGroup_user (user_id,group_id,status) values (?,?,?)',[rsl1[0].id,rsl3.insertId,2],function(err4,rsl4){
							res.json({'Message':'Create success','code':1, 'groupid':rsl3.insertId});
						});
					});
				}
			});
		}
	});	
});


//add user into group
app.post('/group/request',function(req,res){
    if (typeof req.body.groupid == 'undefined' || typeof req.body.userid == 'undefined'){
            res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == '' || req.body.userid == ''){
            res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var userid = req.body.userid;
	var listuser = userid.split(',');
	var sql = 'SELECT user_id FROM tbGroup_user WHERE group_id = ? ';
	db.query('delete from tbGroup_user where group_id = ? and status <> 2 ',groupid,function(err,rsl){
		if (err){
			res.json({'Message':'Not Found','code':0});
		}else {
			var i;
			if (userid != ''){
				for (i=0;i<listuser.length;i++){
					db.query('insert into tbGroup_user (group_id,user_id,status) values (?,?,?)',[groupid,listuser[i],0],function(err1,rsl){
						if (err1){
							res.json({'Message':'Not success','code':0});
						}else {
							res.json({'Message':'success','code':1});
						}
					});
				}
			}else {
				res.json({'Message':'success','code':1});
			}
		}
	}); 				
    }			
});
	
//accept request group
app.post('/group/acceptrequest',function(req,res){
    if (typeof req.body.groupid == 'undefined' || typeof req.body.userid == 'undefined'){
            res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == '' || req.body.userid == ''){
            res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var userid = req.body.userid;
	var type = req.body.type;
	
	db.query('select * from tbGroup_user where group_id = ? and user_id = ?',[groupid,userid],function(err,rsl){
		if (rsl == ''){
			res.json({'Message':"This User don't have request to this group",'code':0});
		}else {
			if (type == 1){ //accept
				db.query('update tbGroup_user SET status = 1 where group_id = ? and user_id = ?',[groupid,userid],function(err1,rsl1){
					res.json({'Message':"Accept success",'code':1});
				});
			}else if (type == 0){ //reject
				db.query('delete from tbGroup_user where group_id = ? and user_id = ?',[groupid,userid],function(err2,rsl2){
					res.json({'Message':"Reject success",'code':1});
				});
			}
		}
	});
    }
});

//get groupinfo
app.post('/group/info',function(req,res){
    if (typeof req.body.groupid == 'undefined'){
            res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == ''){
            res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var sql = 'SELECT * FROM tbGroup AS a '+
						'LEFT JOIN (SELECT user_id,group_id FROM tbGroup_user) b ON b.group_id = a.id '+
						'LEFT JOIN (SELECT belong,path as photo_group FROM tbImage WHERE status = 2) c ON c.belong = a.id '+
						'LEFT JOIN (SELECT id,username,email,phone,country,token FROM tbUser) d ON d.id = b.user_id '+
						'LEFT JOIN (SELECT belong,path as photo_user FROM tbImage WHERE status = 0) e ON e.belong = b.user_id '+
						'WHERE a.id = ?';
  
	db.query(sql,groupid,function(err,rsl){
		if (rsl == ''){
			res.json({'Message':'No Result','code':0});
		}else {
			var i;
			var data = [];
			for (i=0;i<rsl.length;i++){
				var obj = new Object();
				obj.userid = rsl[i].user_id;
				obj.username = rsl[i].username;
				obj.email = rsl[i].email;
				obj.phone = rsl[i].phone;
				obj.country = rsl[i].country;
				obj.token = rsl[i].token;
				
				if (rsl[i].photo_user == null){
					obj.photo_user = '/uploads/default.png';
				}else {
					obj.photo_user = rsl[i].photo_user;
				}
				data[i] = obj;
			}
			var name_group = utf8_decode(rsl[0].name);
			var description = utf8_decode(rsl[0].caption);
			var photo_group;
			if (rsl[0].photo_group == null){
				photo_group = '/uploads/group.png';
			}else {
				photo_group = rsl[0].photo_group;
			}
			var ownerid = rsl[0].owner;
			res.json({'ownerid':ownerid,'namegroup':name_group,'description':description,'photogroup':photo_group,'numOfMember':rsl.length,'listmember':data,'code':1});
		}
	});
    }
});

//delete group chat
app.post('/deletegroup',function(req,res){
    if (typeof req.body.groupid == 'undefined' || typeof req.body.userid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == '' || req.body.userid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var userid = req.body.userid;
	var sql1 = 'select * from tbGroup where id = ?';
	var sql2 = 'delete from tbGroup where id = ?';
	var sql3 = 'delete from tbGroup_user where group_id = ?';
	
	
	db.query(sql1,groupid,function(err1,rsl1){
		if (rsl1 == ''){
			res.json({'Message':'No result','code':0});
		}else {
			if (rsl1[0].owner != userid){
				res.json({'Message':"You don't have permission!",'code':0});
			}else {
				db.query(sql2,groupid,function(err2,rsl2){
					db.query(sql3,groupid,function(err3,rsl3){
						res.json({'Message':"Delete success",'code':1});
					});
				});
			}
		}
	});
    }
});

//remove a member into group chat
app.post('/removemember',function(req,res){
    if (typeof req.body.groupid == 'undefined' || typeof req.body.userid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == '' || req.body.userid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var userid = req.body.userid;
	var sql1 = 'select * from tbGroup where id = ?';
	var sql2 = 'select * from tbGroup_user where group_id = ? and user_id = ?';
	var sql3 = 'delete from tbGroup_user where group_id = ? and user_id = ?';
	
	db.query(sql1,groupid,function(err1,rsl1){
		if (rsl1 == ''){
			res.json({'Message':'No result','code':0});
		}else {
			db.query(sql2,[groupid,userid],function(err2,rsl2){
				if (rsl2 == ''){
					res.json({'Message':'This user cannot display properties group','code':0});
				}else {
					db.query(sql3,[groupid,userid],function(err3,rsl3){
						res.json({'Message':'Remove success!','code':1});
					});
				}
			});
		}
	});
    }
});

//edit group chat
app.post('/editgroup',function(req,res){
    if (typeof req.body.groupid == 'undefined' || typeof req.body.userid == 'undefined'){
        res.json({'Message':'Not Found','code':0});
    }else if (req.body.groupid == '' || req.body.userid == ''){
        res.json({'Message':'Not Found','code':0});
    }else {
	var groupid = req.body.groupid;
	var userid = req.body.userid;
	var namegroup = req.body.namegroup;
	var description = req.body.description;
	var sql1 = 'select * from tbGroup where id = ? ';
	var sql2 = 'update tbGroup SET name = ?, caption = ? where id = ? ';
	
	db.query(sql1,groupid,function(err1,rsl1){
		if (rsl1 == ''){
			res.json({'Message':'Not Found','code':0});
		}else if (rsl1[0].owner != userid){
			res.json({'Message':"You don't have permission!",'code':0});
		}else {
			db.query(sql2,[namegroup,description,groupid],function(err2,rsl2){
				res.json({'Message':"Edit Success!",'code':1});
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


	
};