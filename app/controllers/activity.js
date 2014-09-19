module.exports.controller = function(app,db) {
var geocoder = require('geocoder');	
//SHOW ALL ACTIVITY FOR USER
app.post('/allactivity',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
        var token = req.body.token;
        var sql1 = 'SELECT * FROM tbUser WHERE token = ? ';

        var sql2 =  'SELECT b.useractivity, b.content, b.status, b.postid, a.description,a.imgstories_120,a.type, b.createtime, c.*, '+
                    'd.path as avatar, d.thumb as avatar_thumb, d.thumb2 as avatar_thum120,e.imgpost,e.imgpost_thumb,e.imgpost_thumb120 '+
                    'FROM tbProduct AS a '+
                    'INNER JOIN (SELECT userid as useractivity,postid,content,status,createtime FROM tbActivity) b ON b.postid = a.id '+
                    'LEFT JOIN (SELECT id,username,email,phone,country,token FROM tbUser) c ON c.id = b.useractivity '+
                    'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) d ON d.belong = b.useractivity '+
                    'LEFT JOIN (SELECT group_concat(path) as imgpost, group_concat(thumb) as imgpost_thumb, group_concat(thumb2) as imgpost_thumb120, belong FROM tbImage WHERE status = 1 GROUP BY belong) e ON e.belong = a.id '+
                    'WHERE a.userid = ? '+
                    'ORDER BY b.createtime DESC';						

        db.query(sql1,token,function(err1,result1){	
                if (err1){
                        res.json({'Message':'Error SQL','code':0});
                }else {
                        if (result1 == ''){
                                res.json({'Message':'This token is incorrect or not exist','code':0});
                        }else {
                                db.query(sql2,result1[0].id,function(err2,result2){
                                if (result2.length == 0){
                                        res.json({'Message':'Not Found','code':0});
                                }else {
                                        var i;
                                        var data = [];
                                        for(i = 0;i<result2.length; i++){
                                                if (result2[i].postid != null){
                                                        // res.json({'Message':'No result','code':0});
                                                // }else {
                                                        var obj = new Object();
                                                        obj.userid = result2[i].useractivity;
                                                        obj.username = result2[i].username;
                                                        obj.avatar = (result2[i].avatar == null) ? '/uploads/default.png': result2[i].avatar;
                                                        obj.avatar_thumb = (result2[i].avatar_thumb == null) ? '/uploads/default.png': result2[i].avatar_thumb;
                                                        obj.avatar_thumb120 = (result2[i].avatar_thumb120 == null) ? '/uploads/default.png': result2[i].avatar_thumb120;
                                                        obj.postid = result2[i].postid;
                                                        obj.description = result2[i].description;
                                                        switch (result2[i].status) {
                                                                case 0:
                                                                        obj.status = 'like';
                                                                        break;
                                                                case 1:
                                                                        obj.status = 'rate';
                                                                        break;
                                                                case 2:
                                                                        obj.status = 'comment';
                                                                        break;
                                                                case 3:
                                                                        obj.status = 'buy';
                                                                        break;
                                                                case 4:
                                                                        obj.status = 'unlike';
                                                                        break;
                                                        }
                                                        obj.content = utf8_decode(result2[i].content);
                                                        obj.createtime = result2[i].createtime;

                                                        obj.type = result2[i].type;
                                                        if (result2[i].type == 1){
                                                                        var img = [],img2 = [];
                                                                        var obj2 = new Object(),obj21 = new Object();
                                                                        obj2.path = (result2[i].description == '') ? '/uploads/new_product.png' : result2[i].description;
                                                                        obj21.path = (result2[i].imgstories_120 == '') ? '/uploads/new_product_300.png' : result2[i].imgstories_120;
                                                                        img[0] = obj2;
                                                                        img2[0] = obj21;
                                                                        obj.imgpost = img;
                                                                        obj.imgpost_thumb = img2;
                                                        }else {
                                                                obj.description = utf8_decode(result2[i].description);

                                                                //img original
                                                                if (result2[i].imgpost == null){
                                                                        var img = [];
                                                                        var obj2 = new Object();
                                                                        obj2.productid = result2[i].postid;
                                                                        obj2.path = '/uploads/new_product.png';
                                                                        img[0] = obj2;
                                                                        obj.imgpost = img;
                                                                }else {
                                                                        var array = result2[i].imgpost.split(',');
                                                                        var i2;
                                                                        var newarr = [];
                                                                        for (i2 = 0;i2 < array.length; i2++){
                                                                                var obj3 = new Object();
                                                                                obj3.productid = result2[i].postid;
                                                                                obj3.path = array[i2];
                                                                                newarr[i2] = obj3;
                                                                        }
                                                                        obj.imgpost = newarr;
                                                                }
                                                                //img thumb 300
                                                                if (result2[i].imgpost_thumb == null){
                                                                        var img = [];
                                                                        var obj2 = new Object();
                                                                        obj2.productid = result2[i].postid;
                                                                        obj2.path = '/uploads/new_product.png';
                                                                        img[0] = obj2;
                                                                        obj.imgpost_thumb = img;
                                                                }else {
                                                                        var array2 = result2[i].imgpost_thumb.split(',');
                                                                        var i3;
                                                                        var newarr = [];
                                                                        for (i3 = 0;i3 < array2.length; i3++){
                                                                                var obj3 = new Object();
                                                                                obj3.productid = result2[i].postid;
                                                                                obj3.path = array2[i3];
                                                                                newarr[i3] = obj3;
                                                                        }
                                                                        obj.imgpost_thumb = newarr;
                                                                }
                                                                //img thumb 120
                                                                if (result2[i].imgpost_thumb120 == null){
                                                                        var img = [];
                                                                        var obj2 = new Object();
                                                                        obj2.productid = result2[i].postid;
                                                                        obj2.path = '/uploads/new_product.png';
                                                                        img[0] = obj2;
                                                                        obj.imgpost_thumb120 = img;
                                                                }else {
                                                                        var array3 = result2[i].imgpost_thumb120.split(',');
                                                                        var i4;
                                                                        var newarr = [];
                                                                        for (i4 = 0;i4 < array3.length; i4++){
                                                                                var obj3 = new Object();
                                                                                obj3.productid = result2[i].postid;
                                                                                obj3.path = array3[i4];
                                                                                newarr[i4] = obj3;
                                                                        }
                                                                        obj.imgpost_thumb120 = newarr;
                                                                }
                                                        }
                                                        /*************/
                                                        data[i] = obj;
                                                        /*************/
                                                }
                                        }
                                        res.json({'obj':data,'code':1});
                                }
                        });
                        }
                }	
        });
    }
		
});	


