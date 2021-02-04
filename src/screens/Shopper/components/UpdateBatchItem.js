import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button, IconButton } from 'react-native-paper';
import { Camera, StoreMap, InlineButtons, Snackbar } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import * as ImageManipulator from 'expo-image-manipulator';
import { useStateValue } from '../../../context';
import { aisle, btns } from '../../../utils/constant';
import { saveProductToDB, deleteProductToDB } from '../../../firebase';

const UpdateBatchItem = ({ navigation, route }) => {
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [cameraType, setCameraType] = useState(false);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});
	const { colors } = useTheme();

	const handleBarcodeScan = async (info) => {
		setProduct({
			...product,
			upc: info.data,
		});

		setCameraType(false);
	};

	const handleLocation = (coord) => {
		setProduct({
			...product,
			location: coord,
		});
	};

	// const handleTakePicture = async (img) => {
	// 	const compressedImg = await ImageManipulator.manipulateAsync(img.uri, [{ resize: { width: 400, height: 600 } }], {
	// 		compress: 1,
	// 		format: ImageManipulator.SaveFormat.PNG,
	// 	});
	// 	const filename = compressedImg.uri.substring(compressedImg.uri.lastIndexOf('/') + 1);
	// 	setImage({
	// 		filename,
	// 		uri: compressedImg.uri,
	// 	});

	// 	setCameraType(false);
	// };

	// const handleRetakePic = () => {
	// 	setImage({
	// 		filename: '',
	// 		uri: '',
	// 	});
	// };

	const handleSave = async () => {
		await saveProductToDB(product, `batch/${product.id}`);

		setVisible({
			status: 'true',
			message: 'Successfully save.',
		});

		setTimeout(() => navigation.goBack(), 1000);
	};

	const handleManagement = async () => {
		await saveProductToDB({ ...product, status: 'management' }, `batch/${product.id}`);

		setVisible({
			status: 'true',
			message: 'Successfully moved.',
		});

		setTimeout(() => navigation.goBack(), 1000);
	};

	const handleUploadToDB = async () => {
		const updatedProduct = { ...product };
		const id = updatedProduct.id;
		delete updatedProduct.status;
		delete updatedProduct.id;
		delete updatedProduct.quantity;
		await saveProductToDB(updatedProduct, `products/${product.productName.toLowerCase()}`);
		await deleteProductToDB(`batch/${id}`);

		setVisible({
			status: 'true',
			message: 'Successfully saved to DB.',
		});

		setTimeout(() => navigation.goBack(), 1000);
	};

	const handleDelete = async () => {
		await deleteProductToDB(`batch/${product.id}`);

		setVisible({
			status: 'true',
			message: 'Successfully removed from the batch.',
		});

		setTimeout(() => navigation.goBack(), 1000);
	};

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{!cameraType ? (
				<KeyboardAwareScrollView>
					{!store.hasAisleHelper && (
						<>
							<StoreMap store={store} product={product} handleLocation={handleLocation} isForm />
							<InlineButtons data={aisle} product={product} setData={setProduct} type='aisleType' />
						</>
					)}
					<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
						<TextInput
							multiline
							style={styles.input}
							mode='outlined'
							dense
							label='Product name'
							value={product.productName}
							onChangeText={(productName) => setProduct({ ...product, productName })}
						/>
						<TextInput
							style={styles.input}
							mode='outlined'
							dense
							label='Aisle code'
							value={product.aisleCode}
							onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
						/>

						{/* Take Picture */}
						{/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<TextInput
								style={[styles.input, { flex: 1 }]}
								mode='outlined'
								dense
								label='filename...'
								disabled
								value={image.filename}
							/>

							{image.uri ? (
								<IconButton
									style={{ position: 'relative', top: 5 }}
									icon='delete'
									size={30}
									color='red'
									onPress={handleRetakePic}
								/>
							) : null}

							<IconButton
								style={{ position: 'relative', top: 5 }}
								icon='camera'
								size={30}
								color={colors.primary}
								onPress={() => setCameraType('camera')}
							/>
						</View> */}

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<TextInput
								style={[styles.input, { width: '85%' }]}
								mode='outlined'
								dense
								label='upc...'
								value={product.upc}
								onChangeText={(upc) => setProduct({ ...product, upc })}
							/>

							<IconButton
								style={{ position: 'relative', top: 5 }}
								icon='barcode-scan'
								size={30}
								color={colors.primary}
								onPress={() => setCameraType('barcode')}
							/>
						</View>

						<TextInput
							style={styles.input}
							mode='outlined'
							dense
							label='Quantity'
							value={product.quantity}
							onChangeText={(quantity) => setProduct({ ...product, quantity })}
						/>

						<TextInput
							style={styles.input}
							mode='outlined'
							dense
							label='Size'
							value={product.size}
							onChangeText={(size) => setProduct({ ...product, size })}
						/>

						<InlineButtons
							containerStyle={{ justifyContent: 'flex-start' }}
							label='Location'
							data={btns}
							product={product}
							setData={setProduct}
							type='memo'
						/>

						<Button
							labelStyle={{ textTransform: 'capitalize' }}
							style={{ marginTop: 10, padding: 5, backgroundColor: colors.primary }}
							mode='contained'
							onPress={handleSave}
						>
							Save
						</Button>

						{product.status === 'found' && (
							<Button
								labelStyle={{ textTransform: 'capitalize' }}
								style={{ marginTop: 10, padding: 5, backgroundColor: colors.primary }}
								mode='contained'
								onPress={handleManagement}
							>
								Move to Management
							</Button>
						)}

						{product.status === 'management' && (
							<>
								<Button
									labelStyle={{ textTransform: 'capitalize' }}
									style={{ marginTop: 10, padding: 5, backgroundColor: 'darkorange' }}
									mode='contained'
									onPress={handleDelete}
								>
									Delete
								</Button>
								<Button
									labelStyle={{ textTransform: 'capitalize' }}
									style={{ marginTop: 10, padding: 5, backgroundColor: 'green' }}
									mode='contained'
									onPress={handleUploadToDB}
								>
									Upload
								</Button>
							</>
						)}
					</View>
					<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
				</KeyboardAwareScrollView>
			) : (
				<Camera handleBarcodeScan={handleBarcodeScan} closeCamera={() => setCameraType(false)} type={cameraType} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 5,
	},
});
export default UpdateBatchItem;
