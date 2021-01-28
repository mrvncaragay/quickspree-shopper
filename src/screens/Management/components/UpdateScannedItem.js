import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { StoreMap } from '../../../components';
import firebase from '../../../firebase';

const UpdateScannedItem = ({ navigation, route }) => {
	const { colors } = useTheme();
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [visible, setVisible] = useState(false);

	const saveProduct = async () => {
		try {
			const scannedRef = firebase.database().ref(`scanned/${product.id}`);
			const saveRef = firebase.database().ref(`saved/${product.id}`);
			await saveRef.set(product);
			await scannedRef.set(null);
			navigation.goBack();
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleUpdate = async () => {
		const scannedProductRef = firebase.database().ref(`scanned/${product.id}`);
		scannedProductRef.set(product, async (error) => {
			if (error) {
				console.log(error);
			} else {
				setVisible(true);
			}
		});
	};

	const handleDelete = async () => {
		const scannedProductRef = firebase.database().ref(`scanned/${product.id}`);
		await scannedProductRef.set(null);
		navigation.goBack();
	};

	return (
		<>
			<KeyboardAwareScrollView
				scrollEnabled={false}
				resetScrollToCoords={{ x: 0, y: 0 }}
				style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}
			>
				<StoreMap store={store} product={product} />

				<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
					<View
						style={{
							marginTop: 5,
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{[
							{ label: 'Aisle', value: 'aisle' },
							{ label: 'Produce', value: 'produce' },
							{ label: 'Dairy', value: 'dairy' },
							{ label: 'Meat', value: 'meat' },
							{ label: 'Deli', value: 'deli' },
							{ label: 'Bakery', value: 'bakery' },
						].map((aisle, i) => (
							<Button
								disabled={product.aisleType !== aisle.value}
								mode={product.aisleType === aisle.value ? 'contained' : 'outlined'}
								dark
								key={i}
								compact
								labelStyle={{ fontSize: 10, color: product.aisleType === aisle.value ? 'white' : 'gray' }}
								onPress={() => {
									if (product.aisleType === aisle.value) return;

									setProduct({ ...product, aisleType: aisle.value });
								}}
							>
								{aisle.label}
							</Button>
						))}
					</View>
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
						disabled={product.aisleCode && true}
						style={styles.input}
						mode='outlined'
						dense
						label='Aisle'
						multiline
						value={product?.aisleCode || ''}
						onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
					/>

					<TextInput style={styles.input} mode='outlined' dense label='upc...' disabled value={product.upc} />

					<TextInput
						style={styles.input}
						mode='outlined'
						dense
						label='Size'
						value={product.size}
						onChangeText={(size) => setProduct({ ...product, size })}
					/>
					<TextInput
						style={styles.input}
						mode='outlined'
						label='Memo (optional)'
						placeholder='Look middle, top, or bottom?'
						dense
						multiline
						value={product.memo}
						onChangeText={(memo) => setProduct({ ...product, memo })}
					/>

					<Button
						style={{ marginTop: 15, padding: 5 }}
						labelStyle={{ textTransform: 'capitalize' }}
						mode='contained'
						onPress={handleUpdate}
					>
						Update
					</Button>

					<Button
						labelStyle={{ textTransform: 'capitalize' }}
						style={{ marginTop: 10, padding: 5, backgroundColor: product.upc ? 'darkorange' : colors.disabled }}
						mode='contained'
						onPress={handleDelete}
					>
						Delete
					</Button>

					<Button
						disabled={product.upc ? false : true}
						labelStyle={{ textTransform: 'capitalize' }}
						style={{ marginTop: 10, padding: 5, backgroundColor: product.upc ? 'green' : colors.disabled }}
						mode='contained'
						onPress={saveProduct}
					>
						Save
					</Button>
				</View>
			</KeyboardAwareScrollView>
			<Snackbar
				style={{ backgroundColor: 'green' }}
				duration={2000}
				visible={visible}
				onDismiss={() => setVisible(false)}
			>
				Batch successfully updated!
			</Snackbar>
		</>
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

export default UpdateScannedItem;