//order latest button
app.post('/orderbutton',function(req,res){
	var deviceid = req.body.deviceid;
	if (typeof req.body.userid != "undefined"){
		var userid = req.body.userid;
		db.query('select * from tbDevice where deviceid = ? ',deviceid,function(err1,rsl1){
			db.query('select * from tbUser where id = ? ',userid,function(err,rsl){
				var order;
				if (rsl1 == ''){
					order = 1;
				}else {
					order = rsl1[0].order;
				}
				var minded_purchase = (rsl == '') ? 0 : rsl[0].latest_like_minded;
				var friend_purchase = (rsl == '') ? 0 : rsl[0].latest_friend_purchase;
				var nearby_purchase = (rsl == '') ? 0 : rsl[0].latest_nearby_purchase;
				res.json({'order':order,'code':1,'minded_purchase':minded_purchase,'friend_purchase':friend_purchase,'nearby_purchase':nearby_purchase});
			});
		});
	}else {
		db.query('select * from tbDevice where deviceid = ? ',deviceid,function(err1,rsl1){
			var order;
			if (rsl1 == ''){
				order = 1;
			}else {
				order = rsl1[0].order;
			}
			var minded_purchase = 0;
			var friend_purchase = 0;
			var nearby_purchase = 0;
			res.json({'order':order,'code':1,'minded_purchase':minded_purchase,'friend_purchase':friend_purchase,'nearby_purchase':nearby_purchase});
		});
	}
		
	
});

	
//show the newest follower	
app.post('/newfollower',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT * FROM tbFollow as a '+
						 'LEFT JOIN (SELECT id AS user_follow_id,username,avatar AS avatarid,token, email, country, phone FROM tbUser) b ON b.user_follow_id = a.user_follow '+
						 'LEFT JOIN (SELECT id AS imgid,path FROM tbImage) c ON c.imgid = b.avatarid '+
						 'WHERE a.userid = ? AND a.status = 1 '+
						 'ORDER BY a.createtime DESC '+
						 'LIMIT 1';
						 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.user_follow_id = rsl2[0].user_follow_id;
					obj.username = rsl2[0].username;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	
	
//show the newest following comment
app.post('/followingcomment', function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT * FROM tbFollow as a '+
						 'LEFT JOIN (SELECT id AS user_follow_id,username,avatar AS avatarid,token, email, country, phone FROM tbUser) b ON b.user_follow_id = a.user_follow '+
						 'LEFT JOIN (SELECT id AS imgid,path FROM tbImage) c ON c.imgid = b.avatarid '+
						 'LEFT JOIN (SELECT postid,userid,content,status FROM tbActivity) d ON d.userid = a.user_follow '+
						 'LEFT JOIN (SELECT id,description FROM tbProduct) e ON e.id = d.postid '+
						 'WHERE a.userid = ? AND a.status = 0 AND d.status = 2 '+
						 'ORDER BY a.createtime DESC '+
						 'LIMIT 1';
	 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.user_follow_id = rsl2[0].user_follow_id;
					obj.username = rsl2[0].username;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					obj.content = utf8_decode(rsl2[0].conttent);
					obj.postid = rsl2[0].postid;
					obj.description = rsl2[0].description;
					
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	

//show the newest following like
app.post('/followinglike', function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT * FROM tbFollow as a ' + 
						 'LEFT JOIN (SELECT id AS user_follow_id,username,avatar AS avatarid,token, email, country, phone FROM tbUser) b ON b.user_follow_id = a.user_follow '+
						 'LEFT JOIN (SELECT id AS imgid,path FROM tbImage) c ON c.imgid = b.avatarid '+
						 'LEFT JOIN (SELECT postid,userid,content,status FROM tbActivity) d ON d.userid = a.user_follow '+
						 'LEFT JOIN (SELECT id,description FROM tbProduct) e ON e.id = d.postid '+
						 'WHERE a.userid = ? AND a.status = 0 AND d.status = 0 '+
						 'ORDER BY a.createtime DESC '+
						 'LIMIT 1';
						 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.user_follow_id = rsl2[0].user_follow_id;
					obj.username = rsl2[0].username;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					obj.postid = rsl2[0].postid;
					obj.description = rsl2[0].description;
					
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	
	
//show the newest info user purcharse prodduct of user logged
app.post('/newpurchase', function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT b.userbuy,b.postid,a.description,b.createtime,c.username,c.email,c.phone,c.country,c.token,d.path FROM tbProduct AS a ' +
						 'LEFT JOIN (SELECT userid as userbuy,postid,status,createtime FROM tbActivity) b ON b.postid = a.id ' + 
						 'LEFT JOIN (SELECT id,username,email,phone,country,token FROM tbUser) c ON c.id = b.userbuy ' + 
						 'LEFT JOIN (SELECT belong,status,path FROM tbImage WHERE status = 0) d ON d.belong = b.userbuy ' +
						 'WHERE a.userid = ? AND b.status = 3 ' + 
						 'ORDER BY b.createtime DESC '+
						 'LIMIT 1';
						 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.userbuy_id = rsl2[0].userbuy;
					obj.username = rsl2[0].username;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					obj.postid = rsl2[0].postid;
					obj.description = rsl2[0].description;
					
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	

///show the newest info user comment prodduct of user logged
app.post('/newcomment', function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT b.userbuy,b.postid,a.description,b.content,b.createtime,c.username,c.email,c.phone,c.country,c.token,d.path FROM tbProduct AS a '+
						 'LEFT JOIN (SELECT userid as userbuy,postid,status,content,createtime FROM tbActivity) b ON b.postid = a.id '+
						 'LEFT JOIN (SELECT id,username,email,phone,country,token FROM tbUser) c ON c.id = b.userbuy '+
						 'LEFT JOIN (SELECT belong,status,path FROM tbImage WHERE status = 0) d ON d.belong = b.userbuy '+
						 'WHERE a.userid = ? AND b.status = 2 '+
						 'ORDER BY b.createtime DESC '+
						 'LIMIT 1';
						 
						 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.userbuy_id = rsl2[0].userbuy;
					obj.username = rsl2[0].username;
					me;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					obj.postid = rsl2[0].postid;
					obj.description = rsl2[0].description;
					obj.content = rsl2[0].content;
					
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	

//show the newest info user like prodduct of user logged
app.post('/newlike', function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql = 'select * from tbUser where token =?';
	var sql2 = 'SELECT b.userbuy,b.postid,a.description,b.createtime,c.username,c.email,c.phone,c.country,c.token,d.path FROM tbProduct AS a '+
						 'LEFT JOIN (SELECT userid as userbuy,postid,status,createtime FROM tbActivity) b ON b.postid = a.id '+
						 'LEFT JOIN (SELECT id,username,email,phone,country,token FROM tbUser) c ON c.id = b.userbuy '+
						 'LEFT JOIN (SELECT belong,status,path FROM tbImage WHERE status = 0) d ON d.belong = b.userbuy '+
						 'WHERE a.userid = ? AND b.status = 0 '+
						 'ORDER BY b.createtime DESC '+
						 'LIMIT 1';
						 
						 
	db.query(sql, token, function(err,rsl1){
		if (rsl1 == '' || rsl1 == null){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query(sql2, rsl1[0].id, function(err2,rsl2){
				if (rsl2.length == 0){
					res.json({'Message':'Not Found','code':0});
				}else {
					var obj = new Object();
					obj.userbuy_id = rsl2[0].userbuy;
					obj.username = rsl2[0].username;
					obj.email = rsl2[0].email;
					obj.country = rsl2[0].country;
					obj.phone = rsl2[0].phone;
					obj.token = rsl2[0].token;
					if (rsl2[0].path == null || rsl2[0].path == ''){
						obj.avatar = '/uploads/default.png';
					}else {
						obj.avatar = rsl2[0].path;
					}
					obj.postid = rsl2[0].postid;
					obj.description = rsl2[0].description;
					
					res.json({'obj':obj,'code':1});
				}
			});
		}
	});
    }
});	


function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

//save latest like minded,latest_friend_purchase,latest_nearby_purchase
app.post ('/savelast',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var type = req.body.type;
	var status = req.body.status;
	var token = req.body.token;
	console.log(type,status,token);
	var sql = 'select * from tbUser where token = ?';
	
	db.query(sql, token, function(err,rsl){
		if (rsl == ''){
			res.json({'Message':'This token is incorrect or not exist','code':0});
		}else {
			if (type == 0){
				if (status == 1) {
					db.query('UPDATE tbUser SET latest_like_minded = 1, time_like_minded = ?  WHERE token = ? ',[getDateTime(),token],function(er1,rs1){
						res.json({'Message':'OK','code':1});
					});
				}else {
					db.query('UPDATE tbUser SET latest_like_minded = 0, time_like_minded = ?  WHERE token = ? ',[getDateTime(),token],function(er2,rs2){
						res.json({'Message':'OK','code':1});
					});
				}
			}
			if (type == 1){
				if (status == 1) {
					db.query('UPDATE tbUser SET latest_friend_purchase = 1, time_friend_purchases = ? WHERE token = ? ',[getDateTime(),token],function(er3,rs3){
						res.json({'Message':'OK','code':1});
					});
				}else {
					db.query('UPDATE tbUser SET latest_friend_purchase = 0, time_friend_purchases = ? WHERE token = ? ',[getDateTime(),token],function(er4,rs4){
						res.json({'Message':'OK','code':1});
					});
				}
			}
			if (type == 2){
				if (status == 1) {
					db.query('UPDATE tbUser SET latest_nearby_purchase = 1, time_nearby_purchases = ? WHERE token = ?',[getDateTime(),token],function(er5,rs5){
						res.json({'Message':'OK','code':1});
					});
				}else {
					db.query('UPDATE tbUser SET latest_nearby_purchase = 0, time_nearby_purchases = ? WHERE token = ?',[getDateTime(),token],function(er6,rs6){
						res.json({'Message':'OK','code':1});
					});
				}
			}
		}
	});
    }
});


app.post('/latestsession',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sessionid = req.body.sessionid;
	var type = req.body.type;
	console.log(sessionid,token,type);
	
	db.query('select id,latest_like_minded,latest_friend_purchase,latest_nearby_purchase from tbUser where token=?', token, function(err,rsl){
		if (rsl == ''){
			res.json({'Message':'This token is incorrect or not exist','code':0});
		}else {
			
			switch (type) {
				case '0': // 0: click like_minded button
					db.query('INSERT INTO tbLatest_action (`sessionid`,`userid`,`type`,`status`) values (?,?,?,?) ',[sessionid,rsl[0].id,1,rsl[0].latest_like_minded],function(er1,rs1){
							res.json({'Message':'OK','code':1});
					});
					break;
				case '1': // 1: click firend_purchase button
					db.query('INSERT INTO tbLatest_action (sessionid,userid,type,`status`) values (?,?,?,?) ',[sessionid,rsl[0].id,2,rsl[0].latest_friend_purchase],function(er2,rs2){
							res.json({'Message':'OK','code':1});
					});
					break;
				case '2': // 2: click nearby_purchase button
					db.query('INSERT INTO tbLatest_action (sessionid,userid,type,`status`) values (?,?,?,?) ',[sessionid,rsl[0].id,3,rsl[0].latest_nearby_purchase],function(er3,rs3){
							res.json({'Message':'OK','code':1});
					});
					break;
			}
		}
	});
    }
});


