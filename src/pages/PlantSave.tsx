import React, { useState } from 'react'
import { 
  StyleSheet, 
  Alert, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Platform
} from 'react-native'

import DateTimePicker, { Event } from '@react-native-community/datetimepicker'

import waterDrop from '../assets/waterdrop.png'

import { SvgFromUri } from 'react-native-svg'
import { Button } from '../components/Button'
import colors from '../styles/colors'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import fonts from '../styles/fonts'
import { useNavigation, useRoute } from '@react-navigation/core'
import { format, isBefore } from 'date-fns'
import { PlantProps, SavePlant } from '../libs/storage'

interface Params {
  plant : PlantProps
}

export function PlantSave () {

  const navigation = useNavigation()
  const route = useRoute()

  const { plant } = route.params as Params

  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios')

  function handleChangeTime (event: Event, dateTime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker(oldState => !oldState)
    }

    if(dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date())
      return Alert.alert('Escolha uma hora no futuro! 🕖')
    }

    if (dateTime) {
      setSelectedDateTime(dateTime)
    }
  }

  function handleOpenDatePickerForAndroid () {
    setShowDatePicker(oldState => !oldState)
  }

  async function handleSave () {
    try {
      await SavePlant({
        ...plant,
        dateTimeNotification: selectedDateTime
      })

      navigation.navigate('Confirmation', {
        icon: 'hug',
        title: 'Tudo certo',
        subTitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito Obrigado : D',
        nextScreen: 'MyPlants'
      }) 
      
    } catch (error) {
      Alert.alert('Não foi possível salvar. 😢')
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container} >
        <View style={styles.plantInfo} >
          <SvgFromUri uri={plant.photo} height={150} width={150} />

          <Text style={styles.plantName} >
            { plant.name }
          </Text>

          <Text style={styles.plantAbout} >
            {plant.about}
          </Text>
        </View>

        <View style={styles.controller} >
          <View style={styles.tipContainer} >
            <Image 
              source={waterDrop}
              style={styles.tipImage}
            />
            <Text style={styles.tipText} >
              {plant.water_tips}
            </Text>
          </View>

          <Text style={styles.alertLabel} >
            Escolha o melhor horário para ser lembrado:
          </Text>

          { 
            showDatePicker && (
              <DateTimePicker 
                value={selectedDateTime}
                mode='time'
                display='spinner'
                onChange={handleChangeTime}
              />
            )
          }

          {
            Platform.OS === 'android' && (
              <TouchableOpacity 
                onPress={handleOpenDatePickerForAndroid} 
                style={styles.dateTimePickerButton}
              >
                <Text style={styles.dateTimePickerText} >
                  {` Mudar ${format(selectedDateTime, 'HH:mm')}`}
                </Text>
              </TouchableOpacity>
            )
          }

          <Button title='Cadastrar Planta' onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'center'
  }, 
  alertLabel: { 
    textAlign: 'center',
    fontFamily: fonts.complement,
    fontSize: 12,
    marginBottom: 5
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 22,
    fontFamily: fonts.text
  }
})