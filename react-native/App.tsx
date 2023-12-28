import {DEBUG} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {WebView} from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
// @ts-expect-error
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

const STORAGE_KEY_COOKIES = 'STORAGE_KEY_COOKIES';

const debugging = `
console = new Object();
console.log = function(log) {
  window.ReactNativeWebView.postMessage(JSON.stringify({log}));
};
console.debug = console.log;
console.info = console.log;
console.warn = console.log;
console.error = console.log;`;

const setupCookieListener = `
document.addEventListener('rn-event', function(event) {
  window.ReactNativeWebView.postMessage(event && event.detail || '');
});`;

const injectedJavaScript = `
${DEBUG ? debugging : ''}
${setupCookieListener}true;`;

function useCookies(args: {localServerUrl: string}) {
  const [isCookiesSetup, setIsCookiesSetup] = useState(false);

  useEffect(() => {
    if (args.localServerUrl && !isCookiesSetup) {
      (async () => {
        try {
          const storedCookies = await AsyncStorage.getItem(STORAGE_KEY_COOKIES);
          if (storedCookies) {
            await CookieManager.setFromResponse(
              args.localServerUrl,
              storedCookies,
            );
          }
        } catch (error) {
          console.log('[cookies] error : ', error);
        } finally {
          setIsCookiesSetup(true);
        }
      })();
    }
  }, [isCookiesSetup, args.localServerUrl]);

  return {
    isCookiesSetup,
  };
}

async function getLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => {
        resolve(pos.coords);
      },
      reject,
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
}

function App(): JSX.Element {
  const [isWebviewLoading, setIsWebviewLoading] = useState(true);
  const [isWebviewError, setIsWebviewError] = useState(false);
  const [localServerUrl, setLocalServerUrl] = useState('');
  const webviewRef = useRef<WebView>(null);
  const {isCookiesSetup} = useCookies({localServerUrl});

  useEffect(() => {
    if (Platform.OS !== 'android') {
      BootSplash.hide({fade: true});
    }
  }, []);

  useEffect(() => {
    const server = new StaticServer(8080, RNFS.DocumentDirectoryPath + '/www', {
      localOnly: true,
    });

    server.start().then((url: string) => {
      setLocalServerUrl(url);
    });

    return () => {
      server.stop();
    };
  }, []);

  useEffect(() => {
    if (isWebviewError) {
      if (Platform.OS === 'android') {
        BootSplash.hide({fade: true});
      }
    }
  }, [isWebviewError]);

  const sendDataToWebView: <T extends object>(args: {
    action: string;
    data?: T;
    error?: string;
  }) => void = args => {
    const script: string = `
    document.dispatchEvent(
      new CustomEvent("rn-webview-event", {
        detail: ${JSON.stringify(args)},
      })
    )
    `;
    webviewRef.current?.injectJavaScript(script);
  };

  const handleBackButtonPress = () => {
    try {
      webviewRef.current?.goBack();
      return true;
    } catch (err) {
      console.log('[handleBackButtonPress] Error : ', err);
    }

    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, []);

  if (!isCookiesSetup) {
    return <View />;
  }

  if (isWebviewError) {
    return (
      <SafeAreaView
        style={{flex: 1, height: '100%', backgroundColor: '#C57349'}}>
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: '800', fontSize: 30, color: '#f8f9fa'}}>
            Oops...{'\n'}Could not load App.{'\n'}
            {'\n'}Please try again in couple munites.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!localServerUrl) {
    return <View />;
  }

  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
      {!isWebviewLoading ? (
        <View
          style={{
            width: '100%',
            height: 50,
            position: 'absolute',
            bottom: 0,
            zIndex: 0,
            backgroundColor: 'rgb(248,249,250)',
          }}
        />
      ) : null}
      {isWebviewLoading ? (
        <View
          style={{
            height: '100%',
            width: '100%',
            flex: 1,
            position: 'absolute',
            top: 0,
            zIndex: 10,
            backgroundColor: 'white',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}
      <WebView
        source={{uri: localServerUrl}}
        startInLoadingState
        ref={webviewRef}
        onLoadEnd={() => {
          setIsWebviewLoading(false);
        }}
        onError={error => {
          console.log('[webview error]', JSON.stringify(error.nativeEvent));
          setIsWebviewError(true);
        }}
        style={{zIndex: 1}}
        originWhitelist={[
          'localhost',
          'localhost:3000',
          'mobile.saharasell.com',
          'gql.saharasell.com',
          'saharasell.com',
        ]}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScript={injectedJavaScript}
        onMessage={async event => {
          try {
            const payload = JSON.parse(event.nativeEvent.data);
            const action = payload?.action;

            if (payload?.log) {
              console.log('[webview]', payload?.log);
            }

            if (action === 'signin') {
              await AsyncStorage.setItem(STORAGE_KEY_COOKIES, payload?.cookies);
            }

            if (action === 'logout') {
              await AsyncStorage.clear();
              await CookieManager.clearAll();
            }

            if (action === 'app-mounted') {
              BootSplash.hide({fade: true});
            }

            if (action === 'get-location') {
              try {
                const position = await getLocation();
                if (!position) {
                  sendDataToWebView({action, error: 'failed'});
                }
                sendDataToWebView({action, data: position!});
              } catch (error) {
                console.log(error);
                sendDataToWebView({action, error: 'failed'});
              }
            }

            if (action === 'map') {
              const scheme = Platform.select({
                ios: 'maps://0,0?q=',
                android: 'geo:0,0?q=',
              });

              const latLng = `${payload?.location?.lat},${payload?.location?.lon}`;
              const label = `${latLng}`;

              if (Platform.OS === 'android') {
                const url = `${scheme}${latLng}(${label})&z=${
                  payload?.zoom ?? 15
                }`;
                Linking.openURL(url);
              }

              if (Platform.OS === 'ios') {
                try {
                  const url = `comgooglemaps://?q=${latLng}(${label})`;
                  await Linking.openURL(url);
                } catch {
                  const url = `${scheme}${label}@${latLng}`;
                  Linking.openURL(url);
                }
              }
            }
          } catch (error) {
            console.error('[webview][onMessage] error', error);
          }
        }}
      />
    </SafeAreaView>
  );
}

export default App;
