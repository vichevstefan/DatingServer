var validator = require('validator');
var md5 = require('MD5');
var path = require('path');
var geocoder = require('geocoder');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user:'',
		pass:''
	}
});

module.exports.controller = function(app,db) {

 /***************REGISTER**************/
///With email//
 app.post('/registerUser', function (req, res) {
      var token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var email = req.body.email,
				  phone = req.body.phone,
				  password = req.body.password,
				  deviceid = req.body.deviceid,
				  confirm = req.body.confirm,
				  device_token = req.body.devicetoken,
				birthday = req.body.birthday,
				latitude = req.body.latitude,
				longitude = req.body.longitude,
				country = req.body.country,
				gender = req.body.gender,
				purpose = req.body.purpose,
				fullname = req.body.fullname;
	  var sex = 0;
			if(gender == 'male'){
				sex = 0;
			}else if(gender == 'female'){
				sex = 1;
			}
			var username = email;
    		 if (email === "" || username === "" || password === "" || confirm === ""){
    			  res.json({'message':'Please enter information into the corresponding box','code':601});
    		  }
    		  else if (validator.isEmail(email) === false) {
    			  res.json({'message':'Email incorrect formats. Please try again!','code':602});
    		  }
    		  else if (username.length < 2  || username.length > 120) {
    		  	res.json({'message':'Username consists 2 to 20 characters!','code':603});
    		  }
    		  else if (password.length < 6) {
    		  	res.json({'message':'Password should consists 6 characters!','code':604});
    		  }
/*    		  else if (password != confirm){
    			  res.json({'message':'Password and confirm password mismatch.','code':605});
    		  }*/
    		  else {
	    		  var rsl = db.query('select * from tbUser where username = ?', username, function(err, result) {
			    	  if (result.length != 0){
			    		  res.json({'message':'This username is already registered.','code':606});
			    	  }
			    	  else {
				    	  var rsl2 = db.query('select * from tbUser where email = ?', email, function(err, result2) {
				    	  	if (result2.length != 0){
					    	 	 res.json({'message':'This email is already registered.','code':607});
			    	 			}
					    	  else {
					    	  	if (err){
						    		 	res.json({'message':'Error','code':608});
							    	}
						    	  else {
							    	  var empty = '';
							    	  if (device_token != ''){	
						    	  		db.query('select * from tbUser where device_token = ?',device_token,function(err4,rsl4){
											if (err4 != '')
											{
												console.log('rs',err4);
											}else if (rsl4 != ''){
						    	  			  db.query('update tbUser set device_token = ? where id = ? ',[empty,rsl4[0].id]);
						    	  			}
						    	  		});
					    	  		}
						    	  	db.query('insert into tbUser (username, email, password, token, device_token, fullname, latitude, longitude, phone, birthday, country, sex, purpose, status ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, email, md5(password), token, device_token, fullname, latitude, longitude, phone, birthday, country, sex, purpose, 1], function(err,result3){
							    	  		//order activitys
											if(err){
												console.log('err',err);
											}else{
												res.json({'message':'Insert Success','code':1,'token':token,'username':username,'userid':result3.insertId,'gender':gender,'fullname':fullname,'phone':phone,'birthday':birthday,'purpose':purpose});
											}
										});
					    			}
				    			}
				    	  });
			    	  }
		    	  });
	    	  }
	 });
	 
	 app.post('/registerFBUser', function (req, res) {
      var token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var email = req.body.email,
				  phone = req.body.phone,
				  password = req.body.password,
				  deviceid = req.body.deviceid,
				  confirm = req.body.confirm,
				  device_token = req.body.devicetoken,
				birthday = req.body.birthday,
				latitude = req.body.latitude,
				longitude = req.body.longitude,
				country = req.body.country,
				gender = req.body.gender,
				purpose = req.body.purpose,
				fullname = req.body.fullname,
				fb_id = req.body.fb_id;
	  var sex = 0;
			if(gender == 'male'){
				sex = 0;
			}else if(gender == 'female'){
				sex = 1;
			}
			var username = email;
    		 if (email === "" || username === "" || password === "" || confirm === ""){
    			  res.json({'message':'Please enter information into the corresponding box','code':601});
    		  }
    		  else if (validator.isEmail(email) === false) {
    			  res.json({'message':'Email incorrect formats. Please try again!','code':602});
    		  }
    		  else if (username.length < 2  || username.length > 120) {
    		  	res.json({'message':'Username consists 2 to 20 characters!','code':603});
    		  }
    		  else if (password.length < 6) {
    		  	res.json({'message':'Password should consists 6 characters!','code':604});
    		  }
/*    		  else if (password != confirm){
    			  res.json({'message':'Password and confirm password mismatch.','code':605});
    		  }*/
    		  else {
	    		  var rsl = db.query('select * from tbUser where username = ?', username, function(err, result) {
			    	  if (result.length != 0){
			    		  res.json({'message':'This username currently exists.','code':606});
			    	  }
			    	  else {
				    	  var rsl2 = db.query('select * from tbUser where email = ?', email, function(err, result2) {
				    	  	if (result2.length != 0){
					    	 	 res.json({'message':'This email currently exists.','code':607});
			    	 			}
					    	  else {
					    	  	if (err){
						    		 	res.json({'message':'Error','code':608});
							    	}
						    	  else {
							    	  var empty = '';
							    	  if (device_token != ''){	
						    	  		db.query('select * from tbUser where device_token = ?',device_token,function(err4,rsl4){
											if (err4 != '')
											{
												console.log('rs',err4);
											}else if (rsl4 != ''){
						    	  			  db.query('update tbUser set device_token = ? where id = ? ',[empty,rsl4[0].id]);
						    	  			}
						    	  		});
					    	  		}
						    	  	db.query('insert into tbUser (username, email, password, token, device_token, fullname, latitude, longitude, phone, birthday, country, sex, purpose, status ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, email, md5(password), token, device_token, fullname, latitude, longitude, phone, birthday, country, sex, purpose, 1], function(err,result3){
							    	  		//order activitys
											if(err){
												console.log('err',err);
											}else{
												res.json({'message':'Insert Success','code':1,'token':token,'username':username,'userid':result3.insertId,'gender':gender,'fullname':fullname,'phone':phone,'birthday':birthday,'purpose':purpose});
											}
										});
					    			}
				    			}
				    	  });
			    	  }
		    	  });
	    	  }
	 });
	 
//  login
app.post('/loginUser', function(req, res) {

	  if (req.body.username == null || req.body.password == null){ // || req.body.devicetoken == null){
		res.json({'message':'Missing params','code':609});		  
	  }else if (req.body.username == '' || req.body.password == '') {
		res.json({'message':'Please enter information into the corresponding box','code':601});
	  }else {
		var username = req.body.username;
	    var password = req.body.password;
		var longitude = req.body.longitude;
		var latitude = req.body.latitude;
	    var device_token = req.body.devicetoken;
	  	var sql = 'select U.*, I.*,S.*, count(C.id) as likes,U.status as userstatus,U.id as userid, C.toUser from tbUser as U left join tbimage as I on U.id = I.belong left join tbcontact as C on C.toUser = U.id left join tbSearch as S on U.id = S.userid where U.username = ? and I.status = 0 group by U.id';
		  var rsl = db.query(sql, username, function(err, result){
			  console.log(err);
			  console.log(result);
		  	if (result.length != 0){
		  		if (md5(password) != result[0].password){
						res.json({'message':'Password is incorrect. Please try again','code' : 610});
					}else {
						console.log('status',result[0]);
						if (result[0].userstatus != 1){
							res.json({'message':"This account doesn't exist",'code':611,'type':0});
						}else {
							var empty = '';	
							if (device_token != '') {
							db.query('select * from tbUser where device_token = ?',device_token,function(err4,rsl4){
								if(rsl4 == 'undefined'){
									console.log(rsl4);
									if (rsl4 != ''){
										db.query('update tbUser set device_token = ?,longitude = ?,latitude = ? where id = ? ',[empty,longitude,latitude,rsl4[0].id]);
									}
								}
							});
					  	}
						db.query('update tbUser set device_token = ?, longitude = ?, latitude = ?,onlinestatus = ? where id = ?',[device_token,longitude,latitude,1,result[0].userid],function(err5,rsl5){
							console.log(err5);
						});
								
								//order activity
		    	  		var order;
						obj = new Object();
						obj.userid = result[0].userid;
						obj.username = result[0].username;
						obj.email = result[0].email;
						obj.createtime = result[0].createtime;
						obj.about = result[0].about;
						obj.country = result[0].country;
						obj.token = result[0].token;
						obj.phone = result[0].phone;
						obj.fullname = result[0].fullname;
						obj.imageCount = result[0].imageCount;
						obj.likes = result[0].likes;
						obj.distancefrom = result[0].distanceFrom;
						obj.distanceto = result[0].distanceTo;
						obj.agefrom = result[0].ageFrom;
						obj.ageto = result[0].ageTo;
						obj.showoption = result[0].showOption;
						obj.purposeoption = result[0].purposeOption;

						if(result[0].sex == 0){
							obj.gender = 'male';
						}else{
							obj.gender = 'female';
						}
						obj.purpose = result[0].purpose;
						obj.birthday = result[0].birthday;

						if (result[0].path == null){
							obj.path = 'avatar.png';
						}else {
							obj.path = result[0].path;
						}
						if (result[0].image1 == '' || result[0].image1 == null){
							obj.image1 = 'avatar.png';
						}else {
							obj.image1 = result[0].image1;
						}
						if (result[0].image2 == '' || result[0].image2 == null){
							obj.image2 = 'avatar.png';
						}else {
							obj.image2 = result[0].image2;
						}
						if (result[0].image3 == '' || result[0].image3 == null){
							obj.image3 = 'avatar.png';
						}else {
							obj.image3 = result[0].image3;
						}
						if (result[0].image4 == '' || result[0].image4 == null){
							obj.image4 = 'avatar.png';
						}else {
							obj.image4 = result[0].image4;
						}
						if (result[0].image5 == '' || result[0].image5 == null){
							obj.image5 = 'avatar.png';
						}else {
							obj.image5 = result[0].image5;
						}
						res.json({'message':'Login Success!','code' : 1, 'user': obj});
								
						}
					}
		  	}else {
		  		res.json({'message':"This username doesn't exist. Please try again",'code' : 612});
		  	}
	  	});
	  }
  });
