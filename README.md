# chainway-sensors by Fuzz
This REACT-NATIVE library allows both the UHF reader and Barcode reader in chainway handhelds (like c66) to be used. At the moment I am too lazy to write a complete guide. Check out the index.ts file to get an idea of the functionalities.
## Getting Started

### Android Configuration

Add package from npm to your project: `npm install chainway-sensors`

To handle hardware key events on Android, you need to modify the `MainActivity.kt` file in your Android project. Follow these steps:

1. **Open `MainActivity.kt` located in `android/app/src/main/kotlin/com/yourapp/`**

2. **Add the following imports at the top of the file:**

    ```kotlin
    import com.facebook.react.bridge.ReactContext
    import android.view.KeyEvent
    import com.facebook.react.modules.core.DeviceEventManagerModule
    ```

3. **Add or update the following code in the `MainActivity` class:**

    ```kotlin
    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (keyCode == 139 || keyCode == 280 || keyCode == 293) { // Replace with your hardware key code
            val reactInstanceManager = reactNativeHost.reactInstanceManager
            val reactContext = reactInstanceManager.currentReactContext

            reactContext?.let {
                sendEvent(it, "onHardwareKeyPress", "Key pressed: $keyCode")
            }
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
    ```

## Usage

Here's how you can use the `chainway-sensors` package in your React Native application:

1. **Import the module:**

    ```javascript
    import RNChainwaySensors from "chainway-sensors";
    import { NativeEventEmitter, Alert, Button, Text, TextInput, View } from 'react-native';
    ```

2. **Use the module in your component:**

    ```javascript
    const App = () => {
        const [isReading, setIsReading] = React.useState(false);
        const [powerState, setPowerState] = React.useState('');
        const [tags, setTags] = React.useState([]);
        const [power, setPower] = React.useState(0);
        const eventEmitter = new NativeEventEmitter(RNChainwaySensors);

        const showAlert = (title, data) => {
            Alert.alert(
                title,
                data,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
            );
        };

        const powerListener = (data) => {
            setPowerState(data);
        };

        const tagListener = (data) => {
            setTags(tags => tags.concat(data[0]));
        };

        React.useEffect(() => {
            (async () => {
                try {
                    const scanner = RNChainwaySensors;
                    const result = await scanner.initializeUHF();
                    setPowerState(result);
                    scanner.tagListener(tagListener);
                    scanner.powerListener(powerListener);
                    const subscription = eventEmitter.addListener('onHardwareKeyPress', () => {
                        scanSingleTag();
                    });
                    return () => {
                        subscription.remove();
                    };
                } catch (error) {
                    Alert.alert(error?.message);
                }
            })();
            return () => {
                RNChainwaySensors.deinitializeUHF();
                RNChainwaySensors.releaseSoundPool();
            };
        }, []);

        const readPower = async () => {
            try {
                let result = await RNChainwaySensors.readPower();
                showAlert('SUCCESS', `The result is ${result}`);
                console.log(result);
            } catch (error) {
                showAlert('FAILED', error.message);
            }
        };

        const scanSingleTag = async () => {
            try {
                let result = await RNChainwaySensors.readSingleTag();
                showAlert('SUCCESS', `The result is ${result}`);
                console.log(result);
            } catch (error) {
                showAlert('FAILED', error.message);
            }
        };

        const startReading = () => {
            RNChainwaySensors.startReadingTags((message) => {
                setIsReading(message);
            });
        };

        const stopReading = () => {
            RNChainwaySensors.stopReadingTags((message) => {
                setIsReading(false);
            });
        };

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Text>{powerState}</Text>
                    <TextInput
                        style={{ width: 150, height: 50 }}
                        onChangeText={(val) => setPower(Number(val))}
                        keyboardType='number-pad'
                        maxLength={2}
                    />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            style={{ margin: 10 }}
                            onPress={async () => {
                                try {
                                    const result = await C72RfidScanner.changePower(power);
                                    alert('Success');
                                } catch (error) {
                                    alert(error.message);
                                }
                            }}
                            title='Change Power'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            style={{ margin: 10 }}
                            onPress={async () => {
                                try {
                                    const result = await RNChainwaySensors.initializeUHF();
                                    setPowerState(result);
                                } catch (error) {
                                    alert(error.message);
                                }
                            }}
                            title='Initialize UHF'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            style={{ margin: 10 }}
                            onPress={async () => {
                                try {
                                    const result = await RNChainwaySensors.deinitializeUHF();
                                    setPowerState(result);
                                    setTags([]);
                                } catch (error) {
                                    alert(error.message);
                                }
                            }}
                            title='Deinitialize UHF'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            style={{ margin: 10 }}
                            onPress={() => readPower()}
                            title='Read Power'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            style={{ margin: 10 }}
                            onPress={() => scanSingleTag()}
                            title='Read Single Tag'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            disabled={isReading}
                            style={{ margin: 10 }}
                            onPress={() => startReading()}
                            title='Start Bulk Scan'
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            disabled={!isReading}
                            style={{ margin: 10 }}
                            onPress={() => stopReading()}
                            title='Stop Bulk Scan'
                        />
                    </View>
                </View>
                {tags.map((el, index) => (
                    <Text key={index}>tag={el}</Text>
                ))}
            </View>
        );
    };

    export default App;
    ```
