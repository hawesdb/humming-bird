export const convertSrcToImg = (images: string[]) => {
  return images.map((src) => {
    const image = new Image()
    image.src = src
    return image
  })
}
