import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { styles } from "../App";
import { Audio } from "expo-av";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

const BE_URL = "http://localhost:3000";

const truncate = (str, n) => {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
};

export default function Playlist({ route, navigator }) {
  const { location, genres } = route.params;

  const [tracks, setTracks] = useState([]);
  const [sound, setSound] = useState();
  const [selectedSound, setSelectedSound] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${BE_URL}/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ location: location, genres: genres }),
      })
        .then((res) => res.json())
        .then((res) =>
          setTracks(res.sort(() => 0.5 - Math.random()).slice(0, 5))
        );
    };

    fetchData();
  }, []);

  const playTrack = async (url) => {
    setSelectedSound(url);
    const { sound } = await Audio.Sound.createAsync(url);
    await sound.playAsync();
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const Track = ({ imageURL, name, artist, streamURL, n }) => {
    return (
      <View style={tagStyles.card}>
        <View style={tagStyles.card}>
          <Text style={tagStyles.songText}>{n} </Text>
          <Image style={{ width: 50, height: 50 }} source={{ uri: imageURL }} />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={tagStyles.songText}>{truncate(name, 30)}</Text>
            <Text style={tagStyles.artistText}>{artist}</Text>
          </View>
        </View>
        <Pressable onPress={() => playTrack(streamURL)}>
          {selectedSound === streamURL ? (
            <MaterialCommunityIcon
              name="pause"
              size={30}
              color="#ffffff"
              style={{
                backgroundColor: "#c29df1",
                borderRadius: 100,
                padding: 2,
              }}
            />
          ) : (
            <MaterialCommunityIcon
              name="play"
              size={30}
              color="#ffffff"
              style={{
                backgroundColor: "#c29df1",
                borderRadius: 100,
                padding: 2,
              }}
            />
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        <Text style={{ color: "#f3bce6" }}>Explore</Text> your playlist
      </Text>
      {tracks.length > 0 ? (
        <View
          style={{
            display: "flex",
            backgroundColor: "#1a1823",
            borderRadius: 20,
            padding: 10,
          }}
        >
          {tracks.map((t, i) => (
            <Track
              imageURL={t.imageURL}
              name={t.name}
              artist={t.artist}
              streamURL={t.streamURL}
              n={i + 1}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const tagStyles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    color: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    alignItems: "center",
  },
  songText: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  artistText: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 17,
    color: "#DDDDDD",
  },
});
