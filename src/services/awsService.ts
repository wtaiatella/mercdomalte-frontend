import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const s3getUploadSignedUrl = async (
	fileName: string,
	urlBackendApi: string
) => {
	console.log(`Function s3getSignedUrl with file.name = ${fileName}`);

	const resposta = await fetch(`${urlBackendApi}/aws/uploadurl`, {
		method: 'POST',
		body: `{"fileName": "${fileName}"}`,
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then((response) => response.text())
		.catch((err) => console.log(err));
	console.log(resposta);

	if (resposta) return resposta;
	//const categoryObject = await respS3SignedUrl.text();
};

const s3getDownloadeSignedUrl = async (
	fileName: string,
	urlBackendApi: string
) => {
	console.log(`Function s3getSignedUrl with file.name = ${fileName}`);

	const resposta = await fetch(`${urlBackendApi}/aws/downloadurl`, {
		method: 'POST',
		body: `{"fileName": "${fileName}"}`,
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then((response) => response.text())
		.catch((err) => console.log(err));
	console.log(resposta);

	if (resposta) return resposta;
	//const categoryObject = await respS3SignedUrl.text();
};

const s3DeleteFile = async (fileName: string, urlBackendApi: string) => {
	console.log(`Function s3getSignedUrl with file.name = ${fileName}`);

	const resposta = await fetch(`${urlBackendApi}/aws/delete`, {
		method: 'POST',
		body: `{"fileName": "${fileName}"}`,
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
	console.log(resposta);

	if (resposta) return resposta;
	//const categoryObject = await respS3SignedUrl.text();
};

export { s3getUploadSignedUrl, s3getDownloadeSignedUrl, s3DeleteFile };
