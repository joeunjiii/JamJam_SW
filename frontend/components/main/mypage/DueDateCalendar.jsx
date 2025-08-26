import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { View, Text } from "react-native";

export default function DueDateCalendar() {
  const [selected, setSelected] = useState("");

  return (
    <View>
      <Text>출산예정일</Text>
      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, marked: true, selectedColor: "#FF6B6B" },
        }}
        theme={{
          selectedDayBackgroundColor: "#FF6B6B",
          todayTextColor: "#FF6B6B",
          arrowColor: "#FF6B6B",
        }}
      />
      <Text>선택된 날짜: {selected}</Text>
    </View>
  );
}
