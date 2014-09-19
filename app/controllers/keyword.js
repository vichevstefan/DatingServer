//var path = require('path');

module.exports.controller = function(app,db) {


//list suggestions keyword for user
app.get('/suggestions_keyword',function(req,res){
	var sql = 'select * from tbKeyword WHERE status = 0 order by createtime';
	
	db.query(sql,function(err,rsl){
		if (err){
			res.json({'Message':'Error SQL','code':0});
		}else {
			if (rsl == ''){
				res.json({'Message':'Not Found','code':0});
			}else {
				var data = [];
				var i;
				for (i=0;i<rsl.length;i++){
					var obj = new Object();
					obj.id = rsl[i].id;
					obj.name = utf8_decode(rsl[i].name);
					obj.status = rsl[i].status;
					obj.createtime = rsl[i].createtime;
					data[i] = obj;
				}
				
				res.json({'obj':data,'code':1});
			}
		}
	});
});

//list suggestions keyword for product
app.get('/suggestions_keyword_product',function(req,res){
	var sql = 'select * from tbKeyword WHERE status = 1 order by createtime desc';

	db.query(sql,function(err,rsl){
		if (err){
			res.json({'Message':'Error SQL','code':0});
		}else {
			if (rsl == ''){
				res.json({'Message':'Not Found','code':0});
			}else {
				var data = [];
				var i;
				for (i=0;i<rsl.length;i++){
					var obj = new Object();
					obj.id = rsl[i].id;
					obj.name = utf8_decode(rsl[i].name);
					obj.status = rsl[i].status;
					obj.createtime = rsl[i].createtime;
					data[i] = obj;
				}
				
				res.json({'obj':data,'code':1});
			}
		}
	});
});

//



//lisst keyword for user search
app.post('/keyword_user', function(req,res){
	var keyword = utf8_encode(req.body.keyword);
	
	var sql = 
		'select u.id as userid, u.username ,u.email,u.website,u.country,u.sex,u.phone,u.token,img.* '+
		'from tbUser as u left join (select * from tbImage where status = 0) as img ON img.belong = u.id '+
		'where u.id in ( '+
		'select g.userid '+
		'from tbKeyword as k INNER JOIN tbKeyword_user as g ON g.keyword_id = k.id '+
		'where k.name LIKE "%'+keyword+'%" and g.status = 0) '+

		'UNION '+

		'SELECT u.id as userid, u.username,u.email,u.website,u.country,u.sex,u.phone,u.token,img2.* '+
		'FROM tbUser as u LEFT JOIN (SELECT * FROM tbImage WHERE status = 0) as img2 ON img2.belong = u.id '+
		'WHERE u.username LIKE "%'+keyword+'%" '; 
						
	if (keyword == '' || keyword == null){
		res.json({'Message':'No result','code':0});
	}else {
		db.query(sql,function(err,result){
			if (result == ''){
				res.json({'Message':'No result','code':0});
			}else {
				var i;
				var data = [];
				for (i = 0;i < result.length; i++){
					var obj = new Object();
					obj.userid = result[i].userid;
					obj.token = result[i].token;
					obj.username = result[i].username;
					obj.email = result[i].email;
					obj.website  = result[i].website;
					obj.country  = result[i].country;
					switch (result[i].sex) {
						case 0:
							obj.sex = 'Not Choose';
							break;
						case 1:
							obj.sex = 'Male';
							break;
						case 2:
							obj.sex = 'Female';
							break;	
					}
					
					if (result[i].path == null){
						obj.path = '/uploads/default.png';
					}else {
						obj.path = result[i].path;
					}
					data[i] = obj;
				}
				res.json({'obj':data,'code':1});
			}
		});
	}
});


//list keyword for product
app.post('/keyword_product', function(req,res){
			
	var keyword = utf8_encode(req.body.keyword);
	
	var sql = 'SELECT b.id,b.type,b.description,b.price,b.sold,group_concat(c.path) as imgpost,group_concat(c.thumb) as imgpost_thumb,group_concat(c.thumb2) as imgpost_thumb120 '+
						'FROM tbKeyword_product AS a '+
						'INNER JOIN (SELECT * FROM tbProduct) b ON b.id = a.postid '+
						'LEFT JOIN (SELECT path,thumb,thumb2,belong FROM tbImage WHERE status = 1) c ON c.belong = a.postid '+
						'INNER JOIN (SELECT name,id FROM tbKeyword WHERE status = 1) d ON d.id = a.keyword_id '+
						'WHERE d.name LIKE "%'+keyword+'%" '+
						'GROUP BY a.id '+
						
						'UNION '+
						
						'SELECT a.id,a.type,a.description,a.price,a.sold,group_concat(b.path) as imgpost,group_concat(b.thumb) as imgpost_thumb,group_concat(b.thumb2) as imgpost_thumb120 '+
						'FROM tbProduct as a '+
						'LEFT JOIN (SELECT belong,path,thumb,thumb2 FROM tbImage WHERE status = 1) as b ON b.belong = a.id '+
						'WHERE a.description LIKE "%'+keyword+'%" and a.type = 0 '+
						'GROUP BY a.id ';

	db.query(sql,keyword,function(err,result){
		if (result === ''){
			res.json({'Message':'No result','code':0});
		}else {
			var i;
			var data = [];
			for (i = 0;i < result.length; i++){
				if (result[i].id != null) {
					var obj = new Object();
					obj.productid = result[i].id;
					obj.description = utf8_decode(result[i].description);
					obj.price = result[i].price;
					obj.sold  = result[i].sold;
					
					//img original
					if (result[i].imgpost == null){
						var img = [];
						var obj2 = new Object();
						obj2.path = '/uploads/new_product.png';
						img[0] = obj2;
						obj.imgpost = img;
					}else {
						var array = result[i].imgpost.split(',');
						var i2;
						var newarr = [];
						for (i2 = 0;i2 < array.length; i2++){
							var obj3 = new Object();
							obj3.path = array[i2];
							newarr[i2] = obj3;
						}
						obj.imgpost = newarr;
					}
					//img thumb 300x300
					if (result[i].imgpost_thumb == null){
						var img = [];
						var obj2 = new Object();
						obj2.path = '/uploads/new_product_300.png';
						img[0] = obj2;
						obj.imgpost_thumb = img;
					}else {
						var array = result[i].imgpost_thumb.split(',');
						var i3;
						var newarr = [];
						for (i3 = 0;i3 < array.length; i3++){
							var obj3 = new Object();
							obj3.path = array[i3];
							newarr[i3] = obj3;
						}
						obj.imgpost_thumb = newarr;
					}
					//img thumb 120x120
					if (result[i].imgpost_thumb120 == null){
						var img = [];
						var obj2 = new Object();
						obj2.path = '/uploads/new_product_120.png';
						img[0] = obj2;
						obj.imgpost_thumb120 = img;
					}else {
						var array = result[i].imgpost_thumb120.split(',');
						var i4;
						var newarr = [];
						for (i4 = 0;i4 < array.length; i4++){
							var obj3 = new Object();
							obj3.path = array[i4];
							newarr[i4] = obj3;
						}
						obj.imgpost_thumb120 = newarr;
					}
				
				
					data.push(obj);
				}
			}
			res.json({'obj':data,'code':1});
		}
	});
});

//top keyword for product
app.get('/topkeyword',function(req,res){
	var sql1 = 'SELECT count(*) as count, keyword_id,b.name FROM `tbKeyword_product` AS a '+
						'INNER JOIN (SELECT id,name FROM tbKeyword where status = 1) b ON b.id = a.keyword_id '+
						'GROUP BY a.keyword_id '+
						'ORDER BY count DESC '+
						'LIMIT 5';
	var sql2 = 'SELECT count(*) as count, keyword_id,b.name FROM `tbKeyword_user` AS a '+
						'INNER JOIN (SELECT id,name FROM tbKeyword where status = 0) b ON b.id = a.keyword_id '+
						'GROUP BY a.keyword_id '+
						'ORDER BY count DESC '+
						'LIMIT 5';
  
	db.query(sql1,function(err,rsl1){
		db.query(sql2,function(err2,rsl2){
				var data = [];
				for(var i in rsl1){
				   var shared = false;
				   for (var j in rsl2)
				       if (rsl2[j].keyword_id == rsl1[i].keyword_id) {
				           shared = true;
				           break;
				       }
				   if(!shared) data.push(rsl1[i]);
				}
				
				data = data.concat(rsl2);
				data.sort(function(a,b) { 
					return parseFloat(b.count) - parseFloat(a.count); 
				});
				res.json({'obj':data,'code':1});
		});
	});
});


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

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}



};