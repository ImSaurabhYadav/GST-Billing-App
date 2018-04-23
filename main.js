window.onload = () => {
	
	document.querySelector('.bill').addEventListener('click', (e) => {
		localStorage.current_tab = 'bill';
		document.querySelector('.prd').classList.remove('selected');
		document.querySelector('.bill').classList.add('selected');

		document.querySelector('#product').classList.add('hidden');
		document.querySelector('#billing').classList.remove('hidden');

		(async () => {
			await billing();
		})();
	});

	document.querySelector('.prd').addEventListener('click', (e) => {
		localStorage.current_tab = 'prd';
		document.querySelector('.bill').classList.remove('selected');
		document.querySelector('.prd').classList.add('selected');

		document.querySelector('#billing').classList.add('hidden');
		document.querySelector('#product').classList.remove('hidden');

		(async () => {
			await product();
		})();
	});
	
	(async () => {
		await product();
	})();
};

async function product() {

	document.querySelector('#product section#list').classList.remove('hidden');
	document.querySelector('#product section#form').classList.add('hidden');

	const container = document.querySelector('body table tbody');
	container.textContent = null;
	const response = await (await fetch('http://localhost:3001/product/list')).json();

	window.response = response;

	if(window.add_event)
		document.querySelector('#add').removeEventListener('click', add_event);

	document.querySelector('#add').addEventListener('click', window.add_event = () => {
		if(window.event)
			document.querySelector('#form form').removeEventListener('submit', window.event);

		Add_new();
	})

	for(const data of response) {

		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${data.ID}</td>
			<td>${data.name}</td>
			<td>${data.price}</td>
			<td>${data.gst}</td>
			<td class="edit">Edit</td>
			<td class="delete">Delete</td>
		`;
		tr.querySelector('.edit').addEventListener('click',() => {
			Edit(data);
		});

		tr.querySelector('.delete').addEventListener('click', () => {
			Delete(data.ID);
		});

		container.appendChild(tr);
	}
}
function toggle() {
	document.querySelector('#product section#list').classList.add('hidden');
	document.querySelector('#product section#form').classList.remove('hidden');
	document.querySelector('#product section#form #back').addEventListener('click', () => {
		document.querySelector('#product section#list').classList.remove('hidden');
		document.querySelector('#product section#form').classList.add('hidden');
	});
}
function Add_new() {
	toggle();

	document.querySelector('#form h2').textContent = 'Add new product';
	
	const form = document.querySelector('#form form');
	form.reset();

	form.addEventListener('submit', window.event = async (e) => {

		e.preventDefault();
		
		const option = {
			method: 'POST',
			headers: {
				'name': form.name.value,
				'price': form.price.value,
				'gst': form.gst.value,
			}
		}
		await fetch('http://localhost:3001/product/insert', option);
		confirm('A new product added');
		await product();
	});
}
async function Edit(data) {
	toggle();

	document.querySelector('#form h2').textContent = 'Edit Product Code: ' + data.ID;

	const form = document.querySelector('#form form');
	form.reset();

	form.name.value = data.name;
	form.price.value = data.price;
	form.gst.value = data.gst;
	if(window.event)
		form.removeEventListener('submit', event);

	form.addEventListener('submit', window.event = async (e) => {

		e.preventDefault();

		const option = {
			method: 'POST',
			headers: {
				'id': data.ID,
				'name': form.name.value,
				'price': form.price.value,
				'gst': form.gst.value,
			}
		}
		await fetch('http://localhost:3001/product/update', option);
		confirm('values updated');
		await product();
	})
}
async function Delete(id) {

	if(!confirm('Are you sure!!??'))
		return;

	await fetch('http://localhost:3001/product/delete', {
		cors: true,
		method: 'POST',
		headers: {
			'id': id,
		}
	});

	await product();
}

function search(key) {
	const result = [];

	if(!key)
		return result;

	for(const data of window.response) {
		if(String(data.ID).includes(key) || data.name.includes(key))
			result.push(data);
	}

	return result;
}
function billing() {
	
	var filterd = [];

	document.querySelector('input.search').addEventListener('keyup', () => {
		filterd = search(document.querySelector('input.search').value);
		render(filterd);
	});

	var selected_array = [];
	window.selected_array = selected_array;

	if(!window.selected_array.length) {
		document.querySelector('#billing .billing_table tbody').innerHTML = '<div> No product selected. </div>'
	}
	render_billing();
}
function render(filterd) {

	const container = document.querySelector('#billing .search_table tbody');

	container.textContent = null;
	
	if(!filterd.length) {
		container.innerHTML = '<div> No match found :(</div>';
		return;
	}
	
	for(const data of filterd) {

		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${data.ID}</td>
			<td>${data.name}</td>
			<td>${data.price}</td>
			<td>${data.gst}</td>
			<td class="select">Select</td>
		`;
		tr.querySelector('.select').addEventListener('click', window.select_listener =() => {
			if(tr.querySelector('.select').textContent == 'Select') {

				tr.style.background = '#FFB2B2';
				tr.querySelector('.select').textContent = 'Selected';
				render_billing(data, true);
			}
			else if(tr.querySelector('.select').textContent == 'Selected') {
				tr.style.background = '#eee';
				tr.querySelector('.select').textContent = 'Select';
				render_billing(data, false);
			}
		});
		container.appendChild(tr);
	}
}

function render_billing(data, flag) {

	const container = document.querySelector('#billing .billing_table tbody');

	container.textContent = null;

	if(!flag) {
		// for(const [value,index] of selected_array) {
		// 	if(value == data)
		// 		delete selected_array[index];
		// }
	}
	else 
		selected_array.push(data);
	var total_amount = 0;

	for(const data of selected_array) {

		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${data.ID}</td>
			<td>${data.name}</td>
			<td>${data.price}</td>
			<td>${data.gst}</td>
			<td class="quantity"><input type='number' value= '${data.quantity ? data.quantity : "0"}'></td>
			<td class="final_price"><input type='number' min="0" value='${data.result ? data.result : "0"}' step="0.01" readonly></td>
		`;
		tr.querySelector('.quantity').addEventListener('change', () => {
			
			data.quantity = tr.querySelector('.quantity input').value
			let result = data.quantity * parseInt(data.price);
			result = result + (result*parseInt(data.gst)/100);
			data.result = result;
			tr.querySelector('.final_price input').value = result;
		})
		container.appendChild(tr);
		if(data.result)
			total_amount+=parseInt(data.result);
		container.parentElement.querySelector('.total').value = total_amount;
	}
}