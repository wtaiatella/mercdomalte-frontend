import Head from 'next/head';

import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

import { Container } from './styles';

import { InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { ReactNode, useEffect, useState } from 'react';
import NewFileForm from '../NewFileForm';

/*
Entender porque esta dando erro de acesso ao path
export const getServerSideProps = async () => {
	const responseCategories = await fetch(
		`http://localhost:5000/mediasCategories`
	);

	console.log(responseCategories);
	const categories = await responseCategories.json();
	console.log(`Aqui estão as medias do site`);
	console.log(categories);

	return {
		props: {
			categories, // props for the Home component
		},
	};
};
*/

export default function NewFile({}) {
	interface fileDataProp {
		name: string;
		slug?: string;
		size: number;
		type: string;
		icon: ReactNode;
	}

	const [fileData, setFileData] = useState<fileDataProp>();

	useEffect(() => {
		/*
		também não funcionaou por ai
		const fetchCategories = async () => {
			const data = await fetch('http://localhost:5000/medias');
			const json = await data.json();
			setCategories(json);
			console.log(json);
		};

		fetchCategories();
		*/
	}, []);

	const onFinish = (values: any) => {
		console.log('Received values of form: ', values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const { Dragger } = Upload;

	const props: UploadProps = {
		name: 'file',
		multiple: false,
		maxCount: 1,
		//action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		onChange(info) {
			const { status } = info.file;
			console.log(info.file.status);
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
				message.success(
					`${info.file.name} file uploaded successfully.`
				);
				setFileData({
					name: info.file.name,
					slug: info.file.name,
					size: info.file.size,
					type: info.file.type,
					icon: <SearchOutlined />,
				});

				console.log('deu certo ' + info.file.name);
			} else if (status === 'removed') {
				setFileData(undefined);
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
				setFileData({
					name: info.file.name,
					slug: info.file.name,
					size: info.file.size,
					type: info.file.type,
					icon: <SearchOutlined />,
				});

				console.log('deu erro');
			}
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	return (
		<>
			<Head>
				<title>MdM - Novo Arquivo</title>
			</Head>
			<Container>
				<h1>Novo arquivo</h1>

				<Dragger {...props}>
					<p className='ant-upload-drag-icon'>
						<InboxOutlined />
					</p>
					<p className='ant-upload-text'>
						Click or drag file to this area to upload
					</p>
					<p className='ant-upload-hint'>
						Support for a single or bulk upload. Strictly prohibit
						from uploading company data or other band files
					</p>
				</Dragger>
				{fileData ? <NewFileForm fileData={fileData} /> : <></>}
			</Container>
		</>
	);
}
