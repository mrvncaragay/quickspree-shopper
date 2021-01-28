import React from 'react';
import { AddStore, SearchStore } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { UpdateBatchItem } from '../screens/Shopper/components';
import BottomTabNavigator from '../navigations/BottomTabNavigator';

const Stack = createStackNavigator();

const CreateAdd = () => (
	<Stack.Navigator>
		<Stack.Screen name='Shopper' component={BottomTabNavigator} options={{ headerShown: false }} />
		<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
		<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
		<Stack.Screen name='UpdateBatch' component={UpdateBatchItem} options={{ headerShown: false }} />
	</Stack.Navigator>
);

export default CreateAdd;