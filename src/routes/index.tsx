
import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import OneSignal, { NotificationReceivedEvent, OSNotification } from 'react-native-onesignal'

import { AppRoutes } from './app.routes';
import { Notification } from '../components/Notification';
import { useEffect, useState } from 'react';

const linking = {
  prefixes: ['shoes-store://','com.juliommen.shoesstore://'],
  config: {
    screens: {
      details: {
        path: 'details/:productId',
        parse: {
          productId: (productId: string) => productId
        }
      }
    }
  }
}

export function Routes() {
  const [notification, setNotification] =  useState<OSNotification>();
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];
  
  useEffect(() => {
    const unsubscribe = OneSignal
    .setNotificationWillShowInForegroundHandler((notificationRecivedEvent: NotificationReceivedEvent) => {
      const response = notificationRecivedEvent.getNotification();
 
      setNotification(response);
    })
  
    return () => unsubscribe;

  },[])

  return (
    <NavigationContainer theme={theme} linking={linking} >
      
      <AppRoutes />
      {
        notification?.title &&
        <Notification 
          data={notification} 
          onClose={() => setNotification(undefined)} 
        />
      }
    </NavigationContainer>
  );
}