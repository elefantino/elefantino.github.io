/*
This is a simple web application created without any framework. This app uses only JQuery as a third party library to operate DOM elements in HTML.
It loads initial data from the json file and allows users to add and remove categories, manufacturers, and products.
The full project is in https://github.com/elefantino/SimpleWebAppWithoutFrameworks
*/
$(function () {

	//global variables
	//an array containing objects with all the data
	var products = [];
	
    //this is called on page load. Get data about the products from json
	$.getJSON( "responseData.json", function( data ) {
		// write the data into the global variable
		products = data; 
        // call a function to create HTML for the list of products
	    generateHTML(products);
	});

	//generate HTML for the list of products
	function generateHTML(data){
		var text = "<ul>";
		data.categories.forEach(function (c) {
			text += "<li>Category: " + c.name + " <button class='remove' cid='" + c.id + "'>Remove</button></li>";
			text += "<ul>";
			c.products.forEach(function (m) {
				text += "<li>Manufacturer: " + m.name + " <button class='remove' cid='" + c.id + "' mid='" + m.id + "'>Remove</button></li>";
			    text += "<ul>";
				m.products.forEach(function (p) {
					text += "<li>" + p.name + " <button class='remove' cid='" + c.id + "' mid='" + m.id + "' id='" + p.id + "'>Remove</button></li>";
			    });
				text += "<li><label>Add new product </label><input class='add' type='text' cid='" + c.id + "' mid='" + m.id + "' value=''></li></ul>";
			});
            text += "<li><label>Add new manufacturer </label><input class='add' type='text' cid='" + c.id + "' value=''></li></ul>";			
		}); 
		text += "<li><label>Add new category </label><input class='add' type='text' value=''></li></ul>";
		document.getElementById("product-list").innerHTML = text;
		
		//assign a click event to the 'remove' buttons
		var buttons = $('.product-list button.remove');
    	buttons.click(function () {
         	var that = $(this),
				specId = that.attr('id'),
				specMid = that.attr('mid'),
				specCid = that.attr('cid');
		    remove(specCid, specMid, specId);
		});
		
		//assign a change event to the 'add' inputs
		var inputs = $('.product-list input.add');
    	inputs.change(function () {
			var that = $(this),
			    value = that[0].value,
				specMid = that.attr('mid'),
				specCid = that.attr('cid');
			add(value, specCid, specMid);
		});
	}
	
	//add item
	function add(value, cid, mid) {
		if(value) {
			if(cid && mid) {
				var e = products.categories.filter(cat => cat.id === cid);
				if(e.length) {
					var ind = products.categories.indexOf(e[0]);
					var e_ = e[0].products.filter(man => man.id == mid);
					if(e_.length) {
						var ind_ = e[0].products.indexOf(e_[0]);
						var newid = getRandomArbitrary(1,1000000);
						while (e_[0].products.filter(pr => pr.id === newid).length) {
							newid = getRandomArbitrary(1,1000000);
						}	
						products.categories[ind].products[ind_].products.push({id: newid.toString(), name: value, products: []});
						generateHTML(products);
						console.log("product added");
					}	
				}	
			}	
			else if(cid) {
				var e = products.categories.filter(cat => cat.id === cid);
			    if(e.length) {
					var ind = products.categories.indexOf(e[0]);
					var newid = getRandomArbitrary(1,1000000);
					while (e[0].products.filter(man => man.id === newid).length) {
						newid = getRandomArbitrary(1,1000000);
					}	
					products.categories[ind].products.push({id: newid.toString(), name: value, products: []});
					generateHTML(products);
					console.log("manufacturer added");
				}	
			}
			else {
				var newid = getRandomArbitrary(1,1000000);
				while (products.categories.filter(cat => cat.id === newid).length) {
					newid = getRandomArbitrary(1,1000000);
				}	
				products.categories.push({id: newid.toString(), name: value, products: []});
				generateHTML(products);
				console.log("category added");
			}
		}
	}
	
	//remove selected item
	function remove(cid, mid, id) {
		if(cid && mid && id){
			var e = products.categories.filter(cat => cat.id === cid);
			if(e.length) {
				var ind = products.categories.indexOf(e[0]);
				var e_ = e[0].products.filter(man => man.id == mid);
				if(e_.length) {
					var ind_ = e[0].products.indexOf(e_[0]);
					var e__ = e_[0].products.filter(pr => pr.id == id);
					if(e__.length) {
						var ind__ = e_[0].products.indexOf(e__[0]);
						products.categories[ind].products[ind_].products.splice(ind__,1);
						generateHTML(products);
						console.log("product removed");
					}	
				}	
			}			
		}
		else if(cid && mid){
			var e = products.categories.filter(cat => cat.id === cid);
			if(e.length) {
				var ind = products.categories.indexOf(e[0]);
				var e_ = e[0].products.filter(man => man.id == mid);
				if(e_.length) {
					var ind_ = e[0].products.indexOf(e_[0]);
					products.categories[ind].products.splice(ind_,1);
					generateHTML(products);
					console.log("category removed");
				}	
			}
		}
		else if(cid){
			var e = products.categories.filter(cat => cat.id === cid);
			if(e.length) {
				var ind = products.categories.indexOf(e[0]);
				products.categories.splice(ind,1);
				generateHTML(products);
				console.log("category removed");
			}	
		}	
	}
	
	//generate a random integer between min (inclusive) and max (exclusive) for id of the item.
	//Note: we could scan the products and manufactures arrays to find the last id and increment it, 
	//but it will decrease performance considering three-level arrays inside the initial data
	//and the need to perform loops inside loops :( 
	function getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}	
	
});