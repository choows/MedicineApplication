import { Alert } from 'react-native';

export function ShowNormalAlert(Title = "", messsage = "", CancelEnable = false) {
    return Alert.alert(
        Title,
        messsage,
        CancelEnable ?
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK" }
            ]
            : [
                { text: "OK" }
            ]
    );
}