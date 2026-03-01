import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Box, Text, VStack, HStack, ScrollView, Spinner } from '@gluestack-ui/themed';
import { fetchNeighborhoods } from '../services/api';

export default function DataScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNeighborhoods();
        setList(data);
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = list.reduce((sum, item) => sum + item.count, 0);

  return (
    <ScrollView flex={1} bg="$white">
      <StatusBar style="auto" />
      <Box flex={1} p="$6" pt="$16">
        <Text size="3xl" fontWeight="$bold" color="$trueGray800" mb="$2">
          Data
        </Text>
        <Text size="lg" color="$trueGray600" mb="$6">
          Flats by neighborhood
        </Text>

        {loading && (
          <Box py="$8" alignItems="center">
            <Spinner size="large" />
            <Text size="sm" color="$trueGray600" mt="$2">
              Loading…
            </Text>
          </Box>
        )}

        {error && (
          <Box py="$4">
            <Text size="md" color="$rose600">
              {error}
            </Text>
          </Box>
        )}

        {!loading && !error && (
          <VStack space="md">
            <Box mb="$4" p="$3" bg="$trueGray100" borderRadius="$md">
              <Text size="sm" color="$trueGray600">
                Total tagged
              </Text>
              <Text size="2xl" fontWeight="$bold" color="$green600">
                {total} flat{total !== 1 ? 's' : ''}
              </Text>
            </Box>
            {list.length === 0 ? (
              <Text size="md" color="$trueGray600">
                No locations tagged yet. Tag some on the Map tab.
              </Text>
            ) : (
              list.map((item) => (
                <HStack
                  key={item.name}
                  justifyContent="space-between"
                  alignItems="center"
                  py="$3"
                  borderBottomWidth={1}
                  borderBottomColor="$trueGray200"
                >
                  <Text size="md" fontWeight="$medium" color="$trueGray800">
                    {item.name}
                  </Text>
                  <Text size="md" fontWeight="$bold" color="$green600">
                    {item.count} flat{item.count !== 1 ? 's' : ''}
                  </Text>
                </HStack>
              ))
            )}
          </VStack>
        )}
      </Box>
    </ScrollView>
  );
}
