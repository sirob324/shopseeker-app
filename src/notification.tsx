import _ from "lodash";
import { Platform } from "react-native";
import { getSystemVersion } from "react-native-device-info";
import {
    Notifications,
    Notification,
    NotificationCompletion,
    NotificationBackgroundFetchResult,
    Registered,
    RegistrationError,
} from "react-native-notifications";
import { NotificationActionResponse } from "react-native-notifications/lib/dist/interfaces/NotificationActionResponse";

let deviceToken: string | null = null;

class NotificationClass {
    register(
        registerSuccess: (deviceToken: string) => void,
        registerFailed: (event: RegistrationError) => void,
        onReceivedForeground: (
            notification: Notification,
            completion: (response: NotificationCompletion) => void
        ) => void,
        onReceivedBackground: (
            notification: Notification,
            completion: (response: NotificationBackgroundFetchResult) => void
        ) => void,
        onOpened: (
            notification: Notification,
            completion: () => void,
            action?: NotificationActionResponse
        ) => void
    ) {
        Notifications.events().registerRemoteNotificationsRegistered(
            (event: Registered) => {
                this.deviceToken = event.deviceToken;

                registerSuccess(event.deviceToken);
            }
        );

        Notifications.events().registerRemoteNotificationsRegistrationFailed(
            registerFailed
        );

        Notifications.events().registerNotificationReceivedForeground(
            onReceivedForeground
        );

        Notifications.events().registerNotificationOpened(onOpened);

        Notifications.events().registerNotificationReceivedBackground(
            onReceivedBackground
        );

        Notifications.registerRemoteNotifications();
    }

    get deviceToken(): string | null {
        return deviceToken;
    }

    set deviceToken(token: string | null) {
        deviceToken = token;
    }

    getBadgeCount(): Promise<number> {
        return Notifications.ios.getBadgeCount();
    }

    setBadgeCount(count: number) {
        Notifications.ios.setBadgeCount(count);
    }

    clearBadgeCount() {
        this.setBadgeCount(0);
    }

    isRegistered(): Promise<Boolean> {
        return Notifications.isRegisteredForRemoteNotifications();
    }

    checkPermissions(): Promise<NotificationCompletion> {
        return Notifications.ios
            .checkPermissions()
            .then((currentPermissions: NotificationCompletion) => {
                return {
                    badge: !!currentPermissions.badge,
                    sound: !!currentPermissions.sound,
                    alert: !!currentPermissions.alert,
                };
            });
    }

    openAppFromNotification(): Promise<Notification | undefined> {
        return Notifications.getInitialNotification();
    }

    sendLocalNotification(notification: Notification): number {
        return Notifications.postLocalNotification(notification);
    }

    cancelLocalNotification(notificationId: string) {
        if (Platform.OS === "ios") {
            return Notifications.cancelLocalNotification(notificationId);
        } else {
            return;
        }
    }

    cancelAllLocalNotifications() {
        if (Platform.OS === "ios") {
            return Notifications.ios.cancelAllLocalNotifications();
        } else {
            return;
        }
    }

    removeLocalNotifications(notificationIds: string[]) {
        if (
            Platform.OS === "ios" &&
            _.toInteger(_.split(getSystemVersion(), ".")[0]) >= 10
        ) {
            return Notifications.ios.removeDeliveredNotifications(
                notificationIds
            );
        }
    }

    removeAllLocalNotifications() {
        return Notifications.removeAllDeliveredNotifications();
    }

    getDeliveredNotifications() {
        return Notifications.ios.getDeliveredNotifications();
    }
}

export default new NotificationClass();
