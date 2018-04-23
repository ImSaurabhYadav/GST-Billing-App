# ps-drive-2018-gst-app

In this app new product can be added, existing products can be edited in product entry page. Then in billing page all existing products are displayed in a table with search option to search according to any field. After selecting the product its quantity can be changed and total cost of that product and gross total cost will be updated dynamically.<br>

### Requirements
MySQL Server running with a database name new_project.<br>

### Steps

1. Select database in mysql and create table in mysql.
```
	$ mysql -u root -p
	$''
	$create database new_project;
	$use new_project;
	$create table tb_products (ID INT NOT NULL AUTO_INCREAMENT, name varchar(30), price int, gst int, PRIMARY KEY(ID));
```

2. Clone Git repository.
```
	$ git clone https://github.com/ImSaurabhYadav/ps-drive-2018-gst-app.git
```

3. Go to directory "ps-drive-2018-gst-app" and run command.
```
	$ node app.js
```


# Screenshots
1. Main Page:
![](./screenshots/1.png)
<br>
<br>
![](./screenshots/2.png)
<br>
<br>
![](./screenshots/3.png)
<br>
<br>
![](./screenshots/4.png)
<br>
<br>
![](./screenshots/5.png)
<br>
<br>
![](./screenshots/6.png)
<br>
<br>
![](./screenshots/7.png)
<br>
<br>
![](./screenshots/8.png)
<br>
<br>
![](./screenshots/9.png)
<br>
<br>
![](./screenshots/10.png)
<br>
<br>
![](./screenshots/11.png)
<br>
<br>