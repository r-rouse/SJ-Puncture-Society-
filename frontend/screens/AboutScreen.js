import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Box,
  Text,
  VStack,
  HStack,
  ScrollView,
} from '@gluestack-ui/themed';

const legendColors = [
  { bg: 'rgba(0, 255, 0, 0.6)', label: '1 flat - Isolated incident' },
  { bg: 'rgba(154, 205, 50, 0.6)', label: '2 flats - Occasional problem' },
  { bg: 'rgba(255, 255, 0, 0.6)', label: '3 flats - Moderate risk' },
  { bg: 'rgba(255, 165, 0, 0.6)', label: '4 flats - High risk area' },
  { bg: 'rgba(255, 99, 71, 0.6)', label: '5 flats - Very high risk' },
  { bg: 'rgba(255, 0, 0, 0.6)', label: '6+ flats - Critical hotspot' },
];

export default function AboutScreen() {
  return (
    <ScrollView flex={1} bg="$white">
      <StatusBar style="auto" />
      <Box flex={1} p="$6" pt="$16">
        <Text size="3xl" fontWeight="$bold" color="$trueGray800" mb="$2">
          About
        </Text>
        <Text size="lg" color="$trueGray600" mb="$8">
          San Jose Puncture Society
        </Text>

        <VStack space="lg" mb="$8">
          <Box>
            <Text size="xl" fontWeight="$bold" color="$trueGray800" mb="$3">
              Mission
            </Text>
            <Text size="md" color="$trueGray600" lineHeight="$xl">
              The San Jose Puncture Society is a community-driven app that helps cyclists
              identify and avoid flat tire hotspots in San Jose, California. By anonymously
              tagging locations where flat tires occur, we create a shared resource to help
              everyone ride safer.
            </Text>
            <Text size="md" color="$trueGray600" lineHeight="$xl" mt="$3" fontWeight="$semibold">
              We are collecting this puncture data to present to the San Jose City Council
              to advocate for a comprehensive bike lane sweeping policy that will help keep
              our cycling infrastructure safe and clean for all riders.
            </Text>
          </Box>

          <Box>
            <Text size="xl" fontWeight="$bold" color="$trueGray800" mb="$3">
              How It Works
            </Text>
            <Text size="md" color="$trueGray600" lineHeight="$xl">
              1. Tag locations where you've experienced a flat tire{'\n'}
              2. View the heat map to see problem areas{'\n'}
              3. Help the cycling community stay informed
            </Text>
          </Box>

          <Box>
            <Text size="xl" fontWeight="$bold" color="$trueGray800" mb="$3">
              Heat Map Legend
            </Text>
            <VStack space="sm">
              {legendColors.map((item) => (
                <HStack key={item.label} alignItems="center" space="sm">
                  <Box
                    w="$6"
                    h="$6"
                    borderRadius="$full"
                    bg={item.bg}
                    borderWidth={1}
                    borderColor="rgba(0,0,0,0.2)"
                  />
                  <Text size="md" color="$trueGray600" flex={1}>
                    {item.label}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box>
            <Text size="xl" fontWeight="$bold" color="$trueGray800" mb="$3">
              Privacy
            </Text>
            <Text size="md" color="$trueGray600" lineHeight="$xl">
              All location tags are anonymous. We only collect geographic coordinates.
              No personal information is stored or shared.
            </Text>
          </Box>

          <Box>
            <Text size="xl" fontWeight="$bold" color="$trueGray800" mb="$3">
              Version
            </Text>
            <Text size="md" color="$trueGray600">
              1.0.0
            </Text>
          </Box>
        </VStack>
      </Box>
    </ScrollView>
  );
}