app.post('/logoutUser',function(req,res){
	var userid = req.body.userid;
	var empty = '';
	var date = new Date();
	db.query('update tbUser set device_token = ?,offlinetime = ?,onlinestatus = ? where id = ? ',[empty,date,0,userid],function(err,rsl){
		console.log(err);
		res.json({'message':'OK','code':1});
	});
});
app.post('/nearByUsers', function(req,res){
	if (typeof req.body.userid == 'undefined'){
        res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.userid == ''){
        res.json({'message':'This token is incorrect','code':0});
    }else {
		var userid = req.body.userid; // user login token
		var longitude = req.body.longitude;
		var latitude = req.body.latitude;
		var pageIndex = req.body.pageindex;
		var sqlCriteria = 'SELECT * FROM tbSearch WHERE userid = ?';
		var distanceFrom = 0;
		var distanceTo = 100;
		var isOversea = 0;
		var country = '';
		var ageFrom = 18;
		var ageTo = 70;
		var showOption = 0;
		var purposeOption = 0;
		db.query(sqlCriteria, userid, function(errCriteria, resultCriteria){
			console.log(errCriteria);
			console.log(resultCriteria);
			if(resultCriteria != null && typeof resultCriteria[0] !== 'undefined'){
				distanceFrom = resultCriteria[0].distanceFrom;
				distanceTo = resultCriteria[0].distanceTo;
				isOversea = resultCriteria[0].isOversea;
				country = resultCriteria[0].country;
				ageFrom = resultCriteria[0].ageFrom;
				ageTo = resultCriteria[0].ageTo;
				showOption = resultCriteria[0].showOption;
				purposeOption = resultCriteria[0].purposeOption;
			}
		
		/*var preSqlNearBy = 'SELECT *,r1.id as userid,DATEDIFF(NOW(),r1.birthday) / 365.25 as age,(((acos(sin(('+latitude+'*pi()/180)) * sin((r1.latitude*pi()/180))+cos(('+latitude+'*pi()/180)) * cos((r1.latitude*pi()/180)) * cos((('+longitude+'- r1.longitude)* pi()/180))))*180/pi())*60*1.1515) as distance FROM tbUser AS r1 INNER JOIN tbImage b ON b.belong = r1.id INNER JOIN tbSearch c ON c.userid = r1.id JOIN (SELECT (RAND() *(SELECT count(id) FROM tbuser)) AS id) AS r2 ';
		//var preSqlNearBy = 'SELECT * FROM tbUser AS r1 INNER JOIN tbImage b ON b.belong = r1.id INNER JOIN tbSearch c ON c.userid = r1.id JOIN (SELECT (RAND() *(SELECT count(id) FROM tbuser)) AS id) AS r2 ';
		var endSqlNearBy = 'ORDER BY r1.id ASC LIMIT 10';
		preSqlNearBy = preSqlNearBy + 'WHERE r1.id >= r2.id AND r1.id != ? ';*/
		var startIndex = pageIndex*10;
		startIndex = startIndex || 0;
		var preSqlNearBy = 'SELECT *,r1.id as userid,(DATEDIFF(NOW(), r1.birthday) / 365.25) as age,(((acos(sin(('+latitude+'*pi()/180)) * sin((r1.latitude*pi()/180))+cos(('+latitude+'*pi()/180)) * cos((r1.latitude*pi()/180)) * cos((('+longitude+'- r1.longitude)* pi()/180))))*180/pi())*60*1.1515) as distance FROM tbUser AS r1 INNER JOIN tbImage b ON b.belong = r1.id INNER JOIN tbSearch c ON c.userid = r1.id ';
		//var preSqlNearBy = 'SELECT * FROM tbUser AS r1 INNER JOIN tbImage b ON b.belong = r1.id INNER JOIN tbSearch c ON c.userid = r1.id JOIN (SELECT (RAND() *(SELECT count(id) FROM tbuser)) AS id) AS r2 ';
		var endSqlNearBy = 'ORDER BY r1.id ASC LIMIT '+startIndex+',10';//RAND() LIMIT 10'; 
		//preSqlNearBy = preSqlNearBy + 'WHERE r1.id >= r2.id AND r1.id != ? ';
		var friendsSql = "(SELECT FRIENDS.id FROM ((SELECT D.toUser as id FROM tbcontact as D WHERE D.fromUser = ?) UNION (SELECT E.fromUser as id FROM tbcontact as E WHERE E.toUser = ?)) as FRIENDS) ";

		preSqlNearBy = preSqlNearBy + 'WHERE r1.id != ? AND r1.id NOT IN ' + friendsSql;
		
		//Add Age Where Clause
		if(showOption == 1){
			preSqlNearBy = preSqlNearBy + 'AND r1.sex = 0 ';
		}else{
			preSqlNearBy = preSqlNearBy + 'AND r1.sex = 1 ';
		}
		if(isOversea == 1){
			if (country != 'all')
			{
				preSqlNearBy = preSqlNearBy + 'AND r1.country = \'' + country + '\' ';
			}
			preSqlNearBy = preSqlNearBy + 'HAVING age >= ' + ageFrom + ' AND age <= ' + ageTo + ' ';
		}else{

			preSqlNearBy = preSqlNearBy + 'HAVING distance >= ' + distanceFrom + ' AND distance <= ' + distanceTo + ' ';
			preSqlNearBy = preSqlNearBy + 'AND age >= ' + ageFrom + ' AND age <= ' + ageTo + ' ';
		}
		
		var sqlNearBy = preSqlNearBy + endSqlNearBy;
//		var sqlNearBy = 'SELECT *,r1.id as userid FROM tbUser AS r1 INNER JOIN tbImage b ON b.belong = r1.id INNER JOIN tbSearch c ON c.userid = r1.id JOIN (SELECT (RAND() *(SELECT count(id) FROM tbuser)) AS id) AS r2 WHERE r1.id >= r2.id AND r1.id != ? ORDER BY r1.id ASC LIMIT 10';
		db.query(sqlNearBy,[userid, userid, userid],function(err,result){
			console.log(err);
			console.log(sqlNearBy);
			var data = [];
			for (i = 0; i < result.length; i++){
				obj = new Object();
				obj.userid = result[i].userid;
				obj.username = result[i].username;
				obj.email = result[i].email;
				obj.createtime = result[i].createtime;
				obj.about = result[i].about;
				obj.country = result[i].country;
				obj.token = result[i].token;
				obj.phone = result[i].phone;
				obj.fullname = result[i].fullname;
				obj.imageCount = result[i].imageCount;
				obj.showOption = result[i].showOption;
				obj.purposeOption = result[i].purposeOption;
				obj.latitude = result[i].latitude;
				obj.longitude = result[i].longitude;
				obj.onlinestatus = result[i].onlinestatus;

				var R = 6371; // km
				var radLat1 = result[i].latitude;
				var radLat2 = latitude;
				var deltaLat = (latitude-result[i].latitude);
				var deltaLng = (longitude-result[i].longitude);

				var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
		        Math.cos(radLat1) * Math.cos(radLat2) *
				Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

				var d = R * c;
				obj.distance = d;
				if(result[i].offlinetime != null && result[i].offlinetime != '0000-00-00 00:00:00'){
					obj.offlinetime = result[i].offlinetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
				}else{
					obj.offlinetime = result[i].offlinetime;
				}

				if (result[i].path == null){
					obj.path = 'avatar.png';
				}else {
					obj.path = result[i].path;
				}
				if (result[i].image1 == null){
					obj.image1 = 'avatar.png';
				}else {
					obj.image1 = result[i].image1;
				}
				if (result[i].image2 == null){
					obj.image2 = 'avatar.png';
				}else {
					obj.image2 = result[i].image2;
				}
				if (result[i].image3 == null){
					obj.image3 = 'avatar.png';
				}else {
					obj.image3 = result[i].image3;
				}
				if (result[i].image4 == null){
					obj.image4 = 'avatar.png';
				}else {
					obj.image4 = result[i].image4;
				}
				if (result[i].image5 == null){
					obj.image5 = 'avatar.png';
				}else {
					obj.image5 = result[i].image5;
				}
				data[i]= obj;
			}
			res.json({'code' : 1, 'users': data});
		});
		});
	}
});
app.post('/searchCriteria', function (req, res) {
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
			var token = req.body.token;
			var distanceFrom = req.body.distancefrom;
			var distanceTo = req.body.distanceto;
			var isOversea = req.body.isoversea;
			var ageFrom = req.body.agefrom;
			var ageTo = req.body.ageto;
			var showOption = req.body.showoption;
			var purposeOption = req.body.purposeoption;
			var selectedCountry = '';
			if(req.body.selectedcountry == null || req.body.selectedcountry == ''){
				selectedCountry = 'all';
			}else{
				selectedCountry = req.body.selectedcountry;
			}
			
			var rsl = db.query('select * from tbUser where token = ?', token, function(err, result){
				if (result == '') {
					res.json({'message':'Not Found!','code':0});
				} else {
					db.query('select * from tbsearch where userid = ?', result[0].id, function(err1, result1){
						if(result1 == ''){
							db.query('insert into tbsearch (userid ,distanceFrom,distanceTo,isOversea,country,ageFrom,ageTo,showOption,purposeOption) values (?,?,?,?,?,?,?,?,?)',[result[0].id,distanceFrom,distanceTo,isOversea,selectedCountry,ageFrom,ageTo,showOption,purposeOption], function(err3, rsl3){
								console.log('until here:',err3);
								if(err3){
									res.json({'message':'Update Failed!','code':1});
								}else{
									res.json({'message':'Update success!','code':1});
								}
							});
						}else{
							db.query('UPDATE tbsearch SET distanceFrom = ? ,distanceTo = ?, isOversea = ?, country = ?, ageFrom = ?, ageTo = ? ,showOption = ?, purposeOption = ? WHERE userid = ?',[distanceFrom,distanceTo,isOversea,selectedCountry,ageFrom,ageTo,showOption,purposeOption,result[0].id], function(err3, rsl3){
								if(err3){
									console.log('until here:',err3);
									res.json({'message':'Update Failed!','code':1});
								}else{
									res.json({'message':'Update success!','code':1});
								}
							});							
						}
					});
				}
			});
	}
});
function listLikes_(token,latitude,longitude,res){
	
	var sql = 'select id,token from tbUser where token = ?';

	//list user pengding
	var sql1 = 	'SELECT b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,b.latitude,b.longitude,b.onlinestatus,b.offlinetime,c.path ' +
							'FROM (select a1.`toUser` from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a1 where a1.status = 0) AS a '+
							'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b ON b.id = a.`toUser` '+
							'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id ';
							
	//list user request
	var sql2 = 	'SELECT b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,b.latitude,b.longitude,b.onlinestatus,b.offlinetime,c.path '+
							'FROM (select a1.`fromUser` from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 where a1.status = 0) AS a '+
							'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b ON b.id = a.`fromUser` '+
							'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id ';
							

	//list user accepted
	var sql3 = 'SELECT lastmessage,b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,b.latitude,b.longitude,b.onlinestatus,b.offlinetime,c.path '+
				'FROM (select a1.`fromUser`,a1.status from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 where a1.status = 1) AS a '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b ON b.id = a.`fromUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id '+
				'left join (select max(createtime) as lastmessage,`toUser`,`fromUser` from tbMessage where `fromUser` = ? group by `toUser`) d on d.`toUser` = b.id '+

				'UNION '+

				'SELECT lastmessage,b1.id as userid,b1.username,b1.fullname,b1.about,b1.email,b1.country,b1.phone,b1.token,b1.latitude,b1.longitude,b1.onlinestatus,b1.offlinetime,c1.path '+
				'FROM (select a11.`toUser`,a11.status from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a11 where a11.status = 1)  AS a1 '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b1 ON b1.id = a1.`toUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c1 ON c1.belong = b1.id '+
				'left join (select max(createtime) as lastmessage,`toUser`,`fromUser` from tbMessage where `fromUser` = ?  group by `toUser`) d1 on d1.`toUser` = b1.id '+

				 'order by lastmessage DESC';

	var sql6 = 'SELECT lastmessage,b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,b.latitude,b.longitude,b.onlinestatus,b.offlinetime,c.path '+
				'FROM (select a1.`fromUser`,a1.status from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 where a1.status = 1) AS a '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b ON b.id = a.`fromUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id '+
				'left join (select max(createtime) as lastmessage,`toUser`,`fromUser` from tbMessage where `toUser` = ? group by `fromUser`) d on d.`fromUser` = b.id '+

				'UNION '+

				'SELECT lastmessage,b1.id as userid,b1.username,b1.fullname,b1.about,b1.email,b1.country,b1.phone,b1.token,b1.latitude,b1.longitude,b1.onlinestatus,b1.offlinetime,c1.path '+
				'FROM (select a11.`toUser`,a11.status from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a11 where a11.status = 1)  AS a1 '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token,latitude,longitude,onlinestatus,offlinetime FROM tbUser) b1 ON b1.id = a1.`toUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c1 ON c1.belong = b1.id '+
				'left join (select max(createtime) as lastmessage,`toUser`,`fromUser` from tbMessage where `toUser` = ?  group by `fromUser`) d1 on d1.`fromUser` = b1.id '+

				'order by b.fullname DESC';
				
	
	db.query(sql,token,function(err,rsl){
			if (rsl == ''){
				res.json({'message':'This token is incorrect','code':0});
			}else {
				db.query(sql1,rsl[0].id,function(err1,rsl1){
					db.query(sql2,rsl[0].id,function(err2,rsl2){
						db.query(sql3,[rsl[0].id,rsl[0].id,rsl[0].id,rsl[0].id],function(err3,rsl3){
							db.query(sql6,[rsl[0].id,rsl[0].id,rsl[0].id,rsl[0].id],function(err6,rsl6){
								var data1 = [],
									data2 = [],
									data3a = [],
									data3b = [];
									// LIST PENDING
									if (rsl1 != ''){
										var i1;
										for (i1 = 0; i1<rsl1.length; i1 ++){
											var obj1 = new Object();
											obj1.userid = rsl1[i1].userid;
											obj1.username = rsl1[i1].username;
											obj1.email = rsl1[i1].email;
											obj1.country = rsl1[i1].country;
											obj1.phone = rsl1[i1].phone;
											obj1.fullname = rsl1[i1].fullname;
											obj1.token = rsl1[i1].token;
											obj1.about = rsl1[i1].about;
											obj1.latitude = rsl1[i1].latitude;
											obj1.longitude = rsl1[i1].longitude;
											obj1.onlinestatus = rsl1[i1].onlinestatus;

											var R = 6371; // km
											var radLat1 = rsl1[i1].latitude;
											var radLat2 = latitude;
											var deltaLat = (latitude-rsl1[i1].latitude);
											var deltaLng = (longitude-rsl1[i1].longitude);

											var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
											Math.cos(radLat1) * Math.cos(radLat2) *
											Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
											var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

											var d = R * c;
											obj1.distance = d;

											if(rsl1[i1].offlinetime != null && rsl1[i1].offlinetime != '0000-00-00 00:00:00'){
												obj1.offlinetime = rsl1[i1].offlinetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
											}else{
												obj1.offlinetime = rsl1[i1].offlinetime;
											}

											if (rsl1[i1].path == null){
												obj1.path = '/uploads/default.png' ;
											}else {
												obj1.path = rsl1[i1].path;
											}
											data1[i1] = obj1;
										}
									}else {
										data1 = [];
									}
									// LIST REQUEST
									if (rsl2 != null){
										var i2;
										for (i2 = 0; i2<rsl2.length; i2 ++){
												var obj2 = new Object();
												obj2.userid = rsl2[i2].userid;
												obj2.username = rsl2[i2].username;
												obj2.email = rsl2[i2].email;
												obj2.country = rsl2[i2].country;
												obj2.phone = rsl2[i2].phone;
												obj2.fullname = rsl2[i2].fullname;
												obj2.token = rsl2[i2].token;
												obj2.about = rsl2[i2].about;
												obj2.latitude = rsl2[i2].latitude;
												obj2.longitude = rsl2[i2].longitude;
												obj2.onlinestatus = rsl2[i2].onlinestatus;

												var R = 6371; // km
												var radLat1 = rsl2[i2].latitude;
												var radLat2 = latitude;
												var deltaLat = (latitude-rsl2[i2].latitude);
												var deltaLng = (longitude-rsl2[i2].longitude);

												var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
												Math.cos(radLat1) * Math.cos(radLat2) *
												Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
												var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

												var d = R * c;
												obj2.distance = d;

												if(rsl2[i2].offlinetime != null && rsl2[i2].offlinetime != '0000-00-00 00:00:00'){
													obj2.offlinetime = rsl2[i2].offlinetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
												}else{
													obj2.offlinetime = rsl2[i2].offlinetime;
												}
												if (rsl2[i2].path == null){
													obj2.path = '/uploads/default.png' ;
												}else {
													obj2.path = rsl2[i2].path;
												}
												data2[i2] = obj2;
										}
									}else {
										data2 = [];
									}
										
									//LIST USER ACCEPT REQUEST
									if (rsl3 != null){
										var i3;
										for (i3 = 0; i3<rsl3.length; i3 ++){
												var obj3 = new Object();
												obj3.userid = rsl3[i3].userid;
												obj3.username = rsl3[i3].username;
												obj3.email = rsl3[i3].email;
												obj3.country = rsl3[i3].country;
												obj3.phone = rsl3[i3].phone;
												obj3.fullname = rsl3[i3].fullname;
												obj3.token = rsl3[i3].token;
												obj3.about = rsl3[i3].about;
												obj3.latitude = rsl3[i3].latitude;
												obj3.longitude = rsl3[i3].longitude;
												obj3.onlinestatus = rsl3[i3].onlinestatus;

												var R = 6371; // km
												var radLat1 = rsl3[i3].latitude;
												var radLat2 = latitude;
												var deltaLat = (latitude-rsl3[i3].latitude);
												var deltaLng = (longitude-rsl3[i3].longitude);

												var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
												Math.cos(radLat1) * Math.cos(radLat2) *
												Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
												var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

												var d = R * c;
												obj3.distance = d;

												if(rsl3[i3].offlinetime != null && rsl3[i3].offlinetime != '0000-00-00 00:00:00'){
													obj3.offlinetime = rsl3[i3].offlinetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
												}else{
													obj3.offlinetime = rsl3[i3].offlinetime;
												}
												if (rsl3[i3].path == null){
													obj3.path = '/uploads/default.png' ;
												}else {
													obj3.path = rsl3[i3].path;
												}
												obj3.lastmessage = rsl3[i3].lastmessage;
												data3a[i3] = obj3;
										}
									}else {
										data3a = [];
									}
										
									// LIST USER HAS BEEN ACCEPTED
									if (rsl6 != null){
										var i6;
										for (i6 = 0; i6<rsl6.length; i6 ++){
												var obj6 = new Object();
												obj6.userid = rsl6[i6].userid;
												obj6.username = rsl6[i6].username;
												obj6.email = rsl6[i6].email;
												obj6.country = rsl6[i6].country;
												obj6.phone = rsl6[i6].phone;
												obj6.fullname = rsl6[i6].fullname;
												obj6.token = rsl6[i6].token;
												obj6.about = rsl6[i6].about;
												obj6.latitude = rsl6[i6].latitude;
												obj6.longitude = rsl6[i6].longitude;
												obj6.onlinestatus = rsl6[i6].onlinestatus;

												var R = 6371; // km
												var radLat1 = rsl6[i6].latitude;
												var radLat2 = latitude;
												var deltaLat = (latitude-rsl6[i6].latitude);
												var deltaLng = (longitude-rsl6[i6].longitude);

												var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
												Math.cos(radLat1) * Math.cos(radLat2) *
												Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
												var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

												var d = R * c;
												obj6.distance = d;

												if(rsl6[i6].offlinetime != null && rsl6[i6].offlinetime != '0000-00-00 00:00:00'){
													obj6.offlinetime = rsl6[i6].offlinetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
												}else{
													obj6.offlinetime = rsl6[i6].offlinetime;
												}
												if (rsl6[i6].path == null){
													obj6.path = '/uploads/default.png' ;
												}else {
													obj6.path = rsl6[i6].path;
												}
												obj6.lastmessage = rsl6[i6].lastmessage;
												data3b[i6] = obj6;
										}
									}else {
										data3b = [];
									}
										
									var data3 = [];
									for(var i in data3b){
									   var shared = false;
									   for (var j in data3a)
										   if (data3a[j].userid == data3b[i].userid) {
											   shared = true;
											   break;
										   }
									   if(!shared) data3.push(data3b[i]);
									}
										
									data3 = data3.concat(data3a);
									data3.sort(compare);
									res.json({'pending':data1,'request':data2,'accept':data3,'code':1});
						});
					});
				});
			});
		}
	});
}
//list contact for user
app.post('/listLikes',function(req,res){

	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		var latitude = req.body.latitude;
		var longitude = req.body.longitude;
		listLikes_(token,latitude,longitude,res);
	}
});

