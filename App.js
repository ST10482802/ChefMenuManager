// MAST5112 - Final POE
// Qinisile Mbambo - ST10482802
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // --- HOME SCREEN ---
  if (currentScreen === 'Home') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.icon}>🍽️</Text>
          <Text style={styles.title}>Menu Manager</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => { setEditingItem(null); setCurrentScreen('AddEdit'); }}>
            <Text style={styles.btnText}>+ Add New Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => setCurrentScreen('MenuList')}>
            <Text style={styles.btnText}>View All Items</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- ADD / EDIT SCREEN ---
  if (currentScreen === 'AddEdit') {
    return (
      <AddEditScreen 
        editingItem={editingItem} 
        menuItems={menuItems} 
        setMenuItems={setMenuItems} 
        goBack={() => setCurrentScreen('MenuList')} 
      />
    );
  }

  // --- MENU LIST SCREEN ---
  if (currentScreen === 'MenuList') {
    return (
      <MenuListScreen 
        menuItems={menuItems} 
        setMenuItems={setMenuItems} 
        goHome={() => setCurrentScreen('Home')} 
        goEdit={(item) => { setEditingItem(item); setCurrentScreen('AddEdit'); }} 
      />
    );
  }

  return null;
}

// ==========================================
// SCREEN COMPONENTS (Below the main App)
// ==========================================

function AddEditScreen({ editingItem, menuItems, setMenuItems, goBack }) {
  const [dishName, setDishName] = useState(editingItem ? editingItem.dishName : '');
  const [description, setDescription] = useState(editingItem ? editingItem.description : '');
  const [course, setCourse] = useState(editingItem ? editingItem.course : 'Starter');
  const [price, setPrice] = useState(editingItem ? editingItem.price.toString() : '');

  const handleSave = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    const itemData = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price),
    };

    if (editingItem) {
      setMenuItems(menuItems.map((i) => (i.id === editingItem.id ? itemData : i)));
      Alert.alert('Success', 'Dish updated successfully!');
    } else {
      setMenuItems([...menuItems, itemData]);
      Alert.alert('Success', 'Dish added successfully!');
    }
    goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{editingItem ? 'Edit Dish' : 'Add New Dish'}</Text>
      </View>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.label}>Dish Name</Text>
        <TextInput style={styles.input} value={dishName} onChangeText={setDishName} placeholder="Enter dish name" />
        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />
        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={course} onValueChange={(val) => setCourse(val)}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>
        <Text style={styles.label}>Price (R)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Enter price" keyboardType="numeric" />
        <TouchableOpacity style={[styles.btnPrimary, { marginTop: 30 }]} onPress={handleSave}>
          <Text style={styles.btnText}>Save Dish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuListScreen({ menuItems, setMenuItems, goHome, goEdit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  const totalItems = menuItems.length;
  const avgPrice = totalItems > 0 ? (menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems).toFixed(2) : '0.00';
  const starters = menuItems.filter((i) => i.course === 'Starter').length;
  const mains = menuItems.filter((i) => i.course === 'Main Course').length;
  const desserts = menuItems.filter((i) => i.course === 'Dessert').length;

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === 'All' || item.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this dish?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMenuItems(menuItems.filter((i) => i.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goHome}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>All Menu Items</Text>
      </View>
      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Menu Overview</Text>
        <Text style={styles.statsText}>Total: {totalItems} | Avg: R{avgPrice}</Text>
        <Text style={styles.statsText}>Starters: {starters} | Mains: {mains} | Desserts: {desserts}</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} />
        <View style={styles.filterPicker}>
          <Picker selectedValue={filterCourse} onValueChange={(val) => setFilterCourse(val)}>
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Starters" value="Starter" />
            <Picker.Item label="Mains" value="Main Course" />
            <Picker.Item label="Desserts" value="Dessert" />
          </Picker>
        </View>
      </View>
      {filteredItems.length === 0 ? (
        <View style={styles.center}><Text style={styles.emptyText}>No menu items found.</Text></View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.dishName}</Text>
                <Text style={styles.cardPrice}>R {Number(item.price).toFixed(2)}</Text>
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardCourse}>{item.course}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => goEdit(item)}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  btnPrimary: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, width: '100%', marginBottom: 15, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#FF9800', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  backBtn: { fontSize: 28, marginRight: 15, color: '#2196F3' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 15, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, overflow: 'hidden' },
  statsBox: { backgroundColor: '#E3F2FD', padding: 15, margin: 15, borderRadius: 8, borderWidth: 1, borderColor: '#BBDEFB' },
  statsTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#333' },
  statsText: { color: '#666', marginBottom: 2 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 15, gap: 10, marginBottom: 10 },
  searchInput: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  filterPicker: { flex: 1, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
  card: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#2196F3' },
  cardDesc: { color: '#666', marginBottom: 8 },
  cardCourse: { fontWeight: 'bold', color: '#FF9800', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, backgroundColor: '#2196F3', padding: 10, borderRadius: 5, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#F44336', padding: 10, borderRadius: 5, alignItems: 'center' },
});