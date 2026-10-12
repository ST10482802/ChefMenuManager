// MAST5112 - Part 2 - Chef Menu Manager
// Qinisile Mbambo - ST10482802

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  FlatList, Alert, StatusBar, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();

// ---- HOME SCREEN ----
// Just the landing page with the two main buttons
function HomeScreen({ navigation, menuItems }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Chef's Menu Manager</Text>
      <Text style={styles.subtitle}>Manage your restaurant menu easily</Text>

      {/* Only show this if there are items, otherwise it looks weird */}
      {menuItems.length > 0 && (
        <Text style={styles.countText}>
          {menuItems.length} {menuItems.length === 1 ? 'dish' : 'dishes'} on the menu
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddItem')}>
        <Text style={styles.buttonText}>+ Add New Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.orangeBtn]}
        onPress={() => navigation.navigate('MenuList')}>
        <Text style={styles.buttonText}>View All Items</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---- ADD ITEM SCREEN ----
// This is where the chef types in the new dish info
function AddItemScreen({ navigation, addMenuItem }) {
  // form state - keep it all together
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});

  // Validation - checks everything before saving
  // Made the error messages clear so the chef knows what went wrong
  const validate = () => {
    let newErrors = {};
    let isValid = true;

    // dish name check
    if (!dishName.trim()) {
      newErrors.dishName = 'Please enter the dish name';
      isValid = false;
    } else if (dishName.trim().length < 2) {
      newErrors.dishName = 'Dish name must be at least 2 characters';
      isValid = false;
    }

    // description check
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
      isValid = false;
    } else if (description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
      isValid = false;
    }

    // price check - has to be a number and greater than 0
    if (!price.trim()) {
      newErrors.price = 'Please enter a price';
      isValid = false;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      // build the item object
      const newItem = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course: course,
        price: parseFloat(price),
      };

      addMenuItem(newItem);

      // show success message with options
      Alert.alert(
        'Success!',
        `"${dishName}" has been added to the menu!`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              // clear the form so they can add another one quickly
              setDishName('');
              setDescription('');
              setCourse('Starter');
              setPrice('');
              setErrors({});
            },
          },
          {
            text: 'View Menu',
            onPress: () => navigation.navigate('MenuList'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Dish</Text>

        {/* Dish Name */}
        <Text style={styles.label}>Dish Name *</Text>
        <TextInput
          style={[styles.input, errors.dishName && styles.inputError]}
          placeholder="Enter dish name"
          value={dishName}
          onChangeText={(text) => {
            setDishName(text);
            // clear error as soon as they start typing
            if (errors.dishName) setErrors({ ...errors, dishName: null });
          }}
        />
        {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.multiline, errors.description && styles.inputError]}
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) setErrors({ ...errors, description: null });
          }}
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        {/* Course Picker */}
        <Text style={styles.label}>Course *</Text>
        <View style={[styles.input, styles.pickerWrapper]}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        {/* Price */}
        <Text style={styles.label}>Price (R) *</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="Enter price"
          value={price}
          onChangeText={(text) => {
            setPrice(text);
            if (errors.price) setErrors({ ...errors, price: null });
          }}
          keyboardType="numeric"
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        {/* Save button */}
        <TouchableOpacity style={[styles.button, styles.greenBtn]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Dish</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---- MENU LIST SCREEN ----
// Shows all the items the chef has added
function MenuListScreen({ navigation, menuItems }) {
  // little helper so each course gets its own colour
  const getCourseColor = (c) => {
    if (c === 'Starter') return '#FF9800';
    if (c === 'Main Course') return '#4CAF50';
    return '#9C27B0'; // dessert
  };

  // if there's nothing to show, display an empty state
  if (menuItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 60 }}>🍽️</Text>
        <Text style={styles.emptyText}>
          No menu items yet.{'\n'}Start by adding your first dish!
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 30 }]}
          onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.buttonText}>+ Add New Item</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Menu Items</Text>
      <Text style={styles.subtitle}>
        {menuItems.length} {menuItems.length === 1 ? 'dish' : 'dishes'} on the menu
      </Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>

            <View style={styles.cardFooter}>
              <View style={[styles.tag, { backgroundColor: getCourseColor(item.course) }]}>
                <Text style={styles.tagText}>{item.course}</Text>
              </View>
              <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ---- MAIN APP ----
// Holds the menuItems state and sets up navigation
export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  // Add a new item to the list
  const addMenuItem = (item) => {
    setMenuItems((prev) => [...prev, item]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen name="Home" options={{ title: 'Menu Manager' }}>
          {(props) => <HomeScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>

        <Stack.Screen name="AddItem" options={{ title: 'Add New Dish' }}>
          {(props) => <AddItemScreen {...props} addMenuItem={addMenuItem} />}
        </Stack.Screen>

        <Stack.Screen name="MenuList" options={{ title: 'All Menu Items' }}>
          {(props) => <MenuListScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  countText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  orangeBtn: {
    backgroundColor: '#FF9800',
  },
  greenBtn: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    padding: 0,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});