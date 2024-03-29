//1 - Write a program that prints the text "HELLO WORLD" to the console (stdout).

console.log("HELLO WORLD");

//2 - Write a program that accepts one or more numbers as command-line arguments and prints the sum of 
//those numbers to the console (stdout).

var sum = 0;
for(var i = 2; i < process.argv.length; i++) {
	sum += Number(process.argv[i]);
}
console.log(sum);

//3 - Write a program that uses a single synchronous filesystem operation to read a file and print 
//the number of newlines it contains to the console (stdout), similar to running cat file | wc -l.

The full path to the file to read will be provided as the first command-line argument.
var fs = require('fs');
var buf = fs.readFileSync(process.argv[2]);
console.log(buf.toString().split('\n').length - 1);

//4 - Write a program that uses a single asynchronous filesystem operation to read a file and print 
//the number of newlines it contains to the console (stdout), similar to running cat file | wc -l.

//The full path to the file to read will be provided as the first command-line argument.

var fs = require('fs');
fs.readFile(process.argv[2], function (err, data) {
	if(err) {
		throw err;
	}
	console.log(data.toString().split('\n').length - 1);
});

//5 - Create a program that prints a list of files in a given directory, filtered by the extension of the files. 
//You will be provided a directory name as the first argument to your program (e.g. '/path/to/dir/') and 
//a file extension to filter by as the second argument.

//For example, if you get 'txt' as the second argument then you will need to filter the list to only files that 
//end with .txt.

//The list of files should be printed to the console, one file per line. You must use asynchronous I/O.


//1st method
var fs = require('fs');
fs.readdir(process.argv[2], function (err, list) {
	if(err) {
		throw err;
	}
	for (var i = 0; i < list.length; i++) {
		if(list[i].toString().indexOf("."  + process.argv[3]) !== -1) {
			console.log(list[i].toString());
		}
	}	
});

//2nd method
var fs = require('fs');
var path = require('path');
fs.readdir(process.argv[2], function (err, list) {
	if(err) {
		throw err;
	}
	for (var i = 0; i < list.length; i++) {
		if(path.extname(list[i]) === "."  + process.argv[3]) {
			console.log(list[i]);
		}
	}	
});

//3rd method
var fs = require('fs')
var path = require('path')

fs.readdir(process.argv[2], function (err, list) {
  list.forEach(function (file) {
    if (path.extname(file) === '.' + process.argv[3])
      console.log(file)
  })
})

//6 

/*This problem is the same as the previous but introduces the concept of modules. 

You will need to create two files to solve this.

Create a program that prints a list of files in a given directory, filtered by the extension of the files. 
The first argument is the directory name and the second argument is the extension filter. Print the list of 
files (one file per line) to the console. You must use asynchronous I/O.

You must write a module file to do most of the work. The module must export a single function that 
takes three arguments: the directory name, the filename extension string and a callback function, in 
that order. The filename extension argument must be the same as was passed to your program. i.e. don't 
turn it in to a RegExp or prefix with "." or do anything else but pass it to your module where you can 
do what you need to make your filter work.

The callback function must be called using the idiomatic node(err, data) convention. This convention 
stipulates that unless there's an error, the first argument passed to the callback will be null, and 
the second will be your data. In this case the data will be your filtered list of files, as an Array. 
If you receive an error, e.g. from your call to  fs.readdir(), the callback must be called with the error, 
and only the error, as the first argument.

You must not print directly to the console from your module file, only from your original program.

In the case of an error bubbling up to your original program file, simply check for it and print an 
informative message to the console.

These four things is the contract that your module must follow.

  * Export a single function that takes exactly the arguments described.
  * Call the callback exactly once with an error or some data as described.
  * Don't change anything else, like global variables or stdout.
  * Handle all the errors that may occur and pass them to the callback.

The benifit of having a contract is that your module can be used by anyone who expects this contract. 
So your module could be used by a/*Write an HTTP server that receives only POST requests and converts incoming POST body characters 
to upper-case and returns it to the client.
Your server should listen on the port provided by the first argument to your program.
*/

var map = require('through2-map')
var http = require('http')
http.createServer(function(inStream, outStream) {
	if(inStream.method == 'POST') {
		inStream.pipe(map(function (chunk) {
  		return chunk.toString().toUpperCase()
	})).pipe(outStream)
	}
}).listen(process.argv[2]);

var mymodule = require('./mymodule.js')
var dir = process.argv[2];
var filter = process.argv[3];
mymodule(dir, filter, function(err, data) {
	if (err) {
		console.log("There was an error" + err);
	}
	data.forEach(function(file) {
		console.log(file);
	});
});

//7

/*Write a program that performs an HTTP GET request to a URL provided to you as the first command-line argument. 
Write the String contents of each "data" event from the response to a new line on the console (stdout). */

var http = require('http');
http.get(process.argv[2], function callback(response) {
	response.on('data', function(data) {
		console.log(data.toString())
	})
})


//8  

/*
Write a program that performs an HTTP GET request to a URL provided to you as the first command-line argument. 
Collect all data from the server (not just the first "data" event) and then write two lines to the console (stdout).

The first line you write should just be an integer representing the number of characters received from the 
server and the second line should contain the complete String of characters sent by the server.

*/

