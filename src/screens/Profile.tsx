import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { FileInfo } from "expo-file-system";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type FormDataProps = {
  name: string,
  email: string,
  password: string,
  password_confirm: string,
  old_password: string
}

const PHOTO_SIZE = 33

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required(),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
  old_password: yup.string().required('Informe a senaha antiga')
})

export function Profile() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: 'carlos@email.com'
    }
  })


  const [photoIsLoading, setIsPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/carllos95.png')

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setIsPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          })
        }
        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsPhotoIsLoading(false)
    }
  }

  function handleProfileInfos({ name, email, password, password_confirm, old_password }: FormDataProps) {

  }


  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded='full'
              startColor='gray.500'
            // endColor='gray.400'
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />



          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                isDisabled
              />
            )}
          />
          <Heading color='gray.200' fontSize='md' mb={2} alignSelf='flex-start' mt={12} fontFamily='heading'>
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder="Confirme a Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleProfileInfos)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileInfos)}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
