import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Clinic } from "../types";

type Props = { clinic: Clinic; onPress?: () => void };

export default function ClinicCard({ clinic, onPress }: Props) {
  const src = clinic.imagem ? { uri: clinic.imagem } : require("../../assets/clinic-placeholder.jpg");
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={src as any} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{clinic.nome}</Text>
        <Text style={styles.text}>{clinic.endereco}</Text>
        <Text style={styles.text}>{clinic.fone}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: "#eee" },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: "#ddd" },
  name: { fontWeight: "700", fontSize: 16 },
  text: { fontSize: 14, marginTop: 4 },
});
