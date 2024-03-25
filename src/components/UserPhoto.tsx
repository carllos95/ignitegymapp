import { IImageProps, Image } from "native-base";

type Props = IImageProps & {
  size: number
}

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      width={size}
      height={size}
      rounded='full'
      {...rest}
      borderWidth={2}
      borderColor='gray.400'
    />
  )
}
