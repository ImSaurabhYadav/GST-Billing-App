window.onload = () => {
	
	(async () => {
		await product();
	})();
};

async function product() {

	const container = document.querySelector('body table tbody');
	container.textContent = null;
	const response = await (await fetch('http://localhost:3001/product/list')).json();

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
			<td><button class="edit">Edit</button></td>
			<td><button class="delete">Delete</button></td>
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

	document.querySelector('#form h2').textContent = 'Edit product ' + data.ID;

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