//1st method
var http = require('http');
var fullString = '';
http.get(process.argv[2], function callback(response) {
	
	response.on('data', function(data) {
		fullString += data.toString();
	})
	response.on('end', function() {
		console.log(fullString.length);
		console.log(fullString);
	})
})

//2nd method
var http = require('http')
var bl = require('bl')

http.get(process.argv[2], function (response) {
  response.pipe(bl(function (err, data) {
    if (err)
      return console.error(err)
    data = data.toString()
    console.log(data.length)
    console.log(data)
  }))  
})


//9 - 

/*
This problem is the same as the previous problem (HTTP COLLECT) in that you need to use http.get(). 
However, this time you will be provided with three URLs as the first three command-line arguments.

You must collect the complete content provided to you by each of the URLs and print it to the console 
(stdout). You don't need to print out the length, just the data as a String; one line per URL. 
The catch is that you must print them out in the same order as the URLs are provided to you as command-line arguments.

*/

//1st method
var http = require('http');
var fullString = '';
http.get(process.argv[2], function callback(response) {
	
	response.on('data', function(data) {
		fullString += data.toString();
	})
	response.on('end', function() {
		console.log(fullString);
		fullString = '';
		http.get(process.argv[3], function callback(response) {	
			response.on('data', function(data) {
				fullString += data.toString();
			})
			response.on('end', function() {
				console.log(fullString);
				fullString = ''
				http.get(process.argv[4], function callback(response) {	
					response.on('data', function(data) {
						fullString += data.toString();
					})
					response.on('end', function() {
						console.log(fullString);						
					})
				})
			})
		})
	})
})

//2nd method

var http = require('http')
var bl = require('bl')
var results = []
var count = 0

function printResults () {
  for (var i = 0; i < 3; i++)
    console.log(results[i])
}

function httpGet (index) {
  http.get(process.argv[2 + index], function (response) {
    response.pipe(bl(function (err, data) {
      if (err)
        return console.error(err)

      results[index] = data.toString()
      count++

      if (count == 3) // yay! we are the last one!
        printResults()
    }))
  })
}

for (var i = 0; i < 3; i++)
  httpGet(i)



//10

/*
Write a TCP time server!

Your server should listen to TCP connections on the port provided by the first argument to your program. 
For each connection you must write the current date & 24 hour time in the format:

    "YYYY-MM-DD hh:mm"

followed by a newline character. Month, day, hour and minute must be zero-filled to 2 integers. For example:

    "2013-07-06 17:42"

*/

var net = require('net')
    
function zeroFill(i) {
  return (i < 10 ? '0' : '') + i
}

function now () {
  var d = new Date()
  return d.getFullYear() + '-'
    + zeroFill(d.getMonth() + 1) + '-'
    + zeroFill(d.getDate()) + ' '
    + zeroFill(d.getHours()) + ':'
    + zeroFill(d.getMinutes())
}

var server = net.createServer(function (socket) {
  socket.end(now() + '\n')
})

server.listen(Number(process.argv[2]))

//11

/*
Write an HTTP server that serves the same text file for each request it receives.

Your server should listen on the port provided by the first argument to your program.

You will be provided with the location of the file to serve as the second command-line argument. 
You must use the fs.createReadStream() method to stream the file contents to the response.
*/

var http = require('http')
var fs = require('fs')
var server = http.createServer(function(req, res) {
	var src = fs.createReadStream(process.argv[3]);
	src.pipe(res);
});
server.listen(process.argv[2]);

//12

/*Write an HTTP server that receives only POST requests and converts incoming POST body characters 
to upper-case and returns it to the client.
Your server should listen on the port provided by the first argument to your program.
*/

var map = require('through2-map')
var http = require('http')
http.createServer(function(inStream, outStream) {
	if(inStream.method == 'POST') {
		inStream.pipe(map(function (chunk) {
  		return chunk.toString().toUpperCase()
	})).pipe(outStream)
	}
}).listen(process.argv[2]);

 //13

/*
Write an HTTP server that serves JSON data when it receives a GET request to the path '/api/parsetime'. 
Expect the request to contain a query string with a key 'iso' and an ISO-format time as the value.

For example:

  /api/parsetime?iso=2013-08-10T12:10:15.474Z

The JSON response should contain only 'hour', 'minute' and 'second' properties. For example:

    {
      "hour": 14,
      "minute": 23,
      "second": 15
    }

Add second endpoint for the path '/api/unixtime' which accepts the same query string but 
returns UNIX epoch time under the property 'unixtime'. For example:

    { "unixtime": 1376136615474 }

Your server should listen on the port provided by the first argument to your program.

*/
var http = require('http')
var url = require('url')
http.createServer(function(inStream, outStream) {		
var result = '';
var d = '';
var urlObject = url.parse(inStream.url, true);
if(urlObject.pathname === '/api/parsetime') {
	result = urlObject.query.iso;
	d = new Date(result);
	result = {"hour": d.getHours(), "minute": d.getMinutes(), "second": d.getSeconds()};
}				
else if (urlObject.pathname === '/api/unixtime') {
	result = urlObject.query.iso;
	d = new Date(result);
	result = {"unixtime": d.getTime()};
}
if (result) {
    outStream.writeHead(200, { 'Content-Type': 'application/json' });
    outStream.end(JSON.stringify(result));
	}
	else {
	outStream.writeHead(404);
	  	outStream.end();
	}	    	
}).listen(process.argv[2]);


