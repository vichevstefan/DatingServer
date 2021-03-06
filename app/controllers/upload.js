module.exports.controller = function(app,db) {

var multer  = require('multer');

app.use(multer({
	dest:'./uploads/',
	limits: {
	  // fieldSize: 1,
	  //fileSize: 1 
	}
}));

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


var easyimg = require('easyimage');

//post stories
app.post('/uploadstories', function (req, res, next) {
	var userid = req.body.userid;
	console.log(userid);
	console.log(req.files);
	var imageName = req.files.stories.name;
	
		if(!imageName){
			res.json({'Message':'Upload failed!','code':0});
		} else {
		  var savePath = '/uploads/' + imageName;
			db.query('insert into tbProduct (userid,description,imgstories_120, type) values ( ?, ?, ?, ?)', [userid,savePath,savePath,1],function(err,rsl){
				res.json({'path':savePath,'imgid':rsl.insertId,'code':1});
			});
	  }
});



//upload avatar for user
app.post('/uploadUpdateProfile', function(req, res){
		var userid = req.body.userid;
		var imageName = req.files.avatar ? req.files.avatar.name : req.body.avatarpath;
		var userBiography = req.body.about;
		var userGender = req.body.gender;

		var userAddition1 = req.files.avatar0 ? req.files.avatar0.name : req.body.image0;
		var userAddition2 = req.files.avatar1 ? req.files.avatar1.name : req.body.image1;
		var userAddition3 = req.files.avatar2 ? req.files.avatar2.name : req.body.image2;
		var userAddition4 = req.files.avatar3 ? req.files.avatar3.name : req.body.image3;
		var userAddition5 = req.files.avatar4 ? req.files.avatar4.name : req.body.image4;
		var imageCount = req.body.imagecount;
		var token = req.body.token;
		var sex = 0;
		
		var sql = 'select * from tbUser where id = ?';
		if(userid == null || userid == ''){
				res.json({'Message':'This id is not null or incorrect','code':0});
		}else {
			db.query(sql,userid,function(err,rsl){
				if (rsl == ''){
					res.json({'Message':'No Result','code':0});
				}else {
					//update info user
					if(userGender == 'male'){
						sex = 0;
					}else{
						sex = 1;
					}
					var imageCount = 0;
					if(userAddition1 != 'avatar.png'){
						imageCount ++;
					}
					if(userAddition2 != 'avatar.png'){
						imageCount ++;
					}
					if(userAddition3 != 'avatar.png'){
						imageCount ++;
					}
					if(userAddition4 != 'avatar.png'){
						imageCount ++;
					}
					if(userAddition5 != 'avatar.png'){
						imageCount ++;
					}
					db.query('UPDATE tbUser SET about = ?, sex = ?,imageCount = ? WHERE token = ?', [userBiography,sex,imageCount,token],function(error1,result1){
					if (error1){
					  	res.json({'message':'Failed!','code':0});
					}else {
					  	//res.json({'message':'Update success!','code':1});
					 }
					});
					db.query('select * from tbimage where belong = ? and status = ?',[userid,0],function(err3,rsl3){
						if (rsl3 != ''){
							db.query('update tbimage SET path = ?, image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ? WHERE belong = ? and status = ?',[imageName,userAddition1,userAddition2,userAddition3,userAddition4,userAddition5,userid,0],function(err4,rsl4){
								res.json({'path':imageName,'image1':userAddition1,'image2':userAddition2,'image3':userAddition3,'image4':userAddition4,'image5':userAddition5,'code':1,'about':userBiography,'gender':userGender});
							});
						}else {
							db.query('insert into tbimage (belong, path, image1, image2, image3, image4, image5, status) values (?, ?, ?, ?, ?,?,?,?)', [userid,imageName,userAddition1,userAddition2,userAddition3,userAddition4,userAddition5,0],function(err2,rsl2){
								 res.json({'path':imageName,'code':1,'about':userBiography,'image1':userAddition1,'image2':userAddition2,'image3':userAddition3,'image4':userAddition4,'image5':userAddition5,'gender':userGender});
							});
						}
					});
				}
			});
		}	
});
app.post('/uploadProfile', function(req, res){
		var userid = req.body.userid;
		var imageName = req.files.avatar.name;
		var userBiography = req.body.about;
		var token = req.body.token;
		var sql = 'select * from tbUser where id = ?';
		if(userid == null || userid == ''){
				res.json({'Message':'This id is not null or incorrect','code':0});
		}else {
			db.query(sql,userid,function(err,rsl){
				if (rsl == ''){
					res.json({'Message':'No Result','code':0});
				}else {
					//update info user
					db.query('UPDATE tbUser SET about = ? WHERE token = ?', [userBiography,token],function(error1,result1){
					if (error1){
					  	res.json({'message':'Failed!','code':0});
					}else {
					  	//res.json({'message':'Update success!','code':1});
					 }
					});
					db.query('select * from tbImage where belong = ? and status = ?',[userid,0],function(err3,rsl3){
						if (rsl3 != ''){
							db.query('update tbImage SET path = ?,image1=avatar.png,image2=avatar.png,image3=avatar.png,image4=avatar.png,image5=avatar.png WHERE belong = ? and status = ?',[imageName,userid,0],function(err4,rsl4){
								res.json({'path':imageName,'code':1});
							});
						}else {
							db.query('insert into tbImage (belong, path,image1,image2,image3,image4,image5, status) values (?, ?, ?,?,?,?,?,?)', [userid,imageName,'avatar.png','avatar.png','avatar.png','avatar.png','avatar.png',0],function(err2,rsl2){
								res.json({'path':imageName,'code':1,'about':userBiography});
							});
						}
					});
				}
			});
		}	
});

//upload vatar for group
app.post('/uploadgroup',function(req,res){
	var groupid = req.body.groupid;
	var imageName = req.files.group.name;
	var sql = 'select * from tbGroup where id = ?';
	if(groupid == null || groupid == ''){
		res.json({'Message':'This id is not null or not empty','code':0});
	}else {
		db.query(sql,groupid,function(err1,rsl1){
			if (rsl1 == ''){
				res.json({'Message':'This id is incorrect','code':0});
			}else {
					var savePath = '/uploads/' + imageName;
					//resize
					var randomstr = randomString(30, '0123456789abcdefghijklmnopqrstuvwxyz'),
							randomstr2 = randomString(30, '0123456789abcdefghijklmnopqrstuvwxyz');
		 			var namethumb = randomstr + '.' +req.files.group.extension;
		 			var namethumb2 = randomstr2 + '.' +req.files.group.extension;
		 			
		 			easyimg.thumbnail(
						{
							src:req.files.group.path, 
							dst:'./uploads/thumb/'+namethumb,
							width:300, height:300,
							x:0, y:0
						},
						function(err, image) {
							var newthumb = '/uploads/thumb/'+image.name.replace('Undefined ','');
							//create thumbnail image size 120x120
									easyimg.thumbnail(
										{
											src:req.files.group.path, 
											dst:'./uploads/thumb120/'+namethumb2,
											width:120, height:120,
											x:0, y:0
										},
										function(err2, image2) {
											var newthumb2 = '/uploads/thumb120/'+image2.name.replace('Undefined ','');
											db.query('select * from tbImage where belong = ? and status = ?',[groupid,2],function(err3,rsl3){
												if (rsl3 != ''){
													db.query('update tbImage SET path = ?, thumb = ?, thumb2 = ? WHERE belong = ? and status = ?',[savePath,newthumb,newthumb2,groupid,2],function(err4,rsl4){
														res.json({'path':savePath,'thumb':newthumb,'thumb120':newthumb2,'code':1});
													});
												}else {
													db.query('insert into tbImage (belong, path, thumb, thumb2, status) values (?, ?, ?, ?, ?)', [groupid,savePath,newthumb,newthumb2,2],function(err2,rsl2){
								  					res.json({'path':savePath,'thumb':newthumb,'thumb120':newthumb2,'code':1});
								  				});
												}
											});
										}
									);
		  				//end	create thumb 120x120
						}
					);
					//end resize
					
			} // end if
		});
	}
});

//send upload
app.post('/sendimg',function(req,res){
	console.log(req.body);
	var userid = req.body.userid;
	var imageName = req.files.sendimg.name;
		if(!imageName){
			res.json({'Message':'Upload failed!','code':0});
		} else {
		  var savePath = '/uploads/' + imageName;
		  //rezise
		  var randomstr = randomString(30, '0123456789abcdefghijklmnopqrstuvwxyz');
		  var namethumb = randomstr + '.' +req.files.sendimg.extension;
			easyimg.thumbnail(
				{
					src:req.files.sendimg.path, 
					dst:'./uploads/thumb/'+namethumb,
					width:100, height:100,
					x:0, y:0
				},
				function(err, image) {
					var newthumb = '/uploads/thumb/'+image.name.replace('Undefined ','');
					db.query('insert into tbImage (belong, path, thumb, status) values (?, ?, ?, ?)', [userid,savePath,newthumb,3],function(err,rsl){
	  				res.json({'path':savePath,'thumb':newthumb,'typesend':1,'code':1});
	  			});
				}
			);
	 }
});

};

