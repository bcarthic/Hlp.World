import React from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-elements";

interface IntroProps {
  onKnowMore: () => void;
}

const Intro: React.FC<IntroProps> = ({ onKnowMore }) => {
  return (
    <Card containerStyle={styles.card}>
      <Card.Title>Pushya Nakshatra</Card.Title>
      <Card.Image
        source={require("../assets/Back.jpg")}
        style={styles.image}></Card.Image>
      <Text style={styles.text}>
        Pushya Nakshatra is regarded most auspicious in the vedic scriptures.
        Pushya means 'to nourish' and hence this nakshatra provides energy and
        power. Natives born under this nakshatra(constellation) are always ready
        to help and serve people. They also believe in moving ahead in life
        through their hard work and abilities. It is said that the Goddess of
        wealth and prosperity - Goddess Lakshmi was born on this auspicious day.
        When Pushya Nakshatra occurs on Thursday or Sunday, that yog is known as
        Guru Pushya Nakshatra Yog or Ravi Pushya Nakshatra Yog, respectively.
        These yogs are as auspicious as religious tithis like Akshaya Tritiya,
        Dhanteras and Diwali. It is believed that Goddess Lakshmi resides in the
        native's house on Pushya Nakshatra day and stays therein for a long
        duration. Further, ayurvedic medicines are bought and administered
        during Pushya Nakshatra. Thus, Pushya Nakshatra provides us with an
        opportunity to invite wealth and prosperity in our life, and all
        auspicious activities are happily accomplished.
      </Text>
      <Button
        buttonStyle={styles.button}
        title="Know your pushya dates"
        onPress={onKnowMore}
      />
    </Card>
  );
};

export default Intro;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    margin: 10,
  },
  image: {
    margin: 10,
  },
  button: {
    margin: 10,
    backgroundColor: "#246a34",
  },
});
