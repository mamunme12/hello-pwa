window.onload = () => {
	'use strict';

	//share
	const shareButton = document.querySelector('#share-button');
	const title = document.querySelector('#title').value;
	const url = document.querySelector('#url').value;
	const fileField = document.querySelector('#file');
	shareButton.addEventListener('click', async () => {
	const files = fileField ? fileField.files : [];

	const data = {title, text, url};

	if(files.length) {
		data.files = files;
	}

	try {
		await navigator.share(data);
	}
	catch(e) {
		console.log('share error', e);
	}
	});

	if(fileField) {
		fileField.addEventListener('change', e => {
			const {files} = e.target;
			const {name} = files[0];

			if(name) {
			fileName.innerText = name;
			}
		});
	}

}