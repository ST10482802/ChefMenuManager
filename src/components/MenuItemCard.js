// src/components/MenuItemCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

// Reusable component to display a single menu item
export default function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.dishName}</Text>
        <Text style={styles.cardPrice}>R {Number(item.price).toFixed(2)}</Text>
      </View>
      
      <Text style={styles.cardDesc}>{item.description}</Text>
      <Text style={styles.cardCourse}>{item.course}</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2, // Adds a slight shadow for Android
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textDark },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  cardDesc: { color: colors.textLight, marginBottom: 8 },
  cardCourse: { fontWeight: 'bold', color: colors.secondary, marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, backgroundColor: colors.primary, padding: 10, borderRadius: 5, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: colors.danger, padding: 10, borderRadius: 5, alignItems: 'center' },
  btnText: { color: colors.white, fontWeight: 'bold' },
});