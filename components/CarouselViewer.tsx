import React from "react";
import { Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import { Button, Card, Image } from "react-native-elements";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Events } from "../service/PushyDate";

interface CarouselViewerProps {
  events: Events[];
}
const { width } = Dimensions.get("window");

const CarouselViewer: React.FC<CarouselViewerProps> = ({ events }) => {
  return (
    <View>
      <SwiperFlatList
        autoplay
        autoplayDelay={4}
        autoplayLoop
        showPagination
        data={events}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.ImageUrl }}
              style={{
                width: width,
                height: width,
                resizeMode: "contain",
              }}
              onPress={() => {
                Linking.openURL(item.ClickUrl);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default CarouselViewer;