//show 3 latest like minded people’s purchase
app.post('/latest_like_minded',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	console.log({'likeminded':token});
	var sql1 = 'select * from tbUser where token = ?';
	
	var sql = 'select c.*,d.likes,e.comment,f.rate,h.*,i.avatar,i.avatar_thumb,i.avatar_thumb120, g.imgpost, g.imgpost_thumb, g.imgpost_thumb120 '+
						'from tbKeyword_user as a '+
						'LEFT JOIN (select userid,keyword_id from tbKeyword_user) b ON b.keyword_id = a.keyword_id '+
						'INNER join (select * from tbProduct) c ON c.userid = b.userid '+
						'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) d ON d.postid = c.id '+
						'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) e ON e.postid = c.id '+
						'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) f ON f.postid = c.id '+
						'LEFT JOIN (SELECT group_concat(path) as imgpost, group_concat(thumb) as imgpost_thumb, group_concat(thumb2) as imgpost_thumb120,belong FROM tbImage where status = 1 GROUP BY belong) g ON g.belong = c.id '+
						'LEFT JOIN (SELECT * FROM tbActivity) j ON j.postid = c.id '+
						'inner JOIN (SELECT id as user_id,username,email,country,phone,token FROM tbUser) h ON h.user_id = j.userid '+
						'LEFT JOIN (SELECT belong,path as avatar,thumb as avatar_thumb,thumb2 as avatar_thumb120 FROM tbImage WHERE status = 0) i ON i.belong = h.user_id '+
						'WHERE a.userid = ? and b.userid <> ? and j.status = 3 and c.type = 0 '+
						'GROUP BY c.id '+
						'ORDER BY c.createtime DESC '+
						'LIMIT 3';
	
						 
	db.query(sql1,token,function(err1,rsl1){
		if (rsl1 == ''){
			var data = [];
			res.json({'obj':data,'code':1});
		}else {
				db.query(sql, [rsl1[0].id,rsl1[0].id], function (err2,rsl2){
					if (rsl2.length == 0){
								res.json({'Message':'Not Found','code':0});
							}else {
								var i;
								var data = [];
								for(i = 0;i<rsl2.length; i++){
									obj = new Object();
									obj.userid = rsl2[i].userid;
									obj.username = rsl2[i].username;
									obj.avatar = (rsl2[i].avatar == null) ? '/uploads/default.png' : rsl2[i].avatar;
									obj.avatar_300 = (rsl2[i].avatar_thumb == null) ? '/uploads/default_300.png' : rsl2[i].avatar_thumb;
									obj.avatar_120 = (rsl2[i].avatar_thumb120 == null) ? '/uploads/default_120.png' : rsl2[i].avatar_thumb120;
									obj.productid = rsl2[i].id;
									obj.description = rsl2[i].description;
									obj.createtime = rsl2[i].createtime;
									obj.token = rsl2[i].token;
									
									obj.typepost = rsl2[i].type;
									obj.type = rsl2[i].type;
									if (rsl2[i].type == 1){
											var img = [];
											var img2 = [];
											var obj2 = new Object(),obj3 = new Object();
											obj2.path = (rsl2[i].description == '') ? '/uploads/new_product_300.png' : rsl2[i].description;
											obj2.height = rsl2[i].height;
											obj3.path = (rsl2[i].imgstories_120 == '') ? '/uploads/new_product_120.png' : rsl2[i].imgstories_120;
											obj3.height = 120;
											img[0] = obj2;
											img2[0] = obj3;
											obj.imgpost = img;
											obj.imgpost_thumb = img2;
									}else {
										obj.description = rsl2[i].description;
									//img original
											if (rsl2[i].imgpost == null){
												var img = [];
												var obj2 = new Object();
												obj2.productid = rsl2[i].id;
												obj2.path = '/uploads/new_product.png';
												img[0] = obj2;
												obj.imgpost = img;
											}else {
												var array = rsl2[i].imgpost.split(',');
												var i2;
												var newarr = [];
												for (i2 = 0;i2 < array.length; i2++){
													var obj3 = new Object();
													obj3.productid = rsl2[i].id;
													obj3.path = array[i2];
													newarr[i2] = obj3;
												}
												obj.imgpost = newarr;
											}
											
											//img thumb 300
											if (rsl2[i].imgpost_thumb == null){
												var img = [];
												var obj2 = new Object();
												obj2.productid = rsl2[i].id;
												obj2.path = '/uploads/new_product_300.png';
												img[0] = obj2;
												obj.imgpost_thumb = img;
											}else {
												var array = rsl2[i].imgpost_thumb.split(',');
												var i2;
												var newarr = [];
												for (i2 = 0;i2 < array.length; i2++){
													var obj3 = new Object();
													obj3.productid = rsl2[i].id;
													obj3.path = array[i2];
													newarr[i2] = obj3;
												}
												obj.imgpost_thumb = newarr;
											}
											
											//img thum 120
											if (rsl2[i].imgpost_thumb120 == null){
												var img = [];
												var obj2 = new Object();
												obj2.productid = rsl2[i].id;
												obj2.path = '/uploads/new_product_120.png';
												img[0] = obj2;
												obj.imgpost_thumb120 = img;
											}else {
												var array = rsl2[i].imgpost_thumb120.split(',');
												var i2;
												var newarr = [];
												for (i2 = 0;i2 < array.length; i2++){
													var obj3 = new Object();
													obj3.productid = rsl2[i].id;
													obj3.path = array[i2];
													newarr[i2] = obj3;
												}
												obj.imgpost_thumb120 = newarr;
											}
										}
									
									obj.avgrate = (rsl2[i].rate == null) ? 0 : rsl2[i].rate.toFixed(2);
									obj.numOfLike = (rsl2[i].likes == null) ? 0 : rsl2[i].likes;
									obj.numOfComment = (rsl2[i].comment == null) ? 0 : rsl2[i].comment;
									
									obj.keyword = (rsl2[i].name == null) ? '' : rsl2[i].name;
									
									data[i] = obj;
								}
								res.json({'obj':data,'code':1});
							}
					});
			}
		});
    }
});


