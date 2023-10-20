import * as React from 'react';
import { SafeAreaView, TextInput, StyleSheet, View, Button, PermissionsAndroid, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import WebView from 'react-native-webview';

type RootStackParamList = {
  Home: undefined,
  Result: { url_payment: string };
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type ResultProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

function HomeScreen({ navigation }: HomeProps) {
  const [url, onChangeUrl] = React.useState('');
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUrl}
        value={url}
        placeholder="URL Payment"
      />
      <View style={styles.fixToText}>
        <Button
          title="Test URL"
          onPress={() => navigation.navigate("Result", { url_payment: url })}
        />
      </View>
    </SafeAreaView>
  );
}

function ResultScreen({ route }: ResultProps) {
  const logAlert = (message: string) =>
    Alert.alert('Log', message, [
      { text: 'Close' },
    ]);

  const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
`;

  const onMessage = (payload: any) => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) { }

    if (dataPayload) {
      logAlert(`${dataPayload.type} : ${JSON.stringify(dataPayload.data)}`);
    }
  };

  return (
    <WebView
      javaScriptEnabled
      webviewDebuggingEnabled
      source={{ uri: route.params.url_payment }}
      injectedJavaScript={debugging}
      onMessage={onMessage}
    />
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'WebView Test' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'WebView Result' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FFF",
    color: "#0c0c0c"
  },
  fixToText: {
    paddingTop: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default App;