//user request contact
app.post('/requestLikes',function(req,res){
	if (typeof req.body.userid == 'undefined' || typeof req.body.opponentid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == '' || req.body.opponentid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid;
		var userid2 = req.body.opponentid;

		var sql = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? and `toUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a1 ) as a';
		var sql2 = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? and `fromUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 ) as a';
		
		if (userid1 == userid2) {
			res.json({'message':"You can not send a request to yourself",'code': 0});
		}else {
			db.query(sql,[userid1,userid2],function(error1,result1){
				db.query(sql2,[userid1,userid2],function(error2,result2){
					if(result1 == ''){
						if(result2 == ''){
							db.query('insert into tbContact (`fromUser`, `toUser`, `status`) values (?,?,?)',[userid1,userid2,0],function(err2,rsl2){	
									res.json({'message':'Request Success!','code':1});
								});
						}else{
							if(result2[0].status === 0){
								db.query('update tbContact set status = 1 where `toUser` = ? and `fromUser` = ?',[userid1,userid2],function(err2,rsl2){	
									res.json({'message':'Contact Success!','code':1});
								});
							}else if(result2[0].status === 1){
								res.json({'message':'Already in Contact!','code':1});
							}else{
								res.json({'message':'Blocked Contact!','code':1});
							}
						}
					}else{
						if(result1[0].status === 0){
							res.json({'message':'Already requested!','code':1});
						}else if(result1[0].status === 1){
							res.json({'message':'Already in contact!','code':1});
						}else{
							res.json({'message':'Blocked Contact!','code':1});
						}
					}
				});
			});
		}
	}
});
app.post('/blockLikes',function(req,res){
	if (typeof req.body.userid == 'undefined' || typeof req.body.opponentid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == '' || req.body.opponentid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid;
		var userid2 = req.body.opponentid;
		var latitude = req.body.latitude;
		var longitude = req.body.longitude;
		var token = req.body.token;

		var sql1 = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? and `toUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a1 ) as a';
		var sql2 = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? and `fromUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 ) as a';
		
		
		if (userid1 == userid2) {
			res.json({'message':"You can not accept a request to yourself",'code': 0});
		}else {
			db.query(sql1,[userid1,userid2],function(err1,rsl1){
				db.query(sql2,[userid1,userid2],function(err2,rsl2){
					if (rsl1 == ''){
						if (rsl2 != ''){
							db.query('update tbContact set status = 2 where toUser=? and fromUser = ?',[userid1,userid2],function(err3,rsl3){
								//res.json({'message':"Accept success",'code':1});
								listChats_(token,res);
							});
						}else {
							res.json({'message':"You don't have request contact for this user",'code':0});
						}
					}else {
						if(rsl1[0].status === 1){
							db.query('update tbContact set status = 2 where fromUser=? and toUser = ?',[userid1,userid2],function(err3,rsl3){
										//res.json({'message':"Accept success",'code':1});
										listChats_(token,res);
							});
						}else {
							db.query('insert into tbContact (`fromUser`,`toUser`,`status`) values (?,?,?)',[userid1,userid2,2],function(err4,rsl4){
								//res.json({'message':"Reject success",'code':1});
								listChats_(token,res);
							});
						}
					}
				});
			});
		}
	}
});
//accept contact
app.post('/acceptLikes',function(req,res){
	if (typeof req.body.userid == 'undefined' || typeof req.body.opponentid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == '' || req.body.opponentid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid;
		var userid2 = req.body.opponentid;
		var latitude = req.body.latitude;
		var longitude = req.body.longitude;
		var type = req.body.type;
		var token = req.body.token;

		var sql1 = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? and `toUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a1 ) as a';
		var sql2 = 'select a.* from (select a1.* from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? and `fromUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 ) as a';
		
		
		if (userid1 == userid2) {
			res.json({'message':"You can not accept a request to yourself",'code': 0});
		}else {
			db.query(sql1,[userid1,userid2],function(err1,rsl1){
				db.query(sql2,[userid1,userid2],function(err2,rsl2){
					if (rsl1 == ''){
						if (rsl2 != ''){
							if (rsl2[0].status === 1){
								res.json({'message':'This user has accepted by you in contact lists at time ago!','code':0});
							}else if(rsl2[0].status === 0){
								if(type == 1){
									db.query('update tbContact set status = 1 where toUser=? and fromUser = ?',[userid1,userid2],function(err3,rsl3){
										//res.json({'message':"Accept success",'code':1});
										listLikes_(token,latitude,longitude,res);
									});
								}
								if(type == 0){
									db.query('update tbContact set status = 2 where toUser=? and fromUser = ?',[userid1,userid2],function(err3,rsl3){
										//res.json({'message':"Accept success",'code':1});
										listLikes_(token,latitude,longitude,res);
									});
								}
							}
						}else {
							res.json({'message':"You don't have request contact for this user",'code':0});
						}
					}else {
						if(rsl1[0].status === 1){
							if(type != 1){
								db.query('update tbContact set status = 2 where fromUser=? and toUser = ?',[userid1,userid2],function(err3,rsl3){
										//res.json({'message':"Accept success",'code':1});
										listLikes_(token,latitude,longitude,res);
									});
							}else{
								res.json({'message':"You has request contact for this user",'code':0});
							}
						}else {
							if (type == 1){ //1: accept
								db.query('insert into tbContact (`fromUser`,`toUser`,`status`) values (?,?,?)',[userid1,userid2,1],function(err3,rsl3){
									//res.json({'message':"Accept success",'code':1});
									listLikes_(token,latitude,longitude,res);
								});
							}
							if (type == 0){ //0: reject
								db.query('insert into tbContact (`fromUser`,`toUser`,`status`) values (?,?,?)',[userid1,userid2,2],function(err4,rsl4){
									//res.json({'message':"Reject success",'code':1});
									listLikes_(token,latitude,longitude,res);
								});
							}
						}
					}
				});
			});
		}
	}
});
function listChats_(token,res){
	var sql = 'select id,token from tbUser where token = ?';

	//list user accepted
	var sql3 = 'SELECT lastmessage,lastmessagedate,lastmessagestatus,b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,c.path '+
				'FROM (select a1.`fromUser`,a1.status from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 where a1.status = 1) AS a '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token FROM tbUser) b ON b.id = a.`fromUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id '+
				'left join (select max(createtime) as lastmessagedate,`toUser`,`fromUser`,message as lastmessage,status as lastmessagestatus from tbMessage where `fromUser` = ? group by `toUser`) d on d.`toUser` = b.id '+

				'UNION '+

				'SELECT lastmessage,lastmessagedate,lastmessagestatus,b1.id as userid,b1.username,b1.fullname,b1.about,b1.email,b1.country,b1.phone,b1.token,c1.path '+
				'FROM (select a11.`toUser`,a11.status from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a11 where a11.status = 1)  AS a1 '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token FROM tbUser) b1 ON b1.id = a1.`toUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c1 ON c1.belong = b1.id '+
				'left join (select max(createtime) as lastmessagedate,`toUser`,`fromUser`,message as lastmessage,status as lastmessagestatus from tbMessage where `fromUser` = ?  group by `toUser`) d1 on d1.`toUser` = b1.id '+

				 'order by lastmessagedate DESC';

	var sql6 = 'SELECT lastmessage,lastmessagedate,lastmessagestatus,b.id as userid,b.username,b.fullname,b.about,b.email,b.country,b.phone,b.token,c.path '+
				'FROM (select a1.`fromUser`,a1.status from (SELECT a2.* FROM (select * from `tbContact` where `toUser` = ? order by createtime desc) as a2 group by a2.`fromUser`) as a1 where a1.status = 1) AS a '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token FROM tbUser) b ON b.id = a.`fromUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c ON c.belong = b.id '+
				'left join (select max(createtime) as lastmessagedate,`toUser`,`fromUser`,message as lastmessage,status as lastmessagestatus from tbMessage where `toUser` = ? group by `fromUser`) d on d.`fromUser` = b.id '+

				'UNION '+

				'SELECT lastmessage,lastmessagedate,lastmessagestatus,b1.id as userid,b1.username,b1.fullname,b1.about,b1.email,b1.country,b1.phone,b1.token,c1.path '+
				'FROM (select a11.`toUser`,a11.status from (SELECT a2.* FROM (select * from `tbContact` where `fromUser` = ? order by createtime desc) as a2 group by a2.`toUser`) as a11 where a11.status = 1)  AS a1 '+
				'inner JOIN (SELECT id,username,fullname,about,email,country,phone,token FROM tbUser) b1 ON b1.id = a1.`toUser` '+
				'LEFT JOIN (SELECT belong,path FROM tbImage WHERE status = 0) c1 ON c1.belong = b1.id '+
				'left join (select max(createtime) as lastmessagedate,`toUser`,`fromUser`,message as lastmessage,status as lastmessagestatus from tbMessage where `toUser` = ?  group by `fromUser`) d1 on d1.`fromUser` = b1.id '+

				'order by lastmessagedate DESC';
				
	
	db.query(sql,token,function(err,rsl){
			if (rsl == ''){
				res.json({'message':'This token is incorrect','code':0});
			}else {
				db.query(sql3,[rsl[0].id,rsl[0].id,rsl[0].id,rsl[0].id],function(err3,rsl3){
					db.query(sql6,[rsl[0].id,rsl[0].id,rsl[0].id,rsl[0].id],function(err6,rsl6){
						var	data3a = [],
							data3b = [];
							//LIST USER ACCEPT REQUEST
							if (rsl3 != null){
								var i3;
								for (i3 = 0; i3<rsl3.length; i3 ++){
										var obj3 = new Object();
										obj3.userid = rsl3[i3].userid;
										obj3.username = rsl3[i3].username;
										obj3.email = rsl3[i3].email;
										obj3.country = rsl3[i3].country;
										obj3.phone = rsl3[i3].phone;
										obj3.fullname = rsl3[i3].fullname;
										obj3.token = rsl3[i3].token;
										obj3.about = rsl3[i3].about;
										if (rsl3[i3].path == null){
											obj3.path = '/uploads/default.png' ;
										}else {
											obj3.path = rsl3[i3].path;
										}
										obj3.lastmessage = rsl3[i3].lastmessage;
										obj3.lastmessagestatus = rsl3[i3].lastmessagestatus;
										if(rsl3[i3].lastmessagedate != null){
											obj3.lastmessagedate = rsl3[i3].lastmessagedate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
										}else{
											obj3.lastmessagedate = rsl3[i3].lastmessagedate;
										}
										data3a[i3] = obj3;
								}
							}else {
								data3a = [];
							}
								
							// LIST USER HAS BEEN ACCEPTED
							if (rsl6 != null){
								var i6;
								for (i6 = 0; i6<rsl6.length; i6 ++){
										var obj6 = new Object();
										obj6.userid = rsl6[i6].userid;
										obj6.username = rsl6[i6].username;
										obj6.email = rsl6[i6].email;
										obj6.country = rsl6[i6].country;
										obj6.phone = rsl6[i6].phone;
										obj6.fullname = rsl6[i6].fullname;
										obj6.token = rsl6[i6].token;
										if (rsl6[i6].path == null){
											obj6.path = '/uploads/default.png' ;
										}else {
											obj6.path = rsl6[i6].path;
										}
										obj6.lastmessage = rsl6[i6].lastmessage;
										obj6.lastmessagestatus = rsl6[i6].lastmessagestatus;
										if(rsl6[i6].lastmessagedate != null){
											obj6.lastmessagedate = rsl6[i6].lastmessagedate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
										}else{
											obj6.lastmessagedate = rsl6[i6].lastmessagedate;
										}
										data3b[i6] = obj6;
								}
							}else {
								data3b = [];
							}
								
							var data3 = [];
							for(var i in data3b){
							   var shared = false;
							   for (var j in data3a)
								   if (data3a[j].userid == data3b[i].userid) {
									   shared = true;
									   break;
								   }
							   if(!shared) data3.push(data3b[i]);
							}
								
							data3 = data3.concat(data3a);
							data3.sort(compare);
							res.json({'chats':data3,'code':1});
				});
			});
		}
	});
};
app.post('/listChats',function(req,res){

	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		listChats_(token,res);
	}
});
app.post('/chatHistory',function(req,res){
	if (typeof req.body.fromid == 'undefined' || typeof req.body.toid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.fromid == '' || req.body.toid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var fromid = req.body.fromid;
		var toid = req.body.toid;
		var sql = 'select a.id as messageid,a.`fromUser`,a.`toUser`,a.message,a.status,a.uuid,a.createtime,b.username,c.path_from,c.thumb_from,c.thumb2_from,d.path_to,d.thumb_to,d.thumb2_to from tbMessage as a '+
					'left join (select id,username from tbUser) b on b.id = a.`fromUser` '+
					'left join (select belong,path as path_from,thumb as thumb_from,thumb2 as thumb2_from from tbImage where status = 0) c on c.belong = a.`fromUser` '+
					'left join (select belong,path as path_to,thumb as thumb_to,thumb2 as thumb2_to from tbImage where status = 0) d on d.belong = a.`toUser` '+
					'where `fromUser` = ? and `toUser` = ?' +
					'UNION '+
					'select a1.id as messageid,a1.`fromUser`,a1.`toUser`,a1.message,a1.status,a1.uuid,a1.createtime,b1.username,c1.path_from,c1.thumb_from,c1.thumb2_from,d1.path_to,d1.thumb_to,d1.thumb2_to from tbMessage as a1 '+
					'left join (select id,username from tbUser) b1 on b1.id = a1.`fromUser` '+
					'left join (select belong,path as path_from,thumb as thumb_from,thumb2 as thumb2_from from tbImage where status = 0) c1 on c1.belong = a1.`fromUser` '+
					'left join (select belong,path as path_to,thumb as thumb_to,thumb2 as thumb2_to from tbImage where status = 0) d1 on d1.belong = a1.`toUser` '+
					'where `toUser` = ? and `fromUser` = ?'+
					' order by `createtime` DESC '+
					'LIMIT 8';
		var sqlUpdate = 'update tbMessage set status = 1 where `fromUser` = ? and `toUser` = ?';
		var sqlUpdateNumPush = 'update tbuser set numPush = 0 where `id` = ?';
							
		db.query(sql,[fromid,toid,fromid,toid],function(err1,rsl1){
				console.log(err1);
				db.query(sqlUpdate,[fromid,toid],function(err,rsl){
					console.log(err);
					db.query(sqlUpdate,[toid,fromid],function(errr,rslr){
						console.log(errr);
					});
				});
				db.query(sqlUpdateNumPush,fromid,function(err,rsl){
					console.log(err);
				});
				var newarray = rsl1;
				var i;
				var data = [];
				for	(i = 0;i<newarray.length;i++){
					var obj = new Object();
					obj.sender = newarray[i].fromUser;
					obj.receiver = newarray[i].toUser;
					obj.messageid = newarray[i].messageid;
					obj.username_send = newarray[i].username;
					obj.uuid = newarray[i].uuid;

					//from
					obj.avatar = (newarray[i].path_from == null) ? '/uploads/avatar.png' : newarray[i].path_from;
					obj.message = utf8_decode(newarray[i].message);
					if (newarray[i].status == 0){
						obj.status = 'Pending';
					}else {
						obj.status = 'Sent';
					}
					var newtime = new Date(newarray[i].createtime);
					obj.time =	formatDate(newarray[i].createtime, "yyyy-MM-dd h:m:s");
					data[i] = obj;
				}
				
				data.sort(function(a,b) { 
					return parseFloat(a.createtime) - parseFloat(b.createtime); 
				});
				
				var aftersort = data;
				
				res.json({'history':aftersort,'code':1});
				// // db.end();
//			});
		});
	}
});
app.post('/accept',function(req,res){
	if (typeof req.body.userid1 == 'undefined' || typeof req.body.userid2 == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid1 == '' || req.body.userid2 == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid1;
		var userid2 = req.body.userid2;
		
		db.query('select * from tbContact where `from` = ? and `to` = ?',[userid1,userid2],function(err,rsl){
			if (rsl == ''){
				db.query('insert into tbContact (`from`,`to`,`status`) values (?,?,?)',[userid1,userid2,1],function(err2,rsl2){
					res.json({'message':'OK','code':1});
				});
			}else {
				db.query('update into tbContact SET `status` = ? WHERE `from` = ? and `to` = ?',[1,userid1,userid2],function(err3,rsl3){
					res.json({'message':'OK','code':1});
				});
			}
		});
	}
});

app.post('/userdevice',function(req,res){
	var userid = req.body.userid;
	var lat = req.body.lat;
	var lon = req.body.lon;
	var deviceid = req.body.deviceid;
  
  console.log('test',deviceid,lat,lon,userid);
    	  		
	geocoder.reverseGeocode( lat, lon, function ( err, data ) {
	  var location = data.results[0].formatted_address;
	  db.query('select * from tbDevice where deviceid = ? ',deviceid,function(er,rs){
			if (rs != ''){
				db.query('insert into tbUser_device (user_id,device_id,lat,lon,location) values (?,?,?,?,?) ',[userid,rs[0].id,lat,lon,location]);
			}
		});
	});
	
});


// info
app.post('/user/info', function(req, res) {
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		var sql = 'SELECT *, group_concat(key_name separator ",") as keyword '+
  	          'FROM (SELECT id as userID, username, email, website, phone, country, birthday, first_name, last_name, pickup_location, sex FROM tbUser WHERE token = ?) AS a '+
							'LEFT JOIN (SELECT id, path, thumb, thumb2, belong from tbImage where status = 0) b ' +
							'ON b.belong = a.userID '+
							'LEFT JOIN (SELECT AVG(content) as avgRate, userid FROM tbActivity WHERE status = 1 GROUP BY userid) c ' +
							'ON c.userid = a.userID '+
							'LEFT JOIN (SELECT COUNT(*) as numfollower,user_follow FROM tbFollow group by user_follow) d ' +
							'ON d.user_follow = a.userID '+
							'LEFT JOIN (SELECT COUNT(*) as numOfPost, userid FROM tbProduct GROUP BY userid) e ' +
							'ON e.userid = a.userID '+
							'LEFT JOIN (SELECT COUNT(*) as numfollowing,userid FROM tbFollow group by userid) h ' +
							'ON h.userid = a.userID '+
							'LEFT JOIN (SELECT keyword_id, userid, invisible, status FROM tbKeyword_user where invisible = 0 and status = 0) f ' +
							'ON f.userid = a.userID '+
							'LEFT JOIN (SELECT name as key_name,id FROM tbKeyword) g ON g.id = f.keyword_id ' +
							'GROUP BY a.userID';

	  	db.query(sql,token,function(err,result){
	  		if (result == '' || result == null){
	  			res.json({'message':'No result','code':0});
	  		}else {
	  			var obj = new Object();
	  			obj.userid = result[0].userID;
	  			obj.username = result[0].username;
	  			obj.email = result[0].email;
	  			obj.website = result[0].website;
	  			obj.country = result[0].country;
	  			obj.birthday = result[0].birthday;
	  			obj.sex = result[0].sex;
	  			obj.pickup_location = result[0].pickup_location;
	  			obj.firstname = result[0].first_name;
	  			obj.lastname = result[0].last_name;
	  			obj.avatar = (result[0].path == null) ? '/uploads/default.png' : result[0].path;
	  			obj.thumb = (result[0].thumb == null) ? '/uploads/default_300.png' : result[0].thumb;
	  			obj.thumb2 = (result[0].thumb2 == null) ? '/uploads/default_120.png' : result[0].thumb2;
  				obj.keyword = (result[0].keyword != null) ? utf8_decode(result[0].keyword) : '';
					obj.phone = result[0].phone;
					obj.rate = (result[0].avgRate == null) ? 0 : result[0].avgRate;
					obj.numOfPost = (result[0].numOfPost == null) ? 0 : result[0].numOfPost;
					obj.numfollower = (result[0].numfollower == null) ? 0 : result[0].numfollower;
					obj.numfollowing = (result[0].numfollowing == null) ? 0 : result[0].numfollowing;

  				res.json({'obj':obj,'code':1});
			}
		});
	}
});



// edit
app.post('/user/edit', function (req, res) {
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
			var status = req.body.status;
			var token = req.body.token;
			var website = req.body.website;
			var country = req.body.country;
			var birthday = req.body.birthday.split('.');
			var new_birthday = new Date(birthday[2], parseInt(birthday[1])-1, birthday[0]);
			var firstname = req.body.firstname;
			var lastname = req.body.lastname;
			var sex = req.body.sex;
			var email = req.body.email;
			var pickup_location = req.body.pickup_location;
			var phone = req.body.phone;
			var keyword = utf8_encode(req.body.keyword);
			var listkeyword = keyword.split(',');
			
			console.log(listkeyword);
			
			var rsl = db.query('select * from tbUser where token = ?', token, function(err, result){
				if (result == '') {
					res.json({'message':'Not Found!','code':0});
				} else {
					if (phone != '' ){
						if (validator.isNumeric(phone) === false){
							res.json({'message':'This phone field is only numbers!','code':0});
						} else if (validator.isEmail(email) === false) {
							res.json({'message':'Wrong format email! Please try again','code':0});
						}
					}
					if (email == ''){
						res.json({'message':'PLease enter type email field!','code':0});
					}else if(validator.isEmail(email) === false){
						res.json({'message':'Wrong format email! Please try again','code':0});
					}else {
						
						db.query('select * from tbUser where email = ? and token <> ? ',[email,token],function(error,result12){
							if (result12 != ''){
								res.json({'message':'This email currently exists.','code':0});
							}else {
								//KEYWORD
								var sql = 'select * from tbKeyword where status = 0';
								var sql2 = 'SELECT b.id,b.name,a.id as idkey_user,a.status FROM `tbKeyword_user` AS a '+
													 'LEFT JOIN (SELECT name,id FROM tbKeyword) b on b.id = a.keyword_id '+
													 'WHERE a.userid = ? and a.status = 0';
						  	db.query(sql, function(err,rsl){
						  		db.query(sql2, result[0].id, function(err2,rsl2){
							  		if(rsl != ''){
							  			if (listkeyword != ''){
								  			var i, i2,i3, trace;  
								  			var listkey_sg = [];
								  			var listkey_id = [];
											var currentkey = [];
								  			for (i = 0; i < rsl.length; i++)
								  			{
								  			  listkey_sg.push(rsl[i].name);
								  			  listkey_id.push(rsl[i].id);
								  			}
											var currenttime = new Date();
											for (i3 = 0 ; i3<rsl2.length; i3++) {
												currentkey[i3] = rsl2[i3].name;
												if (in_array(rsl2[i3].name,listkeyword) === false ){
													db.query('update tbKeyword_user set status = 1,deletetime = ?  where id = ?', [currenttime,rsl2[i3].idkey_user] );
												}
											}
										    //db.query('delete from tbKeyword_user where userid = ? and status = 0', result[0].id);
						            // insert new keyword
									
						            for (i2=0; i2 < listkeyword.length; i2++){
						              if ((trace = in_array(listkeyword[i2], listkey_sg)) === false){
						                db.query('insert into tbKeyword (name ,status) values (?,?)',[listkeyword[i2], 0], function(err3, rsl3){
						                  if (!err3) {
						                    db.query('insert into tbKeyword_user (userid, keyword_id) values (?,?)',[result[0].id,rsl3.insertId]);
						                  }
						                });
						              }
						              else
						              {	
										if(in_array(listkeyword[i2],currentkey) === false) {
											db.query('insert into tbKeyword_user (userid, keyword_id) values (?,?)',[result[0].id, listkey_id[trace]]);
										}
						              }
						            }
					           	}
									  }
					  				//update info user
					  				db.query('UPDATE tbUser SET website = ?, country = ?, birthday = ?, first_name = ?, last_name = ?, pickup_location = ?, phone = ? , sex = ?, email = ?, status = ? WHERE token = ?', [website,country,new_birthday,firstname,lastname,pickup_location,phone,sex,email,status,token],function(error1,result1){
					  					if (error1){
					  						res.json({'message':'Failed!','code':0});
					  					}else {
					  						res.json({'message':'Update success!','code':1});
					  					}
					  				});
								  });
						    });
						    
							} //end if check email
						});
					}
			  }
		  });
	}	  
});

//change password
app.post('/user/changepass',function(req,res){
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		var password_old = req.body.passold;
		var passnew = req.body.passnew;
		var confirm = req.body.confirm;
		var sql = 'select * from tbUser where token = ?';
		db.query(sql,token,function(err,rsl){
			if (rsl == ''){
				res.json({'message':'This token is incorrect','code':405});
			}else {
				if (md5(password_old) != rsl[0].password){
					res.json({'message':'current password incorrect','code':615});
				}else if (passnew == ''){
					res.json({'message':'Please enter password new','code':616});
				}else if (passnew.length < 6){
					res.json({'message':'Password consists 6 characters!','code':604});
				}else if (passnew != confirm){
					res.json({'message':'Error, Password and confirm mismatch.','code':605});
				}else {
					db.query('update tbUser SET password = ? where token = ?',[md5(passnew),token],function(err2,rsl2){
						res.json({'message':'Change password success!','code':1});
					});
				}
			}
		});
	}
});

// show post for user
app.post('/user/post', function(req,res) {
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		var sql01 = 'select * from tbUser where token = ? ';
		var sql1 = 'SELECT '+
					 'a.*,b.*,c.avatar,c.avatar_thumb,c.avatar_thumb120,d.*,e.*,f.*,m.statuslike,n.numRate,n.statusrate,o.statusbuy, '+
					 'group_concat(name_key separator ",") as listkey,imgpost,imgpost_thumb,imgpost_thumb120 '+
					 'FROM tbProduct AS a '+
					 'INNER JOIN (SELECT id as user_id, username, pickup_location, token ,latest_like_minded, latest_friend_purchase, latest_nearby_purchase FROM tbUser) b ON a.userid = b.user_id '+
					 'LEFT JOIN (SELECT belong,path as avatar,thumb as avatar_thumb,thumb2 as avatar_thumb120 FROM tbImage where status = 0) c ON c.belong = b.user_id '+
					 'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) d ON d.postid = a.id '+
					 'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) e ON e.postid = a.id '+
					 'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) f ON f.postid = a.id '+
					 'LEFT JOIN (SELECT GROUP_CONCAT(path) as imgpost,GROUP_CONCAT(thumb) AS imgpost_thumb,GROUP_CONCAT(thumb2) AS imgpost_thumb120, belong FROM tbImage WHERE status= 1 GROUP BY 	belong) g ON g.belong = a.id '+
					 'LEFT JOIN (SELECT keyword_id,postid from tbKeyword_product) i on i.postid = a.id '+
					 'LEFT JOIN (SELECT name as name_key,id FROM tbKeyword) h on h.id = i.keyword_id '+
					 'LEFT JOIN (SELECT userid,postid,content,status as statuslike FROM tbActivity WHERE userid = ? AND status = 0 GROUP BY postid) m ON m.postid = a.id '+
					 'LEFT JOIN (SELECT userid,postid,content as numRate,status as statusrate FROM tbActivity WHERE userid = ? AND status = 1 GROUP BY postid) n ON n.postid = a.id '+
					 'LEFT JOIN (SELECT userid,postid,content,status as statusbuy FROM tbActivity WHERE userid = ? AND status = 3 GROUP BY postid) o ON o.postid = a.id '+
					 'WHERE b.token = ? '+
					 'GROUP BY a.id '+
					 'ORDER BY a.createtime DESC';
						 
		var sql2 = 'SELECT c.*,b.*,d.likes,e.comment,f.rate, '+
					 'group_concat(g.path) as imgpost, '+
					 'group_concat(g.thumb) as imgpost_thumb, '+
					 'group_concat(g.thumb2) as imgpost_thumb2, '+
					 'h.statuslike,i.numRate,i.statusrate,o.statusbuy,j.avatar,j.avatar_thumb,j.avatar_thumb120 '+
					 'FROM tbFollow AS a '+
					 'INNER JOIN (SELECT id as user_id,username,email,token,device_token,website from tbUser) b on b.user_id = a.user_follow '+
					 'INNER JOIN (SELECT * from tbProduct) c on c.userid = b.user_id '+
					 'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) d ON d.postid = c.id '+
					 'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) e ON e.postid = c.id '+
					 'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) f ON f.postid = c.id '+
					 'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 1) g ON g.belong = c.id '+
					 'LEFT JOIN (SELECT userid,postid,content,status as statuslike FROM tbActivity WHERE userid = ? AND status = 0 GROUP BY postid) h ON h.postid = c.id '+
					 'LEFT JOIN (SELECT userid,postid,content as numRate,status as statusrate FROM tbActivity WHERE userid = ? AND status = 1 GROUP BY postid) i ON i.postid = c.id '+
					 'LEFT JOIN (SELECT userid,postid,content,status as statusbuy FROM tbActivity WHERE userid = ? AND status = 3 GROUP BY postid) o ON o.postid = c.id '+
					 'LEFT JOIN (SELECT belong,path as avatar,thumb as avatar_thumb,thumb2 as avatar_thumb120 FROM tbImage WHERE status = 0) j on j.belong = b.user_id '+
					 'WHERE a.userid = ? '+
					 'GROUP BY c.id '+
					 'ORDER BY c.createtime DESC';
	
		db.query(sql01,token,function(err,rsl){
			if (rsl == ''){
				res.json({'message':'No result','code':0});
			}else {
				db.query(sql1,[ rsl[0].id, rsl[0].id, rsl[0].id, token],function(err1,rsl1){
					
					db.query(sql2,[rsl[0].id, rsl[0].id, rsl[0].id, rsl[0].id],function(err2,rsl2){
						var data1 = [];
						var data2 = [];
						var i1;
						var i2;
						if (rsl1 != ''){
								for (i1 = 0; i1 < rsl1.length; ++i1) {
										var object1 = new Object();
										object1.token = token;
										object1.productid = rsl1[i1].id;
										object1.userid = rsl1[i1].userid;
										object1.username = rsl1[i1].username;
										object1.avatar = (rsl1[i1].avatar == null) ? '/uploads/default.png' : rsl1[i1].avatar;
										object1.avatar_thumb = (rsl1[i1].avatar_thumb == null) ? '/uploads/default_300.png' : rsl1[i1].avatar_thumb;
										object1.avatar_thumb120 = (rsl1[i1].avatar_thumb120 == null) ? '/uploads/default_120.png' : rsl1[i1].avatar_thumb120;
										
										if (rsl1[i1].meet_in_person === 1){
											object1.meet_in_person = 'Yes';
											object1.pickup_location = rsl1[i1].pickup_location;
										}else if (rsl1[i1].meet_in_person === 0){
											object1.meet_in_person = 'No';
											object1.pickup_location = null;
										}
										
										//status like
										object1.statuslike = (rsl1[i1].statuslike === 0) ? 1 : 0;
										object1.statusrate = (rsl1[i1].statusrate === 1) ? rsl1[i1].numRate : 0;
										object1.statusbuy = (rsl1[i1].statusbuy === 3) ? 1 : 0;
										
										object1.lat = rsl1[i1].lat;
										object1.lon = rsl1[i1].lon;
										object1.contentMeetInPerson = rsl1[i1].contentMeetInPerson;
										object1.location = rsl1[i1].location;
										object1.add_to_map = (rsl1[i1].add_to_map == 1) ? 'Yes' : 'No';
										//obj.type = result[index].type;
										object1.price = rsl1[i1].price;
										object1.country = rsl1[i1].country;
										if (rsl1[i1].shipping === 1){
											object1.shipping = 'Yes';
										}else if(rsl1[i1].shipping === 0){
											object1.shipping = 'No';
										}
										object1.contentShipping = rsl1[i1].contentShipping;
										object1.numOfLike = (rsl1[i1].likes == null) ? 0 : rsl1[i1].likes;
										object1.numOfComment = (rsl1[i1].comment == null) ? 0 : rsl1[i1].comment;
										object1.avgrate = (rsl1[i1].rate == null) ? 0 : rsl1[i1].rate;
										object1.sold = rsl1[i1].sold;
										object1.createtime = rsl1[i1].createtime;
										
										object1.typepost = rsl1[i1].type;
										object1.type = rsl1[i1].type;
										if (rsl1[i1].type == 1){
												var img = [];
												var img2 = [];
												var obj2 = new Object(),obj3 = new Object();
												obj2.path = (rsl1[i1].description == '') ? '/uploads/new_product_300.png' : rsl1[i1].description;
												obj2.height = rsl1[i1].height;
												obj2.width = rsl1[i1].width;
												obj2.text = utf8_decode(rsl1[i1].text);
												
												obj3.path = (rsl1[i1].imgstories_120 == '') ? '/uploads/new_product_120.png' : rsl1[i1].imgstories_120;
												obj3.height = rsl1[i1].height;
												obj3.width = rsl1[i1].width;
												obj3.text = utf8_decode(rsl1[i1].text);
												obj3.pathoriginal = rsl1[i1].description;
												
												img[0] = obj2;
												img2[0] = obj3;
												object1.imgpost_thumb = img;
												object1.imgpost = img2;
										}else {
											object1.description = utf8_decode(rsl1[i1].description);
											//img original
											if (rsl1[i1].imgpost == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product.png';
												img[0] = obj2;
												object1.imgpost = img;
											}else {
												var array = rsl1[i1].imgpost.split(',');
												var in2;
												var newarr = [];
												for (in2 = 0; in2 < array.length; in2++){
													var obj3 = new Object();
													obj3.path = array[in2];
													newarr[in2] = obj3;
												}
												object1.imgpost = newarr;
											}
											//img thumb 300
											if (rsl1[i1].imgpost_thumb == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product_300.png';
												img[0] = obj2;
												object1.imgpost_thumb = img;
											}else {
												var array = rsl1[i1].imgpost_thumb.split(',');
												var in3;
												var newarr = [];
												for (in3 = 0;in3 < array.length; in3++){
													var obj3 = new Object();
													obj3.path = array[in3];
													newarr[in3] = obj3;
												}
												object1.imgpost_thumb = newarr;
											}
											//img thumb 120
											if (rsl1[i1].imgpost_thumb120 == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product_120.png';
												img[0] = obj2;
												object1.imgpost_thumb120 = img;
											}else {
												var array = rsl1[i1].imgpost_thumb120.split(',');
												var in4;
												var newarr = [];
												for (in4 = 0;in4 < array.length; in4++){
													var obj3 = new Object();
													obj3.path = array[in4];
													newarr[in4] = obj3;
												}
												object1.imgpost_thumb120 = newarr;
											}
										}
										
										object1.keyword = (rsl1[i1].listkey == null || typeof rsl1[i1].listkey == 'undefined') ? '' : utf8_decode(rsl1[i1].listkey);
									
									
									
									/******************/
									data1.push(object1);
									/******************/
								}
								//////////////END DATA1 												
						}
						
						if (rsl2 != ''){
								for (i2 = 0; i2 < rsl2.length; ++i2) {
									var object2 = new Object();
									
										object2.token = rsl2[i2].token;
										object2.productid = rsl2[i2].id;
										object2.userid = rsl2[i2].userid;
										object2.username = rsl2[i2].username;
										object2.avatar = (rsl2[i2].avatar == null) ? '/uploads/default.png' : rsl2[i2].avatar;
										object2.avatar_thumb = (rsl2[i2].avatar_thumb == null) ? '/uploads/default_300.png' : rsl2[i2].avatar_thumb;
										object2.avatar_thumb120 = (rsl2[i2].avatar_thumb120 == null) ? '/uploads/default_120.png' : rsl2[i2].avatar_thumb120;
										
										
										if (rsl2[i2].meet_in_person === 1){
											object2.meet_in_person = 'Yes';
											object2.pickup_location = rsl2[i2].pickup_location;
										}else if (rsl2[i2].meet_in_person === 0){
											object2.meet_in_person = 'No';
											object2.pickup_location = null;
										}
										
										//status like
										object2.statuslike = (rsl2[i2].statuslike === 0) ? 1 : 0;
										object2.statusrate = (rsl2[i2].statusrate === 1) ? rsl2[i2].numRate : 0;
										object2.statusbuy = (rsl2[i2].statusbuy === 3) ? 1 : 0;
										
										object2.contentMeetInPerson = rsl2[i2].contentMeetInPerson;
										object2.location = rsl2[i2].location;
										object2.add_to_map = (rsl2[i2].add_to_map == 1) ? 'Yes' : 'No';
										//obj.type = result[index].type;
										object2.price = rsl2[i2].price;
										object2.country = rsl2[i2].country;
										if (rsl2[i2].shipping === 1){
											object2.shipping = 'Yes';
										}else if(rsl2[i2].shipping === 0){
											object2.shipping = 'No';
										}
										object2.contentShipping = rsl2[i2].contentShipping;
										object2.numOfLike = (rsl2[i2].likes == null) ? 0 : rsl2[i2].likes;
										object2.numOfComment = (rsl2[i2].comment == null) ? 0 : rsl2[i2].comment;
										object2.avgrate = (rsl2[i2].rate == null) ? 0 : rsl2[i2].rate;
										object2.sold = rsl2[i2].sold;
										object2.createtime = rsl2[i2].createtime;
										
										object2.lat = rsl2[i2].lat;
										object2.lon = rsl2[i2].lon;
										object2.typepost = rsl2[i2].type;
										object2.type = rsl2[i2].type;
										if (rsl2[i2].type == 1){
												var img = [];
												var img2 = [];
												var obj2 = new Object(),obj3 = new Object();
												obj2.path = (rsl2[i2].description == '') ? '/uploads/new_product_300.png' : rsl2[i2].description;
												obj2.height = rsl2[i2].height;
												obj2.width = rsl2[i2].width;
												obj2.text = utf8_decode(rsl2[i2].text);
												
												obj3.path = (rsl2[i2].imgstories_120 == '') ? '/uploads/new_product_120.png' : rsl2[i2].imgstories_120;
												obj3.height = rsl2[i2].height;
												obj3.width = rsl2[i2].width;
												obj3.text = utf8_decode(rsl2[i2].text);
												obj3.pathoriginal = rsl2[i2].description;
												
												
												img[0] = obj2;
												img2[0] = obj3;
												object2.imgpost_thumb = img;
												object2.imgpost = img2;
										}else {
											object2.description = utf8_decode(rsl2[i2].description);
											//img original
											if (rsl2[i2].imgpost == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product.png';
												img[0] = obj2;
												object2.imgpost = img;
											}else {
												var array = rsl2[i2].imgpost.split(',');
												var in2;
												var newarr = [];
												for (in2 = 0; in2 < array.length; in2++){
													var obj3 = new Object();
													obj3.path = array[in2];
													newarr[in2] = obj3;
												}
												object2.imgpost = newarr;
											}
											//img thumb 300
											if (rsl2[i2].imgpost_thumb == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product_300.png';
												img[0] = obj2;
												object2.imgpost_thumb = img;
											}else {
												var array = rsl2[i2].imgpost_thumb.split(',');
												var in3;
												var newarr = [];
												for (in3 = 0;in3 < array.length; in3++){
													var obj3 = new Object();
													obj3.path = array[in3];
													newarr[in3] = obj3;
												}
												object2.imgpost_thumb = newarr;
											}
											//img thumb 120
											if (rsl2[i2].imgpost_thumb120 == null){
												var img = [];
												var obj2 = new Object();
												obj2.path = '/uploads/new_product_120.png';
												img[0] = obj2;
												object2.imgpost_thumb120 = img;
											}else {
												var array = rsl2[i2].imgpost_thumb120.split(',');
												var in4;
												var newarr = [];
												for (in4 = 0;in4 < array.length; in4++){
													var obj3 = new Object();
													obj3.path = array[in4];
													newarr[in4] = obj3;
												}
												object2.imgpost_thumb120 = newarr;
											}
										}
										
										object2.keyword = (rsl2[i2].listkey  || typeof rsl2[i2].listkey == 'undefined') ? '' : utf8_decode(rsl2[i2].listkey);
									
									
									
									/******************/
									data2.push(object2);
									/******************/
								}
						}
						//////////END DATA2

						data = data1.concat(data2);
						//data.sort(compare);
						data.sort(function(a,b) { return parseFloat(b.productid) - parseFloat(a.productid) } );
						res.json({'obj':data,'code':1});
						
						
					});	
					
				});
			}
		});
	}

});

function compare(a,b) {
  if (a.createtime < b.createtime)
     return 1;
  if (a.createtime > b.createtime)
    return -1;
  return 0;
}

//show post for user
app.post('/user/myshop', function(req,res) {
	if (typeof req.body.token == 'undefined' || typeof req.body.token2 == 'undefined'){
		res.json({'message':'Not Found','code':404});
	}else if (req.body.token == '' || req.body.token2 == ''){
		res.json({'message':'Not Found','code':404});
	}else {
		var token = req.body.token; //token user usershop
		var token2 = req.body.token2; //token user login
		var sql2 = 'select * from tbImage where belong = ? and status =?';
		var sql = 'SELECT a.*,b.user_id, b.username, b.pickup_location, b.token, c.path, c.thumb,c.thumb2, d.likes,e.comment,f.rate,group_concat(g.path separator ",") as imgpost,group_concat(g.thumb separator ",") as imgpost_thumb,group_concat(g.thumb2 separator ",") as imgpost_thumb120 FROM tbProduct AS a '+
					'LEFT JOIN (SELECT id as user_id, username, pickup_location, token FROM tbUser) b ON a.userid = b.user_id '+
					'LEFT JOIN (SELECT  belong,path,thumb,thumb2 FROM tbImage where status = 0) c ON c.belong = b.user_id '+
					'LEFT JOIN (SELECT count(*) AS likes,postid FROM tbActivity WHERE status = 0 GROUP BY postid) d ON d.postid = a.id '+
					'LEFT JOIN (SELECT count(*) AS comment,postid FROM tbActivity WHERE status = 2 GROUP BY postid) e ON e.postid = a.id '+
					'LEFT JOIN (SELECT avg(content) AS rate,postid FROM tbActivity WHERE status = 1 GROUP BY postid) f ON f.postid = a.id '+
					'LEFT JOIN (SELECT path,thumb,thumb2,belong FROM tbImage WHERE status= 1) g ON g.belong = a.id '+
					'WHERE b.token = ? '+
					'GROUP BY a.id '+
					'ORDER BY `a`.`createtime` DESC';			
							
		var sqlqr = 'select a.id,a.username,b.path,b.thumb,b.thumb2 from tbUser as a '+
					'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) b on b.belong = a.id '+
					'where a.token = ?';
															
		var sql3 = 'select count(*) as totalpost from tbProduct WHERE userid = ?';
		var sql4 = 'select avg(content) as avgrateall FROM tbActivity WHERE userid = ? and status = 1';
		var sql5 = 'select count(*) as totalfollower FROM (select a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where user_follow = ? order by createtime desc) as a2 group by a2.userid) as a1 inner join (select id from tbUser) b on b.id = a1.user_follow where a1.status = 0) as a';
		var sql6 = 'select count(*) as totalfollowing FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 inner join (select id from tbUser) b on b.id = a1.user_follow where a1.status = 0) as a';
		var sql7 = 'select id,token from tbUser where token = ?';
		var sql8 = 'select status from tbFollow where userid = ? and user_follow = ? order by createtime desc limit 1 ';
		db.query(sqlqr, token, function(error1,result1){
				if (error1){
					res.json({'message':'Not Found', 'code':404});
				}else {
					if (result1.length === 0){
						res.json({'message':'Result Empty', 'code':405});
					}else if (token2 == null || token2 == ''){
						res.json({'message':'Not Found', 'code':404});
					}else {
						db.query(sql, token, function(error,result){
						db.query(sql3,result1[0].id,function(err1,rsl1){
							db.query(sql4,result1[0].id,function(err2,rsl2){
								db.query(sql5,result1[0].id,function(err3,rsl3){
									db.query(sql6,result1[0].id,function(err4,rsl4){
										db.query(sql7,token2,function(err5,rsl5){
											if (rsl5 == ''){
												
												var totalFollower = 0;
												var totalFollowing = 0;
												var data = new Array();
												for (index = 0; index < result.length; ++index) {
													var obj = new Object();
													obj.productid = result[index].id;
													obj.userid = result[index].userid;
													obj.username = result[index].username;
													if (result[index].path == null){
														obj.avatar = '/uploads/default.png';
													}else {
														obj.avatar = result[index].path;
													}
													//start type post
													obj.typepost = result[index].type;
													obj.type = result[index].type;
													if (result[index].type == 1){
															var img = [];
															var obj2 = new Object();
															obj2.path = (result[index].description == '') ? '/uploads/new_product.png' : result[index].description;
															obj2.width = result[index].width;
															obj2.height = result[index].height;
															obj2.text = result[index].text;
															img[0] = obj2;
															obj.imgpost = img;
													}else {
														obj.description = utf8_decode(result[index].description);
														
														//image orginal
														if (result[index].imgpost == null){
															var img = [];
															var obj2 = new Object();
															obj2.path = '/uploads/new_product.png';
															img[0] = obj2;
															obj.imgpost = img;
														}else {
															var array = result[index].imgpost.split(',');
															var i3;
															var newarr = [];
															for (i3 = 0;i3 < array.length; i3++){
																var obj3 = new Object();
																obj3.path = array[i3];
																newarr[i3] = obj3;
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
															var i3;
															var newarr = [];
															for (i3 = 0;i3 < array.length; i3++){
																var obj3 = new Object();
																obj3.path = array[i3];
																newarr[i3] = obj3;
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
															var i3;
															var newarr = [];
															for (i3 = 0;i3 < array.length; i3++){
																var obj3 = new Object();
																obj3.path = array[i3];
																newarr[i3] = obj3;
															}
															obj.imgpost_thumb120 = newarr;
														}
														
													}
													//end type post
													
													if (result[index].meet_in_person === 1){
														obj.meet_in_person = 'Yes';
														obj.pickup_location = result[index].pickup_location;
													}else if (result[index].meet_in_person === 0){
														obj.meet_in_person = 'No';
														obj.pickup_location = null;
													}
													
													obj.contentMeetInPerson = result[index].contentMeetInPerson;
													obj.location = result[index].location;
													obj.add_to_map = (result[index].add_to_map == 1) ? obj.add_to_map = 'Yes' : obj.add_to_map = 'No';
													obj.price = result[index].price;
													obj.lat = result[index].lat;
													obj.lon = result[index].lon;
													
													if (result[index].shipping === 1){
														obj.shipping = 'Yes';
														obj.country = result[index].country;
													}else if(result[index].shipping === 0){
														obj.shipping = 'No';
														obj.country = null;
													}
													
													obj.contentShipping = result[index].contentShipping;
													obj.numOfLike = (result[index].likes == null) ? 0 : result[index].likes;
													obj.numOfComment = (result[index].comment == null) ? 0 : result[index].comment;
													obj.avgrate = (result[index].rate == null) ? 0 : result[index].rate.toFixed(2);
													obj.sold = result[index].sold;
													obj.createtime = result[index].createtime;
													
													data[index] = obj;
												}
												
												var status = 'The secondary of token is incorrect or not exist';
												var avgrate = (rsl2[0].avgrateall == null) ? 0 : rsl2[0].avgrateall.toFixed(2);
												
												var avatar = (result1[0].thumb == null) ? '/uploads/default_300.png' : result1[0].thumb;
												
												res.json({'obj':data,
																	'username':result1[0].username,
																	'totalpost':rsl1[0].totalpost,
																	'avgrateall':avgrate,
																	'totalfollower':rsl3[0].totalfollower,
																	'totalfollowing':rsl4[0].totalfollowing,
																	'avatar':avatar,
																	'status':status,
																	'code':1
																});
											
											}else {
												//db.query(sql8,[result1[0].id, rsl5[0].id],function(err1,rsl6){
												db.query(sql8,[rsl5[0].id, result1[0].id],function(err1,rsl6){
													var totalFollower = 0;
													var totalFollowing = 0;
													var data = new Array();
													for (index = 0; index < result.length; ++index) {
														var obj = new Object();
														obj.productid = result[index].id;
														obj.userid = result[index].userid;
														obj.username = result[index].username;
														obj.avatar = (result[index].thumb == null) ? '/uploads/default_300.png' : result[index].thumb;
														
														
														if (result[index].meet_in_person === 1){
															obj.meet_in_person = 'Yes';
															obj.pickup_location = result[index].pickup_location;
														}else if (result[index].meet_in_person === 0){
															obj.meet_in_person = 'No';
															obj.pickup_location = null;
														}
														
														//start type post
														obj.typepost = result[index].type;
														obj.type = result[index].type;
														if (result[index].type == 1){
																var img = [];
																var obj2 = new Object();
																obj2.path = (result[index].description == '') ? '/uploads/new_product.png' : result[index].description;
																obj2.width = result[index].width;
																obj2.height = result[index].height;
																obj2.text = result[index].text;
																img[0] = obj2;
																obj.imgpost = img;
														}else {
															obj.description = utf8_decode(result[index].description);
															
															//image orginal
															if (result[index].imgpost == null){
																var img = [];
																var obj2 = new Object();
																obj2.path = '/uploads/new_product.png';
																img[0] = obj2;
																obj.imgpost = img;
															}else {
																var array = result[index].imgpost.split(',');
																var i3;
																var newarr = [];
																for (i3 = 0;i3 < array.length; i3++){
																	var obj3 = new Object();
																	obj3.path = array[i3];
																	newarr[i3] = obj3;
																}
																obj.imgpost = newarr;
															}
															
															//img thumb 300
															if (result[index].imgpost_thumb == null){
																var img = [];
																var obj2 = new Object();
																obj2.path = '/uploads/new_product_300.png';
																img[0] = obj2;
																obj.imgpost = img;
															}else {
																var array = result[index].imgpost_thumb.split(',');
																var i3;
																var newarr = [];
																for (i3 = 0;i3 < array.length; i3++){
																	var obj3 = new Object();
																	obj3.path = array[i3];
																	newarr[i3] = obj3;
																}
																obj.imgpost_thumb = newarr;
															}
															
															//img thumb 120
															if (result[index].imgpost_thumb120 == null){
																var img = [];
																var obj2 = new Object();
																obj2.path = '/uploads/new_product_120.png';
																img[0] = obj2;
																obj.imgpost = img;
															}else {
																var array = result[index].imgpost_thumb120.split(',');
																var i3;
																var newarr = [];
																for (i3 = 0;i3 < array.length; i3++){
																	var obj3 = new Object();
																	obj3.path = array[i3];
																	newarr[i3] = obj3;
																}
																obj.imgpost_thumb120 = newarr;
															}
															
														}
														//end type post
														
														obj.contentMeetInPerson = result[index].contentMeetInPerson;
														obj.location = result[index].location;
														obj.add_to_map = (result[index].add_to_map == 1) ? obj.add_to_map = 'Yes' : obj.add_to_map = 'No';
														obj.price = result[index].price;
														obj.lat = result[index].lat;
														obj.lon = result[index].lon;
														
														
														
														if (result[index].shipping === 1){
															obj.shipping = 'Yes';
															obj.country = result[index].country;
														}else if(result[index].shipping === 0){
															obj.shipping = 'No';
															obj.country = null;
														}
														
														obj.contentShipping = result[index].contentShipping;
														obj.numOfLike = (result[index].likes == null) ? 0 : result[index].likes;
														obj.numOfComment = (result[index].comment == null) ? 0 : result[index].comment;
														obj.avgrate = (result[index].rate == null) ? 0 : result[index].rate.toFixed(2);
														obj.sold = result[index].sold;
														obj.createtime = result[index].createtime;
														
														data[index] = obj;
													}
													var status;
													if (rsl6 != ''){
														status = (rsl6[0].status == 0) ? 'Unfollow' : 'Follow';
													}else {
														status = (token == token2) ? 'Edit Profile' : 'Follow';
													}
													
													var avgrate = (rsl2[0].avgrateall == null) ? 0 : rsl2[0].avgrateall.toFixed(2);
													var totalfollower = (rsl3 == null) ? 0 : rsl3[0].totalfollower;
													var totalFollowing = (rsl4 == null) ? 0 : rsl4[0].totalfollowing;
													var avatar = (result1[0].thumb == null) ? '/uploads/default_300.png' : result1[0].thumb;
													
													res.json({
														'obj':data,
														'username':result1[0].username,
														'totalpost':rsl1[0].totalpost,
														'avgrateall':avgrate,
														'totalfollower':totalfollower,
														'totalfollowing':totalFollowing,
														'avatar':avatar,
														'status':status,
														'code':1
													});
												});
											}
										});
									});
								});
							});
						});
					});
				}
			}
		});
	}
});	    


//get list post of user following
app.post('/user/postfollowing', function(req,res){
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token;
		var sql1 = 'select * from tbUser where token = ?';
		var sql2 = 'SELECT d.id as postid, d.userid, b.username,b.email, b.website, b.country, b.phone, d.description, d.location, d.price, d.sold, c.avatar,c.avatar_thumb,c.avatar_thumb120, GROUP_CONCAT(e.`path` separator ",") as imgpost,GROUP_CONCAT(e.`thumb` separator ",") as imgpost_thumb,GROUP_CONCAT(e.`thumb2` separator ",") as imgpost_thumb120 '+ 
					'FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) AS a '+
					'LEFT JOIN (SELECT * FROM tbProduct) d ON d.userid = a.user_follow '+
					'LEFT JOIN (SELECT id,username,email,website,country,phone,token FROM tbUser) b ON b.id = a.user_follow '+
					'LEFT JOIN (SELECT belong,path as avatar,thumb as avatar_thumb,thumb2 as avatar_thumb120 FROM tbImage WHERE status = 0) c ON c.belong = a.user_follow '+
					'LEFT JOIN (SELECT path,thumb,thumb2,belong FROM tbImage WHERE status = 0) e ON e.belong = d.id '+
					'GROUP BY d.id '+
					'ORDER BY d.createtime DESC';
		db.query(sql1,token,function(err1,result1){
			if (result1 == null || result1 == ''){
				res.json({'message':'Not Found','code':0});
			}else {
				db.query(sql2, result1[0].id, function(err2,result2){
					if(result2 == null || result2 == ''){
						res.json({'message':'Not Found', 'code':0});
					}else {
						var i;
						var data = [];
						for (i = 0; i < result2.length; i++){
							var obj = new Object();
							obj.postid = result2[i].postid;
							obj.userid = result2[i].userid;
							obj.username = result2[i].username;
							obj.email = result2[i].email;
							obj.website = result2[i].website;
							obj.country = result2[i].country;
							obj.phone = result2[i].phone;
							obj.location = result2[i].location;
							obj.price = result2[i].price;
							obj.sold = result2[i].sold;
							obj.avatar = (result2[i].avatar == null) ? '/uploads/default.png' : result2[i].avatar;
							obj.avatar_thumb = (result2[i].avatar_thumb == null) ? '/uploads/default_300.png' : result2[i].avatar_thumb;
							obj.avatar_thumb120 = (result2[i].avatar_thumb120 == null) ? '/uploads/default_120.png' : result2[i].avatar_thumb120;
							
							//obj.description = result2[i].description;
							obj.typepost = result2[i].type;
							obj.type = result2[i].type;
							if (result2[i].type == 1){
									var img = [];
									var obj2 = new Object();
									obj2.path = (result2[i].description == '') ? '/uploads/new_product.png' : result2[i].description;
									img[0] = obj2;
									obj.imgpost = img;
							}else {
								obj.description = utf8_decode(result2[i].description);
							
								//img original
								if (result2[i].imgpost == null){
									var img = [];
									var obj2 = new Object();
									obj2.path = '/uploads/new_product.png';
									img[0] = obj2;
									obj.imgpost = img;
								}else {
									var array = result2[i].imgpost.split(',');
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
								if (result2[i].imgpost_thumb == null){
									var img = [];
									var obj2 = new Object();
									obj2.path = '/uploads/new_product.png';
									img[0] = obj2;
									obj.imgpost_thumb = img;
								}else {
									var array = result2[i].imgpost_thumb.split(',');
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
								if (result2[i].imgpost_thumb120 == null){
									var img = [];
									var obj2 = new Object();
									obj2.path = '/uploads/new_product.png';
									img[0] = obj2;
									obj.imgpost_thumb120 = img;
								}else {
									var array = result2[i].imgpost_thumb120.split(',');
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
							obj.price = result2[i].price;
							
							/**************/
							data[i] = obj;
							/**************/
						}
						res.json({'obj':data,'code':1});
					}
				});
			}
		});
	}
});


//get list follower for user
app.post('/user/followers', function(req,res){
	if (typeof req.body.token == 'undefined' || typeof req.body.token2 == 'undefined'){
        res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == '' || req.body.token == ''){
        res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token2; // token user have list follower
		var token2 = req.body.token; //token user login

		console.log('followers',token, token2);

		var sql1 = 'select * from tbUser where token = ?';
		var sql2 =  'SELECT b.id,b.username,b.email,b.website,b.country,b.phone,b.token,c.* FROM (select a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where user_follow = ? order by createtime desc) as a2 group by a2.userid) as a1 where a1.status = 0) AS a '+
								'INNER JOIN (SELECT id,username,email,website,country,phone,token FROM tbUser) b ON b.id = a.userid '+
								'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) c ON c.belong = b.id ';

		var sql3 = 'select a.* from (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as a';


		db.query(sql1,token,function(err1,result1){
			db.query(sql1,token2,function(errcheck1,rslcheck1){
				if (result1 == ''){
					res.json({'message':'Not Found','code':0});
				}else {
						db.query(sql2, result1[0].id, function(err2,result2){
							db.query(sql3, result1[0].id, function(err3,result3){
								db.query(sql3, rslcheck1[0].id, function(err4,result4){
									if(result2 == ''){
										res.json({'message':'Not Found', 'code':0});
									}else {
										var i,i2,i3;
										var data = [],data2 = [],data3 = [];
		
										//create list userfollow
										for(i2 = 0;i2<result3.length;i2++){
											data2[i2] = result3[i2].user_follow;
										}
										for(i3 = 0;i3< result4.length;i3++) {
											data3[i3] = result4[i3].user_follow;
										}
										
										for (i = 0; i < result2.length; i++){
											var obj = new Object();
											obj.userid = result2[i].id;
											obj.username_follow = result2[i].username;
											obj.email = result2[i].email;
											obj.website = result2[i].website;
											obj.country = result2[i].country;
											obj.phone = result2[i].phone;
											obj.path = (result2[i].path == null) ? '/uploads/default.png' : result2[i].path;
											obj.thumb = (result2[i].thumb == null) ? '/uploads/default_300.png' : result2[i].thumb;
											obj.thumb120 = (result2[i].thumb2 == null) ? '/uploads/default_120.png' : result2[i].thumb2;
											obj.token = result2[i].token;
											if (token === token2) {
												obj.status = (in_array(result2[i].id,data2) === false) ? 0 : 1;
											}else {
												obj.status = (in_array(result2[i].id,data3) === false) ? 0 : 1;
											}
											
											data[i] = obj;
										}
										
										res.json({'obj':data,'code':1});
									}
								});
							});
						});
					}
			});
		});
	}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get list following for user
app.post('/user/following', function(req,res){
	if (typeof req.body.token == 'undefined' || typeof req.body.token2 == 'undefined'){
        res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == '' || req.body.token == ''){
        res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token2; //token user login
		var token2 = req.body.token; //token user have list
		var sql1 = 'select * from tbUser where token = ?';
		var sql2 =  'SELECT a.*,b.id,b.username,b.email,b.website,b.country,b.phone,b.token,c.path,c.thumb,c.thumb2 FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) AS a '+
					'INNER JOIN (SELECT id,username,email,website,country,phone,token FROM tbUser) b ON b.id = a.user_follow '+
					'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage where status = 0) c ON c.belong = b.id ';
							
		var sql3 = 'SELECT a.* FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as a';
								
		db.query(sql1,token,function(err1,result1){
			db.query(sql1,token2,function(err12,result12){
					if (result1 == null || result1 == ''){
						res.json({'message':'Not Found','code':0});
					}else {
						db.query(sql2, result1[0].id, function(err2,result2){
							db.query(sql3,result12[0].id, function(err3,result3){
									
									if(result2 == null || result2 == ''){
										res.json({'message':'Not Found', 'code':0});
									}else {
										var i,i2;
										var data = [],data2 = [];
										
										if (token2 !== token) {
											if (result3 !== ''){
												for (i2 = 0; i2<result3.length; i2++){
													data2[i2] = result3[i2].user_follow;
												}
											}
										}
										for (i = 0; i < result2.length; i++){
											var obj = new Object();
											obj.userid_follow = result2[i].user_follow;
											obj.username_follow = result2[i].username;
											obj.email = result2[i].email;
											obj.website = result2[i].website;
											obj.country = result2[i].country;
											obj.phone = result2[i].phone;
											obj.path = (result2[i].path == null) ? '/uploads/default.png' : result2[i].path;
											obj.thumb = (result2[i].thumb == null) ? '/uploads/default_300.png' : result2[i].thumb;
											obj.thumb120 = (result2[i].thumb2 == null) ? '/uploads/default_120.png' : result2[i].thumb2;
											obj.token = result2[i].token;
											if (token2 !== token){
												if (result2[i].user_follow === result12[0].id) {
													obj.status = 1;
												}else {
													obj.status = (in_array(result2[i].user_follow,data2) === false) ? 0 : 1;
												}
											}else {
												obj.status = 2;
											}
											
											
											data[i] = obj;
										}
										res.json({'obj':data,'code':1});
									}
							});
						});
					}
					
			});		
		});
	}
});

//post an item
app.post('/postproduct', function(req,res){
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		var token = req.body.token,
			description = utf8_encode(req.body.caption),
			meet_in_person = req.body.meet_in_person,
			contentMeetInPerson = req.body.contentMeetInPerson,
			location = req.body.location,
			add_to_map = req.body.add_to_map,
			price = req.body.price,
			shipping = req.body.shipping,
			country = req.body.country,
			keyword = utf8_encode(req.body.keyword);
				
				//img
		var imgids = req.body.imgid;
				console.log('imgids',imgids);
		var listimgid = imgids.split(",");
				//end img 
				
		var find = ' ';
		var re = new RegExp(find, 'g');
			str = keyword.replace(re, '');
			listkey = str.split(','),
			tagpeoples = req.body.tagpeople;
			listuserid = tagpeoples.split(',');
			lat = req.body.lat,
			lon = req.body.lon;
				
		var sessionid = req.body.sessionid;
		var deviceid = req.body.deviceid;
		
		var sql1 = 'select * from tbUser where token = ?';
		var sql2 = 'insert into tbProduct (userid, description, meet_in_person, contentMeetInPerson, location, add_to_map, price, shipping, country, lat, lon, sessionid) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

		db.query(sql1,token,function(err,result){
			if (result == null || result == ''){
				res.json({'message':'Not Found','code':0});
			}else {
				db.query(sql2,[result[0].id, description, meet_in_person, contentMeetInPerson, location, add_to_map, price, shipping, country, lat, lon, sessionid],function(err2,rsl2){	
					if (err2){
						res.json({'message':'Insert Failed','code':0});
					} else {
						/**********KEYWORD***********/
						if (listkey != ''){
								//KEYWORD
							var sqlkeyword = 'select * from tbKeyword';
							db.query(sqlkeyword, function(err,rsl){
								if(rsl != ''){
					  var i, i2, trace;
					  var listkey_sg = [];
					  var listkey_id = [];
					  for (i = 0; i < rsl.length; i++)
					  {
						listkey_sg.push(rsl[i].name);
						listkey_id.push(rsl[i].id);
					  }
					  // insert new keyword
					  for (i=0; i < listkey.length; i++){
						if ((trace = in_array(listkey[i], listkey_sg)) === false){
						  db.query('insert into tbKeyword (name ,status) values (?,?)',[listkey[i], 1], function(err3, rsl3){
							if (!err3) {
							  db.query('insert into tbKeyword_product (postid, keyword_id) values (?,?)',[rsl2.insertId,rsl3.insertId]);
							}
						  });
						}
						else
						{
						  db.query('insert into tbKeyword_product (postid, keyword_id) values (?,?)',[rsl2.insertId, listkey_id[trace]]);
						}
					  }
								}
							});
							}
							//END KEYWORD

							/**********TAG PEOPLE********/
							var i3;
							if (listuserid != ''){
								for ( i3 = 0; i3 < listuserid.length; i3++) {
									db.query('insert into tbTag (postid,userid) values (?,?)',[rsl2.insertId,listuserid[i3]]);
									console.log(listuserid[i3]);
									//push
									db.query('select id,device_token,tag,username from tbUser where id =?',listuserid[i3],function(errtag2,rsltag2){
										if (rsltag2 != ''){
											if (rsltag2[0].tag == 1) {
												if (rsltag2[0].device_token != ''){
													db.query('select * from tbUser where device_token = ? ',rsltag2[0].device_token,function(erro1,rsll1){
														if (rsll1 != ''){
															var push = rsll1[0].numPush + 1;
															db.query('update tbUser set numPush = ? where device_token = ? ',[push,rsltag2[0].device_token],function(er,rs){
																pushNotifications(result[0].username,rsltag2[0].device_token,6);
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
							//END TAG PEOPLE//
							
							//update again image id for post
							var i4;
							for (i4 = 0 ; i4 < listimgid.length; i4++){
								db.query('update tbImage set belong = ? where id = ?', [rsl2.insertId, listimgid[i4]]);
							}
							//end update img
							
							//save device
							if (lat != '' && lon != '') {
								geocoder.reverseGeocode( lat, lon, function ( err, data ) {
									var location = data.results[0].formatted_address;
									db.query('select * from tbDevice where deviceid = ? ',deviceid,function(er,rs){
										if (rs != ''){
											db.query('insert into tbUser_device (user_id,device_id,lat,lon,location) values (?,?,?,?,?) ',[result[0].id,rs[0].id,lat,lon,location]);
										}
									});
								});
							}
							//end save
							
							
							res.json({'message':'Post success!','postid':rsl2.insertId,'code':1,});
						}
					});
			}
		});
	}
	
});



//change status for product
app.post('/changesold', function (req,res){
	var postid = req.body.postid;
	var sold = req.body.sold;
	
	console.log('sold',sold);
	console.log('postid',postid);
	
	var sql = 'select * from tbProduct where id = ?';
	var sql2 = 'update tbProduct SET sold = ? where id =?';
	db.query(sql,postid,function(err,rsl){
		if (rsl == ''){
			res.json({'message':'Not Found','code':0});
		}else {
			db.query(sql2,[sold,postid],function(err2,rsl2){
				res.json({'message':'Change Success!','code':1});
			});
		}
	});
});



//like an item
app.post('/likeproduct', function(req,res) {
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
	}else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
	}else {
		 var productid = req.body.productid;
		 var token = req.body.token;
		 var status = 0;
		 var sessionid = req.body.sessionid;
		 var sql1 = 'select * from tbUser where token = ?';
		 var sql2 = 'select a.id,a.username,a.email,a.website,a.country,b.id as idactivity,b.userid,b.postid,b.content,b.status,b.createtime,c.*,d.* from tbUser as a '+
								'LEFT JOIN (select * from tbActivity) b ON b.userid = a.id '+
								'left join (select id,userid from tbProduct) c on c.id = b.postid '+
								'left join (select id as userpost,username as usernamepost,token,device_token,like_one_item from tbUser) d on d.userpost = c.userid '+
								'where a.token = ? and b.postid = ? and b.status = ?';

		 var sql3 = 'select * from tbProduct as a INNER JOIN (SELECT * FROM tbUser) b ON b.id = a.userid where a.id = ? ';
		 db.query(sql1,token,function(err,result1){
			 db.query (sql3, productid, function (err,result){
				if(result1 == ''){
					res.json({'message':'Not Found', 'code':0});
				}else {
					if (result == '' || result == null){
						res.json({'message':'This product is not exist', 'code':0});
					}else {
						 db.query(sql2,[token,productid,0], function (err,result12){
								if (result12.length != 0){
									db.query('update tbActivity SET status = ? WHERE id = ?',[4,result12[0].idactivity],function(err2,rls2){
										db.query('SELECT count(*) AS numOfLike FROM tbActivity WHERE postid = ? and status = ?',[productid,0], function(err,result2){
											res.json({'message':'Unlike success!', 'code':0,'numOfLike': result2[0].numOfLike });
										});
									});
								}else {
									db.query(sql2,[token,productid,4],function(err3,result3){
											if (result3 != ''){
												db.query('update tbActivity SET status = ?,sessionid = ? WHERE id = ? ',[0,sessionid,result3[0].idactivity],function(error,resultup){	
													db.query('SELECT count(*) AS numOfLike FROM tbActivity WHERE postid = ? and status = ?',[productid,0], function(err,resultup23){
														//push
															if (result3[0].like_one_item == 1){
																if (result3[0].device_token != ''){
																	db.query('select * from tbUser where device_token = ? ',result3[0].device_token,function(erro1,rsll1){
																		if (rsll1 != ''){
																			var push = rsll1[0].numPush + 1;
																			db.query('update tbUser set numPush = ? where device_token = ? ',[push,result3[0].device_token],function(er,rs){
																				pushNotifications(result1[0].username,result3[0].device_token,1);
																			});
																		}
																	});
																}
															}
														//end push
														res.json({'message':'OK!You like this post success','code':1, 'numOfLike': resultup23[0].numOfLike});
													});
												});
												
											}else{
												db.query('INSERT INTO tbActivity (userid,postid,status,sessionid) values (?,?,?,?)',[result1[0].id,productid,0,sessionid],function(err,rsl){	
													db.query('SELECT count(*) AS numOfLike FROM tbActivity WHERE postid = ? and status = ?',[productid,0], function(err,result23){
														//push
															if (result[0].like_one_item == 1){
																if (result[0].device_token != ''){
																	db.query('select * from tbUser where device_token = ? ',result[0].device_token,function(erro1,rsll1){
																		if (rsll1 != ''){
																			var push = rsll1[0].numPush + 1;
																			db.query('update tbUser set numPush = ? where device_token = ? ',[push,result[0].device_token],function(er,rs){
																				pushNotifications(result1[0].username,result[0].device_token,1);
																			});
																		}
																	});
																}
															}
														//end push
														res.json({'message':'OK!You like this post success','code':1, 'numOfLike': result23[0].numOfLike});
													});
												});
											}
									});
												
								}
							});
					}
				 }
			 });
		});	 
	}
	 	 
});

//like an item
app.post('/rateproduct', function(req,res) {
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		 var productid = req.body.productid;
		 var token = req.body.token;
		 var status = 1;
		 var rate = req.body.rate;
		 var sessionid = req.body.sessionid;
		 var sql1 = 'SELECT * FROM tbUser WHERE token = ?';
		 var sql2 = 'SELECT a.*,b.* from tbUser as a '+
								'INNER JOIN (select id as activityid,userid,postid,content,status from tbActivity) b ON b.userid = a.id '+
								'WHERE a.token = ? AND b.postid = ? AND b.status = ?';
								
		 var sql3 = 'select * from tbProduct where id = ?';

		 if (rate == null){
				res.json({'message':'Rate undefined. Please try again','code':0});
			}else if (rate == ''){
				res.json({'message':'Rate not empty!','code':0});
			}else if (rate >5 || rate < 0) {
				res.json({'message':'Rate is between 1 and 5!','code':0});
			}else{
			  
				db.query(sql2,[token,productid,status], function (err,result){
						if (result.length != 0){
							db.query('update tbActivity set content = ?,sessionid = ? WHERE id = ?',[rate,sessionid,result[0].activityid],function(er,rs){
								res.json({'message':'OK!You rate this post','code':1});
							});
						}else {
							db.query(sql1,token,function(err,result1){
								if(result1 == null || result1 == ''){
									res.json({'message':'Not Found', 'code':0});
								}else {
									db.query(sql3,productid,function(err3,result3){
										if (result3 != ''){
											db.query('insert into tbActivity (userid,postid,content,status,sessionid) values (?,?,?,?,?)',[result1[0].id,productid,rate,status,sessionid],function(err,rsl){
												db.query('select avg(content) as avgrate from tbActivity where userid = ? and postid = ? and status = ?',[result1[0].id,productid,status], function(err,result2){
													res.json({'message':'OK!You rate this post','code':1, 'rate': result2[0].avgrate});
												});
											});
										}else {
											res.json({'message':'Not found this product!','code':0});
										}
									});
								}
							});
						}
				 });

			 }
	}
});

//comment an item
app.post('/commentproduct', function(req,res) {
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		var productid = req.body.productid;
		var token = req.body.token;
		var comment = utf8_encode(req.body.comment);
		var sessionid = req.body.sessionid;
		var status = 2;
		var sql = 'select a.*,b.* from tbUser as a left join (select belong,path,thumb,thumb2 from tbImage where status = 0 ) b on b.belong = a.id where a.token = ? ';
		var sql3 = 'select * from tbProduct where id = ?';
		
		var sql2 = 'insert into tbActivity (userid,postid,content,status,sessionid) values (?,?,?,?,?)';
		
		var sql4 =  'select a.*,b.* from tbProduct as a '+
								'left join (select id as userid,username,comment_one_item,device_token from tbUser) b on b.userid = a.userid '+
								'where a.id = ?';
		if (comment == null){
			res.json({'message':'Comment undefined. Please try again','code':0});
		}else if (comment == ''){
			res.json({'message':'Comment not empty!','code':0});
		}else{
			db.query(sql,token,function(err,result1){
				if (result1 == null|| result1 == ''){
					res.json({'message':'Not Found!','code':0});
				}else {
					db.query(sql3,productid,function(err3,result3){
						if (result3 != ''){
							db.query(sql2,[result1[0].id,productid,comment,status,sessionid],function(err2,result2){
								if (err2){
									res.json({'message':'Insert Failed','code':0});
								}else {
									db.query(sql4,productid,function(error3,rsl3){
										//push
										if(rsl3 != ''){
											if (rsl3[0].comment_one_item == 1){
												if (rsl3[0].device_token != ''){
													db.query('select * from tbUser where device_token = ? ',rsl3[0].device_token,function(erro1,rsll1){
														if (rsll1 != ''){
															var push = rsll1[0].numPush + 1;
															db.query('update tbUser set numPush = ? where device_token = ? ',[push,rsl3[0].device_token],function(er,rs){
																pushNotifications(result1[0].username,rsl3[0].device_token,4);
															});
														}
													});
												}
											}
										}
										//end push
									});
									var avatar = (result1[0].path == null) ? '/uploads/default.png' : result1[0].path;
									var avatar2 = (result1[0].thumb == null) ? '/uploads/default_300.png' : result1[0].thumb;
									var avatar3 = (result1[0].thumb == null) ? '/uploads/default_120.png' : result1[0].thumb2;
									res.json({'message':'Success!','code':1,'comment':utf8_decode(comment),'avatar':avatar,'avatar_thumb':avatar2,'avatar_thumb120':avatar3});
								}
								
							});
						}else {
							res.json({'message':'Not found this product!','code':0});
						}
					});
				}
			});
		}
	}
});

//buy an item
app.post('/buyproduct', function(req,res) {
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		 var productid = req.body.productid;
		 var token = req.body.token;
		 var sessionid = req.body.sessionid;
		 var status = 3;
		 var sql1 = 'select * from tbUser where token =?';
		 var sql = 'select a.id,a.username,a.email,a.website,a.country,b.*,c.*,d.* from tbUser as a '+
					'LEFT JOIN (select * from tbActivity) b ON b.userid = a.id '+
					'left join (select id,userid from tbProduct) c on c.id = b.postid '+
					'left join (select id,username as usernamebuy,token,device_token,buy_one_item from tbUser) d on d.id = c.userid '+
					'where a.token = ? and b.postid = ? and b.status = ?';
		
		 var sql2 = 'select * from tbProduct as a INNER JOIN (SELECT * FROM tbUser) b ON b.id = a.userid where a.id = ? ';
		 
		 db.query(sql1,token,function(err,result1){
 	 		if (result1 == null || result1 == ''){
 	 			res.json({'message':'Not Found','code':0});
 	 		}else {
 	 			db.query(sql2,productid,function(err3,result3){
 	 				if (result3 != ''){
 	 					db.query(sql,[result1[0].id,productid,status], function(err2,result2){
							if (result2 != ''){
								res.json({'message':'You bought this product at time ago','code':0});
							}else {
								db.query('select userid from tbProduct as a inner join (select id,token from tbUser) b on b.id = a.userid where a.id = ?',productid,function(handleerror,resultquery){
									if (resultquery != ''){
										db.query('insert into tbContact (`from`,`to`,`status`,`sessionid`) values (?,?,?,?)',[result1[0].id,resultquery[0].userid,1,sessionid]);
										db.query('insert into tbContact (`to`,`from`,`status`,`sessionid`) values (?,?,?,?)',[result1[0].id,resultquery[0].userid,1,sessionid]);
									}
								});
								
								if (typeof req.body.type === 'undefined'){
									db.query('insert into tbActivity (userid,postid,status,sessionid) values (?,?,?,?)',[result1[0].id,productid,status,sessionid],function(errend,rslend){
										var sql3 =  'select b.listkey_product from tbProduct as a '+
													'inner join (select postid,group_concat(convert(keyword_id,char(8))) as listkey_product from tbKeyword_product group by postid) b on b.postid = a.id '+
													'where a.id = ? ';
										var sql4 = 'select * from tbKeyword_user where userid = ? and invisible = ? ';
										db.query(sql3,productid,function(er1,rs1){
											db.query(sql4,[result1[0].id,1], function(er2,rs2){
												var curkey = [];
												if (rs2 != ''){
													var i;
													for(i=0;i<rs2.length;i++){
														curkey.push(rs2[i].keyword_id);
													}
												}
												if (rs1 != '' ){
													var strkey = rs1[0].listkey_product;
													var arrkey = strkey.split(',');
													var i1;
													for (i1=0;i1<arrkey.length;i1++){
														if (in_array(arrkey[i1],curkey) === false){
															db.query('insert into tbKeyword_user (userid,keyword_id,invisible) values(?,?,?) ',[result1[0].id,arrkey[i1],1]);
														}
													} 
												}
											});
										});			
										//push
										if (result3[0].buy_one_item == 1){
											if (result3[0].device_token != ''){
												db.query('select * from tbUser where device_token = ? ',result3[0].device_token,function(erro1,rsll1){
													if (rsll1 != ''){
														var push = rsll1[0].numPush + 1;
														db.query('update tbUser set numPush = ? where device_token = ? ',[push,result3[0].device_token],function(er,rs){
															pushNotifications(result1[0].username,result3[0].device_token,3);
														});
													}
												});
											}
										}
										//end push
										res.json({'message':'Buy success!','code':1});
									});
								}else {
									db.query('insert into tbActivity (userid,postid,status,sessionid,type) values (?,?,?,?,?)',[result1[0].id,productid,status,sessionid,req.body.type],function(errend,rslend){
										var sql3 =  'select b.listkey_product from tbProduct as a '+
																'inner join (select postid,group_concat(convert(keyword_id,char(8))) as listkey_product from tbKeyword_product group by postid) b on b.postid = a.id '+
																'where a.id = ? ';
										var sql4 = 'select * from tbKeyword_user where userid = ? and invisible = ? ';
										db.query(sql3,productid,function(er1,rs1){
											db.query(sql4,[result1[0].id,1], function(er2,rs2){
												var curkey = [];
												if (rs2 != ''){
													var i;
													for(i=0;i<rs2.length;i++){
														curkey.push(rs2[i].keyword_id);
													}
												}
												if (rs1 != '' ){
													var strkey = rs1[0].listkey_product;
													var arrkey = strkey.split(',');
													var i1;
													for (i1=0;i1<arrkey.length;i1++){
														if (in_array(arrkey[i1],curkey) === false){
															db.query('insert into tbKeyword_user (userid,keyword_id,invisible) values(?,?,?) ',[result1[0].id,arrkey[i1],1]);
														}
													} 
												}
											});
										});			
											//push
											if (result3[0].buy_one_item == 1){
												if (result3[0].device_token != ''){
													db.query('select * from tbUser where device_token = ? ',result3[0].device_token,function(erro1,rsll1){
														if (rsll1 != ''){
															var push = rsll1[0].numPush + 1;
															db.query('update tbUser set numPush = ? where device_token = ? ',[push,result3[0].device_token],function(er,rs){
																pushNotifications(result1[0].username,result3[0].device_token,3);
															});
														}
													});
												}
											}
											//end push
										res.json({'message':'Buy success!','code':1});
									});
									
								}
								// end if
							}
					  });
 	 				}else {
 	 					res.json({'message':'Not found this product!','code':0});
 	 				}
 	 			});
 	 		}
		});
	}
});

//user follow, unfollow 1 user
app.post('/followuser', function(req,res){
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token; //token of user login
		var token_follow = req.body.token_follow; // token of user follow
		var type = req.body.type;
		var sessionid = req.body.sessionid;
		
		var sql = 'SELECT * FROM tbUser WHERE token =?';
		var sql2 = 'SELECT * FROM tbFollow WHERE userid = ? AND user_follow = ?';
		var sql3 = 'INSERT INTO tbFollow (userid, user_follow, sessionid) VALUES (?,?,?)';
		var sql5 = 'insert into tbFollow (userid,user_follow,status,unfollowtime,sessionid) values (?,?,?,?,?) ';
		
		if (token == token_follow) {
			res.json({'message':"You cann't follow youself",'code':0}); 
		}else {
			db.query(sql,token,function(err1,rsl1){
				if (rsl1 == ''){
					res.json({'message':'This token is incorrect or not exist','code':0});
				}else {
					db.query(sql,token_follow,function(err2,rsl2){
						if (rsl2 == ''){
							res.json({'message':'This token of user follow is incorrect or not exist','code':0});
						}else {
							if (type == null || type == ''){
								res.json({'message':'Type field is not null, not empty!','code':0});
							}else {
								if (type == 0){ // follow
									db.query(sql2,[rsl1[0].id,rsl2[0].id],function(err3,rsl3){

										//push
										if (rsl2[0].user_follow == 1){
											if (rsl2[0].device_token != ''){
												db.query('select * from tbUser where device_token = ? ',rsl2[0].device_token,function(erro1,rsll1){
													if (rsll1 != ''){
														var push = rsll1[0].numPush + 1;
														db.query('update tbUser set numPush = ? where device_token = ? ',[push,rsl2[0].device_token],function(er,rs){
															pushNotifications(rsl1[0].username,rsl2[0].device_token,5);
														});
													}
												});
												
											}
										}
										//end push

										if (rsl3 != ''){
											res.json({'message':'Following success','code':1});
										}else {
											db.query(sql3,[rsl1[0].id,rsl2[0].id,sessionid],function(err4,rsl4){
												res.json({'message':'Following success','code':1});
											});
										}
									});
								}else if (type == 1){ // unfollow
									var currenttime = new Date();
									//db.query(sql5,[rsl1[0].id,rsl2[0].id],function(err5,rsl5){
									db.query(sql5,[rsl1[0].id,rsl2[0].id,1,currenttime,sessionid],function(err5,rsl5){
										res.json({'message':'Unfollow success','code':1});
									});
								}else {
									res.json({'message':'Type is failed (ex: 0 Or 1)','code':0});
								}
							}
						}
					});
				}
			});
		}
	}
});


// setting notifications for user
app.post('/set_notification',function(req,res){
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token,
			like_item = req.body.like_one_item,
			comment_item = req.body.comment_one_item,
			buy_item = req.body.buy_one_item,
			send_message = req.body.send_mes_via_chat,
			user_follow = req.body.user_follow,
			tag = req.body.tag,
			sql = 'select * from tbUser where token = ?';
		var	sql2 = 'update tbUser set like_one_item = ?, comment_one_item = ?,buy_one_item = ?, send_mes_via_chat =?, user_follow =?, tag=?';
	
		db.query(sql,token,function(err1,rsl1){
			if (rsl1 == ''){
				res.json({'message':'This token is incorrect or not exist','code':0});
			}else {
				db.query(sql2,[like_item,comment_item,buy_item,send_message,user_follow,tag],function(err2,rsl2){
					res.json({'message':'Success','code':1,'username':rsl1[0].username,'userid':rsl1[0].id,'token':token});
				});
			}
		});
	}
});


//LIST TOP RATE SELLER + LIST USER FOLLOWING IN INSTAGRAM USING MERAZEEM APP
app.post('/list_seller_insta',function(req,res){
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token;
		var listfollwing_insta = req.body.listinsta;
		var find = ' ';
		var re = new RegExp(find, 'g');
			str = listfollwing_insta.replace(re, '');
			newstr = str.substring(0, str.length - 1);
		var checksql = 'select * from tbUser where token = ? ';
		
		var sql = 'select * from tbUser as a '+
							'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) b on b.belong = a.id '+
							'where instagram_id in ('+newstr+')';

		var sql2 =  'select c.rate,a.username,a.id as userid,a.email,a.website,a.country,a.sex,a.first_name,a.last_name,a.access_location,a.token,d.path,d.thumb,d.thumb2 from tbUser as a '+
								'left join (select * from tbProduct group by id) b on b.userid = a.id '+
								'inner join (select avg(content) as rate,postid from tbActivity where status =1 group by postid) c on c.postid = b.id '+
								'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) d on d.belong = a.id '+
								'where a.token <> ? '+
								'group by a.id '+
								'order by c.rate desc';
		var sql3 = 'select a.* from (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as a';					
			
	 	db.query(checksql,token,function(er,rs){
	 		if (rs == ''){
	 			res.json({'message':'Not Found','code':0});
	 		}else {
				db.query(sql,function(err,rsl){
					db.query(sql2,token,function(err2,rsl2){
						db.query(sql3,rs[0].id,function(err3,rsl3){
							//list user following in instagram using Marazeem App
							if (err){
								res.json({'message':'Error Connect','code':0});
							}else {
								var data = [];
								if (rsl != ''){
									var i;
									for (i = 0; i<rsl.length; i++){
										var obj = new Object();
										obj.username = rsl[i].username;
										obj.token = rsl[i].token;
										obj.avatar = (rsl[i].path == null) ? '/uploads/default.png' : rsl[i].path;
										obj.avatar_thumb = (rsl[i].thumb == null) ? '/uploads/default_300.png' : rsl[i].thumb;
										obj.avatar_thumb120 = (rsl[i].thumb2 == null) ? '/uploads/default_120.png' : rsl[i].thumb2;
										data[i] = obj;
									}
								}
							}
							//end list user following in instagram
							
							var j;
							var data3 = [];
							for (j = 0;j<rsl3.length;j++){
								data3[j] = rsl3[j].user_follow;
							}
							
							//top rate seller
								var data2 = [];
								var i2;
								for (i2 = 0; i2<rsl2.length;i2++){
						  			if (in_array(rsl2[i2].userid,data3) == false){
						  				var obj = new Object();
											obj.userid = rsl2[i2].userid;
											obj.username = rsl2[i2].username;
											obj.email = rsl2[i2].email;
											obj.country = rsl2[i2].country;
											obj.website = rsl2[i2].website;
							  			obj.sex = rsl2[i2].sex;
							  			obj.access_location = rsl2[i2].access_location;
											obj.token = rsl2[i2].token;
											obj.rate = rsl2[i2].rate.toFixed(2);
											obj.url = (rsl2[i2].path == null) ? '/uploads/default.png' : rsl2[i2].path;
											obj.url_thumb = (rsl2[i2].thumb == null) ? '/uploads/default_300.png' : rsl2[i2].thumb;
											obj.url_thumb120 = (rsl2[i2].thumb2 == null) ? '/uploads/default_120.png' : rsl2[i2].thumb2;
											data2.push(obj);
						  			}
								}
								//end list top rate seller
							//return data
							res.json({'objlist_insta':data,'objlist_toprate':data2,'code':1});
						});
					});
				});
			}
		});
	}
});


//list top seller rate
app.post('/top_rate_seller',function(req,res){
	if (typeof req.body.token == 'undefined'){
            res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
            res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token;
		console.log(token);
		var sql = 'select c.rate,a.username,a.id as userid,a.email,a.website,a.country,a.sex,a.first_name,a.last_name,a.access_location,a.token,d.path,d.thumb,d.thumb2 '+
							'from tbUser as a '+
							'left join (select * from tbProduct group by id) b on b.userid = a.id '+
							'inner join (select avg(content) as rate,postid from tbActivity where status =1 group by postid) c on c.postid = b.id '+
							'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) d on d.belong = a.id '+
							'where a.token <> ? '+
							'group by a.id '+
							'order by c.rate desc';
		var sql2 = 'select a.* from (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as a';					
		db.query('select * from tbUser where token = ?',token,function(error,result){
			if (result == ''){
				res.json({'message':'No result','code':0});
			}else {
				db.query(sql,token,function(err,rsl){
					db.query(sql2,result[0].id,function (err2,rsl2){
						if (err){
							res.json({'message':'No result','code':0});
						}else {
							var data = [],data2 = [];
							if (rsl != '') {
								var i,j;
								for (j = 0;j<rsl2.length;j++){
									data2[j] = rsl2[j].user_follow;
								}
								for (i = 0; i<rsl.length;i++){
								var obj = new Object();
									obj.userid = rsl[i].userid;
									obj.username = rsl[i].username;
									obj.email = rsl[i].email;
									obj.country = rsl[i].country;
									obj.website = rsl[i].website;
								obj.sex = rsl[i].sex;
								obj.access_location = rsl[i].access_location;
									obj.token = rsl[i].token;
									obj.rate = rsl[i].rate.toFixed(2);
									obj.statusfollow = (in_array(rsl[i].userid,data2) === false) ? 0 : 1;
									obj.url = (rsl[i].path == null) ? '/uploads/default.png' : rsl[i].path;
									obj.url_thumb = (rsl[i].thumb == null) ? '/uploads/default_300.png' : rsl[i].thumb;
									obj.url_thumb2 = (rsl[i].thumb2 == null) ? '/uploads/default_120.png' : rsl[i].thumb2;
									data.push(obj);
								}
							}
							res.json({'obj':data,'token':token,'code':1});
						}
					});
				});
			}
		});
	}
});

//list seller top rate and list following in instagram using Marazeem App
app.post('/listinsta_useapp',function(req,res){
	if (typeof req.body.userid == 'undefined'){
		res.json({'message':'This user does not exist','code':0});
    }else if (req.body.userid == ''){
		res.json({'message':'This user does not exist','code':0});
    }else {
		var listfollwing_insta = req.body.listinsta;
		var userid = req.body.userid;
		var find = ' ';
		var re = new RegExp(find, 'g');
		str = listfollwing_insta.replace(re, '');
		newstr = str.substring(0, str.length - 1);
		var sql = 'select a.*,b.*,c.userid as user from tbUser as a '+
							'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) b on b.belong = a.id '+
							'left join (select cf.* from (select a1.user_follow,a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where userid = 2 order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as cf) c on c.user_follow = a.id '+
							'where a.instagram_id in ('+newstr+') ';
		
		db.query(sql,userid,function(err,rsl){
			if (err){
				res.json({'message':'Error Connect','code':0});
			}else {
				if (rsl != ''){
					var data = [];
					var i;
					for (i = 0; i<rsl.length; i++){
						var obj = new Object();
						obj.username = rsl[i].username;
						obj.token = rsl[i].token;
						obj.avatar = (rsl[i].path == null)? '/uploads/default.png' : rsl[i].path;
						obj.avatar_thumb = (rsl[i].thumb == null)? '/uploads/default_300.png' : rsl[i].thumb;
						obj.avatar_thumb120 = (rsl[i].thumb2 == null)? '/uploads/default_120.png' : rsl[i].thumb2;
						obj.statusfollow = (rsl[i].user == null) ? 0 : 1; 
						data[i] = obj;
					}
					res.json({'obj':data,'code':1});
				}else {
					var data2 = [];
					res.json({'obj':data2,'code':1});
				}
			}
		});
	}
});


//list item user liked
app.post('/user/postliked',function(req,res){
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token;
		var sql = 'select * from tbUser where token = ?';
		var sql2 =  'SELECT b.*,d.id as user_id,d.username,d.token,d.email,d.website,d.country,d.sex,d.phone,d.access_location,e.path as avatar, e.thumb as avatar_thumb, e.thumb2 as avatar_thumb120, group_concat(c.path) as imgpost,group_concat(c.thumb) as imgpost_thumb,group_concat(c.thumb2) as imgpost_thumb120 FROM tbActivity AS a '+
								'INNER JOIN (SELECT * FROM tbProduct) b ON b.id = a.postid '+
								'LEFT JOIN (SELECT belong,path,thumb,thumb2 from tbImage where status = 1) c on c.belong=a.postid '+
								'LEFT JOIN (SELECT id,username,email,token,website,country,phone,access_location,sex from tbUser) d on d.id = b.userid '+
								'LEFT JOIN (SELECT path,thumb,thumb2,belong from tbImage where status = 0) e on e.belong = b.userid '+
								'WHERE a.status = 0 AND a.userid = ? '+
								'GROUP BY a.postid';

		db.query(sql,token,function(err1,rsl1){
			if (rsl1 == ''){
				res.json({'message':'This token is incorrect or not exist','code':0});
			}else {
				db.query(sql2,rsl1[0].id,function(err2,rsl2){
					if (rsl2 == ''){
						res.json({'message':'No result','code':0});
					}else {
						var data = [];
						var i;
						for (i = 0; i<rsl2.length;i++){
							var obj = new Object();
							obj.postid = rsl2[i].id;
							obj.userid = rsl2[i].userid;
							obj.username = rsl2[i].username;
							obj.token = rsl2[i].token;
						obj.description = utf8_decode(rsl2[i].description);
						obj.location = rsl2[i].location;
						obj.price = rsl2[i].price;
						
						obj.avatar = (rsl2[i].avatar == null) ? '/uploads/default.png' : rsl2[i].avatar;
						obj.avatar_thumb = (rsl2[i].avatar_thumb == null) ? '/uploads/default_300.png' : rsl2[i].avatar_thumb;
						obj.avatar_thumb120 = (rsl2[i].avatar_thumb120 == null) ? '/uploads/default_120.png' : rsl2[i].avatar_thumb120;	
						
						obj.type = rsl2[i].type;
						if (rsl2[i].type == 1){
							var img = [],img2 = [];
							var obj2 = new Object(),obj21 = new Object();
							obj2.path = (rsl2[i].description == '') ? '/uploads/new_product.png' : rsl2[i].description;
							obj21.path = (rsl2[i].imgstories_120 == '') ? '/uploads/new_product_300.png' : rsl2[i].imgstories_120;
							img[0] = obj2;
							img2[0] = obj21;
							obj.imgpost = img;
							obj.imgpost_thumb = img2;
							obj.imgpost_thumb120 = img2;
						}else {
						//img original
							if (rsl2[i].imgpost == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product.png';
								img[0] = obj2;
								obj.imgpost = img;
							}else {
								var array = rsl2[i].imgpost.split(',');
								var i2;
								var newarr = [];
								for (i2 = 0;i2 < array.length; i2++){
									var obj3 = new Object();
									obj3.path = array[i2];
									newarr[i2] = obj3;
								}
								obj.imgpost = newarr;
							}
							
							if (rsl2[i].imgpost_thumb == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product_300.png';
								img[0] = obj2;
								obj.imgpost_thumb = img;
							}else {
								var array = rsl2[i].imgpost_thumb.split(',');
								var i3;
								var newarr = [];
								for (i3 = 0;i3 < array.length; i3++){
									var obj3 = new Object();
									obj3.path = array[i3];
									newarr[i3] = obj3;
								}
								obj.imgpost_thumb = newarr;
							}
							
							if (rsl2[i].imgpost_thumb120 == null){
								var img = [];
								var obj2 = new Object();
								obj2.path = '/uploads/new_product_120.png';
								img[0] = obj2;
								obj.imgpost_thumb120 = img;
							}else {
								var array = rsl2[i].imgpost_thumb120.split(',');
								var i4;
								var newarr = [];
								for (i4 = 0;i4 < array.length; i4++){
									var obj3 = new Object();
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

//access_location
app.post('/access_location',function(req,res){
	if (typeof req.body.token == 'undefined'){
		res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
		res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token;
		var access = req.body.access;
		var sql1 = 'select * from tbUser where token = ?';
		var sql2 = 'update tbUser set access_location = ? where token = ?';
		
		db.query (sql1,token,function(err,rsl1){
			if (rsl1 == ''){
				res.json({'message':'This token is incorrect or not exist','code':0});
			}else{
				db.query(sql2,token,function(err2,rsl2){
					if (err2){
						res.json({'message':'Failed, try again!','code':0});
					}else {
						res.json({'message':'OK','token':token,'code':1});
					}
				});
			}
		});
	}
});

function compare(a,b) {
  if (a.lastmessage < b.lastmessage)
	 return 1;
  if (a.lastmessage > b.lastmessage)
	return -1;
  return 0;
}
function unique(arrayName) {
  var newArray=new Array();
  label:for(var i=0; i<arrayName.length;i++ ){  
  	for(var j=0; j<newArray.length;j++ ){
  		if(newArray[j]==arrayName[i]) 
  		continue label;
  	}
  	newArray[newArray.length] = arrayName[i];
  }
  return newArray;
}



//list follower+following for user
app.post('/listfollower_following',function(req,res){
	if (typeof req.body.token == 'undefined'){
        res.json({'message':'This token is incorrect','code':0});
    }else if (req.body.token == ''){
        res.json({'message':'This token is incorrect','code':0});
    }else {
		var token = req.body.token;
		var sql = 'select id,token from tbUser where token = ?';
		//list following
		var sql1 = 	'SELECT b.id as user_id,b.username,b.email,b.website,b.country,b.phone,b.token,c.* FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) AS a '+
					'INNER JOIN (SELECT id,username,email,website,country,phone,token FROM tbUser) b ON b.id = a.user_follow '+
					'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage where status = 0) c ON c.belong = b.id '+
					'GROUP BY b.id';

		//list follwer
		var sql2 =	'SELECT b.id as user_id,b.username,b.email,b.website,b.country,b.phone,b.token,c.* FROM (select a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where user_follow = ? order by createtime desc) as a2 group by a2.userid) as a1 where a1.status = 0) AS a '+
					'inner JOIN (SELECT id,username,email,website,country,phone,token FROM tbUser) b ON b.id = a.userid '+
					'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage where status = 0) c ON c.belong = b.id '+
					'GROUP BY b.id';

		var sqli = "SELECT a.* FROM (select a1.`to` from (SELECT a2.* FROM (select `to`,status from `tbContact` where `from` = ? order by createtime desc) as a2 group by a2.`to`) as a1 where a1.status <> 2) as a";
		var sqli2 = "SELECT a.* FROM (select a1.`from` from (SELECT a2.* FROM (select `from`,status from `tbContact` where `to` = ? order by createtime desc) as a2 group by a2.`from`) as a1 where a1.status <> 2) as a";

		db.query(sql,token,function(err,rsl){
			if (rsl == ''){
				res.json({'message':'This token is incorrect','code':0});
			}else {
				console.log('user____id',rsl[0].id);
				db.query(sql1, rsl[0].id, function(err1,rsl1){
					db.query(sql2, rsl[0].id, function(err2,rsl2){
						db.query(sqli, rsl[0].id, function(err3,rsl3){
							db.query(sqli2, rsl[0].id, function(err4,rsl4){

									var data1 = [];
									var data2 = [];
									var data3 = [];
									var data4 = [];
									//////
									if (rsl3 != ''){
										var index;
										for (index = 0; index< rsl3.length; index++){
											data3.push(rsl3[index].to);
										}
									}
									/////
									if (rsl4 != ''){
										var index2;
										for (index2 = 0; index2 < rsl4.length; index2++){
											data4.push(rsl4[index2].from);
										}
									}
									////////
									
									if (rsl1 != ''){
										var i1;
										for (i1 = 0; i1<rsl1.length; i1 ++){
											console.log(rsl1[i1].user_id);
											if (in_array(rsl1[i1].user_id,data3) === false){
												if (in_array(rsl1[i1].user_id,data4) === false){
													
													var obj1 = new Object();
													obj1.userid = rsl1[i1].user_id;
													obj1.username = rsl1[i1].username;
													obj1.email = rsl1[i1].email;
													obj1.website = rsl1[i1].website;
													obj1.country = rsl1[i1].country;
													obj1.phone = rsl1[i1].phone;
													obj1.token = rsl1[i1].token;
													if (rsl1[i1].path == null){
														obj1.path = '/uploads/default.png' ;
													}else {
														obj1.path = rsl1[i1].path;
													}
													data1.push(obj1);
													
												}
											}
										}
									}
				
									if (rsl2 != ''){
										var i2;
										for (i2 = 0; i2<rsl2.length; i2 ++){
											if (in_array(rsl2[i2].user_id,data3) === false){
												if (in_array(rsl2[i2].user_id,data4) === false){
													var obj2 = new Object();
													obj2.userid = rsl2[i2].user_id;
													obj2.username = rsl2[i2].username;
													obj2.email = rsl2[i2].email;
													obj2.website = rsl2[i2].website;
													obj2.country = rsl2[i2].country;
													obj2.phone = rsl2[i2].phone;
													obj2.token = rsl2[i2].token;
													if (rsl2[i2].path == null){
														obj2.path = '/uploads/default.png' ;
													}else {
														obj2.path = rsl2[i2].path;
													}
													data2.push(obj2);
												}
											}
										}
									}
									
									
									var data = [];
									for(var i in data1){
									   var shared = false;
									   for (var j in data2)
										   if (data2[j].userid == data1[i].userid) {
											   shared = true;
											   break;
										   }
									   if(!shared) data.push(data1[i]);
									}
									data = data.concat(data2);
									res.json({'data1':data,'code':1});

							});
						});
					});
				});
			}
		});
	}
});

//remove a contect
app.post('/removecontact',function(req,res){
	if (typeof req.body.userid1 == 'undefined' || typeof req.body.userid2 == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid1 == '' || req.body.userid2 == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid1;
		var type = req.body.type;
		var userid2 = req.body.userid2;
		var sessionid = (typeof req.body.sessionid == 'undefined') ? '' : req.body.sessionid;
		console.log({'userid1':userid1,'userid2':userid2,'type':type});
		if (type == 0){ // 0: is user pending and user accept
			db.query('insert into tbContact (`status`,`from`,`to`,`sessionid`) values (?,?,?,?) ',[2,userid1,userid2,sessionid],function(err1,rsl1){
				db.query('insert into tbContact (`status`,`to`,`from`,`sessionid`) values (?,?,?,?) ',[2,userid1,userid2,sessionid],function(err2,rsl2){
					res.json({'message':'Remove success','code':1});
				});
			});
		}else if (type == 1){ // 1: is user request
			db.query('insert into tbContact (`status`,`from`,`to`,`sessionid`) values (?,?,?,?) ',[2,userid1,userid2,sessionid],function(err1,rsl1){
					res.json({'message':'Remove success','code':1});
			});
			
		}
	}
});

//list closefriend
app.post('/listclosefriends',function(req,res){
	if (typeof req.body.userid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid = req.body.userid;
		var sql = 'select * from tbFollow where id = ?';
		var sql1 = 'SELECT c.id as userid,c.username,c.email,c.phone,c.country,c.first_name,c.last_name,c.token,d.thumb2,e.lastmessage FROM (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as a '+
					'left join (select bf.* from (select a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where user_follow = ? order by createtime desc) as a2 group by a2.userid) as a1 where a1.status = 0) as bf) b on b.userid = a.user_follow '+
					'inner join (select * from tbUser) c on c.id = a.user_follow '+
					'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) d on d.belong = a.user_follow '+
					'left join (select max(createtime) as lastmessage,`to` from tbMessage where `from` = ? group by `to`) e on e.`to` = a.user_follow '+
					'order by lastmessage desc';
		var sql2 = 'SELECT c.id as userid,c.username,c.email,c.phone,c.country,c.first_name,c.last_name,c.token,d.thumb2,e.lastmessage FROM (select a1.userid from (SELECT a2.* FROM (select * from `tbFollow` where user_follow = ? order by createtime desc) as a2 group by a2.userid) as a1 where a1.status = 0) as a '+
					'left join (select bf.* from (select a1.user_follow from (SELECT a2.* FROM (select * from `tbFollow` where userid = ? order by createtime desc) as a2 group by a2.user_follow) as a1 where a1.status = 0) as bf) b on b.user_follow = a.userid '+
					'inner join (select * from tbUser) c on c.id = a.userid '+
					'left join (select belong,path,thumb,thumb2 from tbImage where status = 0) d on d.belong = a.userid '+
					'left join (select max(createtime) as lastmessage,`to` from tbMessage where `from` = ? group by `to`) e on e.`to` = a.userid '+
					'order by lastmessage desc';
								
								
		db.query(sql,userid,function(err,rsl){
			if(rsl = ''){
				res.json({'message':'This id is incorrect','code':0});
			}else {
				db.query(sql1,[userid,userid,userid],function(err2,rsl2){
					db.query(sql2,[userid,userid,userid],function(err3,rsl3){
						if (rsl2 == '' || rsl3 == ''){
							res.json({'message':'No result','code':0});
						}else {
							var i,i2;
							var data = [],data2 = [],listuserid = [];
							for (i=0;i<rsl2.length;i++){
								var obj = new Object();
								obj.userid = rsl2[i].userid;
								obj.username = rsl2[i].username;
								obj.email = rsl2[i].email;
								obj.phone = rsl2[i].phone;
								obj.country = rsl2[i].country;
								obj.first_name = rsl2[i].first_name;
								obj.last_name = rsl2[i].last_name;
								obj.token = rsl2[i].token;
								obj.path = (rsl2[i].thumb2 == null) ? '/uploads/default_120.png' : rsl2[i].thumb2;
								
								data[i] = obj;
							}
							
							for (i2=0;i2<rsl3.length;i2++){
								listuserid[i2] = rsl3[i2].userid;
							}
							console.log(listuserid);
							var newdata = [];
							for(var i3 in data){
						   if (in_array(data[i3].userid,listuserid)) {
							   newdata.push(data[i3]);
						   }
							}

							newdata.sort(compare);
							
							res.json({'obj':newdata,'code':1});
						}
					});
				});
			}
		});
	}
});

//remove friend
app.post('/removefriend',function(req,res){
	if (typeof req.body.userid1 == 'undefined' || typeof req.body.userid2 == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid1 == '' || req.body.userid2 == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid1 = req.body.userid1; //
		var userid2 = req.body.userid2; //friendid
		var sessionid = (typeof req.body.sessionid == 'undefined') ? '' : req.body.sessionid;
		var sql = 'select id from tbUser where id = ?';
		var sql1 = 'select id,userid,user_follow,status,createtime,group_concat(convert(status,char(8))) as liststatus from tbFollow where userid = ? and user_follow = ? ' ;
		var sql2 = 'insert into tbFollow (unfollowtime,userid,user_follow,status,sessionid) values (?,?,?,?,?)';
		
		db.query(sql,userid1,function(err1,rsl1){
			db.query(sql,userid2,function(err1,rsl1){
				if (rsl1 == ''){
					res.json({'message':'No result','code':0});
				}else {
					db.query(sql1,[userid1,userid2],function(err2,rsl2){
						db.query(sql1,[userid2,userid1],function(err3,rsl3){
							if (rsl2 != '' && rsl3 != ''){
								if (rsl2[0].liststatus == 0 && rsl3[0].liststatus == 0){
									var currenttime = new Date();
									db.query(sql2,[currenttime,userid1,userid2,1,sessionid],function(err4,rsl4){
										db.query(sql2,[currenttime,userid2,userid1,1,sessionid],function(err5,rsl5){
											res.json({'message':'Remove Success!','code':1});
										});
									});
								}
							}else {
								res.json({'message':'Failed!','code':1});
							}
						});
					});
				}
			});
		});
	}
});


//reset num of pushnotification if client app call
app.post('/rsnumpush',function(req,res){
	var devidetoken = req.body.device_token;
	db.query('select * from tbUser where device_token = ? ',devidetoken,function(err1,rsl1){
		if (rsl1 != ''){
			db.query('update tbUser set numPush = ? where device_token = ? ',[0,devidetoken],function(err2,rsl2){
				res.json({'message':'Success','code':1});
				// // db.end();
			});
		}
	});
});

app.post('/returnnumpush',function(req,res){
	var devicetoken = req.body.device_token;
	var numpush;
	
	db.query('select * from tbUser where device_token = ? ',devicetoken,function(err1,rsl1){
		if (rsl1 == ''){
			numpush = 0;
		}else {
			numpush = rsl1[0].numPush;
		}
		res.json({'numPush':numpush,'code':1});
	});
});


app.post('/messagecontact',function(req,res){
	if (typeof req.body.userid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid = req.body.userid;
		var sql = 	'select a.*,b.* from tbMessage as a '+
					'LEFT JOIN (select belong,path,thumb,thumb2 FROM tbImage WHERE status = 0) b ON b.belong = a.`from` '+
					'WHERE a.`to` = ? AND a.id > ? AND a.type = 0 '+
					'ORDER BY a.createtime DESC';
		var lastmessageid = req.body.lastmessageid;
		console.log(lastmessageid);
		if (userid != null && userid != '') {
			db.query('select * from tbUser where id = ? ', userid,function(err1,rsl1){
				db.query(sql,[userid,lastmessageid],function(err2,rsl2){
					if (rsl1 == ''){
						res.json({'message':'Not Found','code':0});
					}else {
						var data = [];
						var i;
						if (rsl2 != ''){
							for(i=0;i<rsl2.length;i++){
								var obj = new Object();
								obj.messageid = rsl2[i].id;
								db.query('UPDATE tbMessage SET status = 1 where id = ?',rsl2[i].id,function(er,rs){
								});
								obj.senderid = rsl2[i].from;
								obj.message = utf8_decode(rsl2[i].message);
								obj.uuid = rsl2[i].uuid;
								obj.time = rsl2[i].createtime;
								obj.width = '"'+rsl2[i].width+'"';
								obj.height = '"'+rsl2[i].height+'"';
								obj.avatar = (rsl2[0].path == null) ? '/uploads/default.png' : rsl2[0].path;
								obj.avatar_thumb = (rsl2[0].thumb == null) ? '/uploads/default_300.png' : rsl2[0].thumb;
								obj.avatar_thumb120 = (rsl2[0].thumb2 == null) ? '/uploads/default_120.png' : rsl2[0].thumb2;
								data.push(obj);
							}
						}
						res.json({'obj':data,'code':1});
						
					}
				});
			});
		}else {
			res.json({'message':'No result','code':0});
		}
	}
});

app.post('/messagegroup',function(req,res){
	if (typeof req.body.userid == 'undefined'){
        res.json({'message':'Not Found','code':0});
    }else if (req.body.userid == ''){
        res.json({'message':'Not Found','code':0});
    }else {
		var userid = req.body.userid;
		var sql = 'select a.*,b.*,c.* from tbGroup as a '+
					'left join (select id as mesid,`from`,`to`,uuid,status,type,createtime as createtimeimg,width as mswidth, height as msheight from tbMessage) b on b.`to` = a.id '+
					'left join (select belong,path,thumb,thumb2 from tbImage where status = 0 ) c on c.belong = b.`from` '+
					'where a.owner = ? and b.status = 0 and b.type = 1 '+
					'order by b.createtimeimg desc';
		
		db.query('select * from tbUser = ?', userid,function(err1,rsl1){
			db.query(sql,userid,function(err2,rsl2){
				if (rsl1 == ''){
					res.json({'message':'Not Found','code':0});
				}else {
					var data = [];
					var i;
					if (rsl2 != ''){
						for( i = 0 ; i < rsl2.length ; i++){
							var obj = new Object();
							obj.messageid = rsl2[i].mesid;
							db.query('UPDATE tbMessage SET status = 1 where id = ?',rsl2[i].mesid,function(er,rs){
							});
							obj.senderid = rsl2[i].from;
							obj.message = utf8_decode(rsl2[i].message);
							obj.uuid = rsl2[i].uuid;
							obj.groupid = rsl2[i].to;
							obj.time = rsl2[i].createtimeimg;
							obj.width = '"'+rsl2[i].mswidth+'"';
							obj.height = '"'+rsl2[i].msheight+'"';
							obj.avatar = (rsl2[0].path == null) ? '/uploads/default.png' : rsl2[0].path;
							obj.avatar_thumb = (rsl2[0].thumb == null) ? '/uploads/default_300.png' : rsl2[0].thumb;
							obj.avatar_thumb120 = (rsl2[0].thumb2 == null) ? '/uploads/default_120.png' : rsl2[0].thumb2;
							data.push(obj);
						}
					}
					
					res.json({'obj':data,'code':1});
					
				}
			});
		});
	}
});

app.post('/resetPassword',function(req,res){
	var pwd = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var email = req.body.email;
	db.query('update tbUser set password = ? where email = ? ',[md5(pwd), email],function(err,rsl){
		db.query('select * from tbUser where email = ? ',email ,function(err1,rsl1){
			if (typeof rsl1 !== 'undefined' && rsl1.length > 0){
				console.log('user exist');
				transporter.sendMail({
					from: 'info@konnek.com',
					to: email,
					subject: 'Konnek Reset Password',
					text: 'Your password is changed. \n Now the password is ' + pwd + '.'
				});
			}else{
				console.log('user does not exist');
			}
		});
		res.json({'message':'OK','code':1,'newpassword':pwd});
	});
});

function formatDate(formatDate, formatString) {
	if(formatDate instanceof Date) {
		var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var yyyy = formatDate.getFullYear();
		var yy = yyyy.toString().substring(2);
		var m = formatDate.getMonth();
		var mm = m < 10 ? "0" + m : m;
		var mmm = months[m];
		var d = formatDate.getDate();
		var dd = d < 10 ? "0" + d : d;

		var h = formatDate.getHours();
		var hh = h < 10 ? "0" + h : h;
		var n = formatDate.getMinutes();
		var nn = n < 10 ? "0" + n : n;
		var s = formatDate.getSeconds();
		var ss = s < 10 ? "0" + s : s;

		formatString = formatString.replace(/yyyy/i, yyyy);
		formatString = formatString.replace(/yy/i, yy);
		formatString = formatString.replace(/mmm/i, mmm);
		formatString = formatString.replace(/mm/i, mm);
		formatString = formatString.replace(/m/i, m);
		formatString = formatString.replace(/dd/i, dd);
		formatString = formatString.replace(/d/i, d);
		formatString = formatString.replace(/hh/i, hh);
		formatString = formatString.replace(/h/i, h);
		formatString = formatString.replace(/nn/i, nn);
		formatString = formatString.replace(/n/i, n);
		formatString = formatString.replace(/ss/i, ss);
		formatString = formatString.replace(/s/i, s);

		return formatString;
	} else {
		return "";
	}
}
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
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

function in_array(needle, haystack, argStrict) {
  var key = '',
    	strict = !! argStrict;
    	
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return key;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return key;
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
		
		console.log(rsl[0].numPush);
		
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = (rsl == '') ? 0 : rsl[0].numPush;
		//note.sound = "ping.aiff";
		note.sound = "default";
	
		switch (type) {
			case 1: //1 is like
				note.alert = "\u2709 "+username+" liked your product on App";
				break;
			case 2: //2 is send a message via chat
				note.alert = "\u2709 You have a new message";
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
	
		note.payload = {'messageFrom': 'Caroline'};
	
		apnConnection.pushNotification(note, myDevice);
		
	});
	
}



};