//show 3 latest friend’s purchase 
app.post('/latest_friend_purchase',function(req,res){
    if (typeof req.body.token == 'undefined'){
            res.json({'Message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'Message':'This token is incorrect','code':0});
    }else {
	var token = req.body.token;
	var sql1 = 'select * from tbUser where token = ?';
	var sql = 'SELECT a.user_follow, g.username, b.id, b.description, b.location, b.lat, b.lon, b.price, b.country, b.type, b.createtime, d.likes, e.comment, f.rate, h.path as avatar,h.thumb as avatar_thumb,h.thumb2 as avatar_thumb120,c.imgpost,c.imgpost_thumb,c.imgpost_thumb120 '+
						'FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) AS a '+
						'INNER JOIN (SELECT * FROM tbProduct) b ON b.userid = a.user_follow '+
						'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) d ON d.postid = b.id '+
						'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) e ON e.postid = b.id '+
						'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) f ON f.postid = b.id '+
						'LEFT JOIN (SELECT group_concat(path) as imgpost,group_concat(thumb) as imgpost_thumb,group_concat(thumb2) as imgpost_thumb120,belong,status FROM tbImage WHERE status= 1 GROUP BY belong) c ON c.belong = b.id '+
						'LEFT JOIN (SELECT status,postid,userid FROM tbActivity) i ON i.postid = b.id '+
						'INNER JOIN (SELECT username,id FROM tbUser) g ON g.id = i.userid '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) h ON h.belong = g.id '+
						'WHERE  i.status = 3 and b.type = 0 '+
						'GROUP BY b.id '+
						'ORDER BY b.createtime DESC '+
						'LIMIT 3';
	
	db.query(sql1,token,function(err1,rsl1){
		if (rsl1 == ''){
			var data = [];
			res.json({'obj':data,'code':1});
		}else {
				db.query(sql,rsl1[0].id,function(err,rsl){
						if (rsl == ''){
							res.json({'Message':'No result','code':0});
						}else {
							var i;
							var data = [];
							for(i = 0; i < rsl.length ; i++){
								obj = new Object();
								obj.userid = rsl[i].user_follow;
								obj.username = rsl[i].username;
								obj.avatar = (rsl[i].avatar == null) ? '/uploads/default.png' : rsl[i].avatar;
								obj.avatar_thumb = (rsl[i].avatar_thumb == null) ? '/uploads/default.png' : rsl[i].avatar_thumb;
								obj.avatar_thumb120 = (rsl[i].avatar_thumb120 == null) ? '/uploads/default.png' : rsl[i].avatar_thumb120;
								obj.productid = rsl[i].id;
								obj.description = rsl[i].description;
								obj.content = rsl[i].content;
								obj.createtime = rsl[i].createtime;
								obj.avgrate = (rsl[i].rate == null) ? 0 : rsl[i].rate.toFixed(2);
								obj.numOfLike = (rsl[i].likes == null) ? 0 : rsl[i].likes;
								obj.numOfComment = (rsl[i].comment == null) ? 0 : rsl[i].comment;
								
								
								obj.type = rsl[i].type;
								if (rsl[i].type == 1){
										var img = [];
										var img2 = [];
										var obj2 = new Object(),obj3 = new Object();
										obj2.path = (rsl[i].description == '') ? '/uploads/new_product.png' : rsl[i].description;
										obj3.path = (rsl[i].description == '') ? '/uploads/new_product.png' : rsl[i].description;
										img[0] = obj2;
										img2[0] = obj3;
										obj.imgpost = img;
										obj.imgpost_thumb = img2;
								}else {
									obj.description = rsl[i].description;
									
									//img original
										if (rsl[i].imgpost == null){
											var img = [];
											var obj2 = new Object();
											obj2.productid = rsl[i].postid;
											obj2.path = '/uploads/new_product.png';
											img[0] = obj2;
											obj.imgpost = img;
										}else {
											var array = rsl[i].imgpost.split(',');
											var i2;
											var newarr = [];
											for (i2 = 0;i2 < array.length; i2++){
												var obj3 = new Object();
												obj3.productid = rsl[i].postid;
												obj3.path = array[i2];
												newarr[i2] = obj3;
											}
											obj.imgpost = newarr;
										}
										
										//img thumb 300
										if (rsl[i].imgpost_thumb == null){
											var img = [];
											var obj2 = new Object();
											obj2.productid = rsl[i].postid;
											obj2.path = '/uploads/new_product.png';
											img[0] = obj2;
											obj.imgpost_thumb = img;
										}else {
											var array = rsl[i].imgpost_thumb.split(',');
											var i3;
											var newarr = [];
											for (i3 = 0;i3 < array.length; i3++){
												var obj3 = new Object();
												obj3.productid = rsl[i].postid;
												obj3.path = array[i3];
												newarr[i3] = obj3;
											}
											obj.imgpost_thumb = newarr;
										}
										
										//img thumb 120
										if (rsl[i].imgpost_thumb120 == null){
											var img = [];
											var obj2 = new Object();
											obj2.productid = rsl[i].postid;
											obj2.path = '/uploads/new_product.png';
											img[0] = obj2;
											obj.imgpost_thumb120 = img;
										}else {
											var array = rsl[i].imgpost_thumb120.split(',');
											var i4;
											var newarr = [];
											for (i4 = 0;i4 < array.length; i4++){
												var obj3 = new Object();
												obj3.productid = rsl[i].postid;
												obj3.path = array[i4];
												newarr[i4] = obj3;
											}
											obj.imgpost_thumb120 = newarr;
										}
								}
								data[i] = obj;
						}
						res.json({'obj':data,'code':1});
					}
				});
		}
	}); 
    }
});


//show 3 latest nearby purchases 
app.post('/latest_nearby_purchase',function(req,res){
    if (typeof req.body.userid == 'undefined'){
            res.json({'Message':'Not Found','code':0});
    }else if (req.body.userid == ''){
            res.json({'Message':'Not Found','code':0});
    }else {
 	var lat1 = req.body.lat;
 	var lon1 = req.body.lon;
	var userid = req.body.userid;
	var deviceid = req.body.deviceid;
	
 	var sql = 'SELECT a.*,f.username,f.token,d.*, b.*  FROM tbProduct AS a '+
						'LEFT JOIN (SELECT group_concat(path) as imgpost, group_concat(thumb) as imgpost_thumb, group_concat(thumb2) as imgpost_thumb120,belong FROM tbImage WHERE status= 1 GROUP BY belong) b ON b.belong = a.id '+
						'LEFT JOIN (SELECT status,postid,userid FROM tbActivity) e ON e.postid = a.id '+
						'INNER JOIN (SELECT id,username,token FROM tbUser) f ON f.id = e.userid '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) d ON d.belong = f.id '+
						'WHERE e.status = 3 and a.type = 0 '+
						'GROUP BY a.id '+
						'ORDER BY a.createtime DESC';
	
	db.query(sql,function(err,rsl){
		var data = [];
		if (rsl != ''){
			var i;
			for (i=0;i<rsl.length;i++){
				var lat2 = rsl[i].lat;
				var lon2 = rsl[i].lon;
				if (calcDistance(lat1,lon1,lat2,lon2) < 3){ //km
					var obj = new Object();
					obj.productid = rsl[i].id;
					obj.distance = calcDistance(lat1,lon1,lat2,lon2);
					obj.description = rsl[i].description;
					obj.location = rsl[i].location;
					obj.username = rsl[i].username;
					obj.avatar =  (rsl[i].thumb == null) ? '/uploads/default.png' : rsl[i].thumb;
					obj.avatar_thumb =  (rsl[i].thumb2 == null) ? '/uploads/default_thumb120.png' : rsl[i].thumb2;
					obj.token = rsl[i].token;
					obj.userid = rsl[i].userid;
					obj.price = rsl[i].price;
					obj.sold = rsl[i].sold;
					obj.createtime = rsl[i].createtime;
					
					if (rsl[i].imgpost == null){
						var img = [];
						var obj2 = new Object();
						obj2.path = '/uploads/new_product.png';
						img[0] = obj2;
						obj.imgpost = img;
					}else {
						var array = rsl[i].imgpost.split(',');
						var i3;
						var newarr = [];
						for (i3 = 0;i3 < array.length; i3++){
							var obj3 = new Object();
							obj3.path = array[i3];
							newarr[i3] = obj3;
						}
						obj.imgpost = newarr;
					}
					
					if (rsl[i].imgpost_thumb == null){
						var img = [];
						var obje2 = new Object();
						obje2.path = '/uploads/new_product.png';
						img[0] = obje2;
						obj.imgpost_thumb = img;
					}else {
						var array = rsl[i].imgpost_thumb.split(',');
						var i4;
						var newarr = [];
						for (i4 = 0;i4 < array.length; i4++){
							var obje3 = new Object();
							obje3.path = array[i4];
							newarr[i4] = obje3;
						}
						obj.imgpost_thumb = newarr;
					}
					
					if (rsl[i].imgpost_thumb120 == null){
						var img = [];
						var obje2 = new Object();
						obje2.path = '/uploads/new_product.png';
						img[0] = obje2;
						obj.imgpost_thumb120 = img;
					}else {
						var array = rsl[i].imgpost_thumb120.split(',');
						var i5;
						var newarr = [];
						for (i5 = 0;i5 < array.length; i5++){
							var obje3 = new Object();
							obje3.path = array[i5];
							newarr[i5] = obje3;
						}
						obj.imgpost_thumb120 = newarr;
					}
					
				
					data.push(obj);
				}
			}
			
			//save device
			geocoder.reverseGeocode( lat1, lon1, function ( err, data ) {
			  var location = data.results[0].formatted_address;
			  db.query('select * from tbDevice where deviceid = ? ',deviceid,function(er,rs){
						if (rs != ''){
							db.query('insert into tbUser_device (user_id,device_id,lat,lon,location) values (?,?,?,?,?) ',[userid,rs[0].id,lat1,lon1,location]);
						}
					});
				});
			//end save
				
		}
		
			data.sort(function(a,b) { 
				return parseFloat(a.distance) - parseFloat(b.distance); 
			});
			
			var newarr = [];
			if (data.length != 0){
				newarr[0] = data[0];
				newarr[1] = data[1];
				newarr[2] = data[2];
			}
			res.json({'obj':newarr,'code':1});
	});
    }
});

//function save totalview, pageview per session
app.post('/savepageview',function(req,res){
    if (typeof req.body.userid == 'undefined'){
            res.json({'Message':'Not Found','code':0});
    }else if (req.body.userid == ''){
            res.json({'Message':'Not Found','code':0});
    }else {
	var sessionid = req.body.sessionid;
	var userid = req.body.userid;
	var starttime = req.body.starttime;
	var endtime = req.body.endtime;
	var type = req.body.type;
	
	console.log(type,starttime,endtime,userid,sessionid);
	
	var totaltime = calculatortime(starttime,endtime);
	
	db.query('select * from tbUser where id = ? ',userid,function(err,rsl){
		if (rsl == ''){
			res.json({'Message':'Not Found','code':0});
		}else {
			db.query('insert into tbPageview (sessionid,userid,type,totaltime) values (?,?,?,?) ',[sessionid,userid,type,totaltime],function(err1,rsl1){
				res.json({'Message':'Success!','code':1});
			});
		}
	});
    }
});

function calculatortime(time1,time2){
	var starttime = new Date(time1);
	var endtime = new Date(time2);
	var h1 = starttime.getHours();
	var n1 = starttime.getMinutes();
	var s1 = starttime.getSeconds();
	
	var h2 = endtime.getHours();
	var n2 = endtime.getMinutes();
	var s2 = endtime.getSeconds();
	
	var totals1 = h1*3600+n1*60+s1;
	var totals2 = h2*3600+n2*60+s2;
	return totals2-totals1;
}




function calcDistance(lat1,lon1,lat2,lon2){	  
  var R = 6371; // km
  var dLat = toRad(lat2-lat1); 
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distance = R * c;
    
  return distance;
}

function toRad(Value) {
  return Value * Math.PI / 180;
}

function sortArrOfObjectsByParam(arrToSort, strObjParamToSortBy, sortAscending){
  if(sortAscending == undefined) sortAscending = true;  // default to true
  if(sortAscending) {
    arrToSort.sort(function (a, b) {
        return a[strObjParamToSortBy] > b[strObjParamToSortBy];
    });
  } else {
    arrToSort.sort(function (a, b) {
        return a[strObjParamToSortBy] < b[strObjParamToSortBy];
    });
  }
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

};