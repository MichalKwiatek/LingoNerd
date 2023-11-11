function getYoutubeVideoId(url) {
  try {
    let videoId = ''
    const isShorts = url.includes('/shorts/')
    const isShortUrl = url.includes('youtu.be')

    if (isShortUrl) {
      const urlParts = url.split('/')
      videoId = urlParts[urlParts.length - 1]
    } else if (isShorts) {
      const urlParts = url.split('/')
      videoId = urlParts[urlParts.length - 1]
    } else {
      videoId = url.split('watch?v=')[1].split('&')[0]
    }

    return videoId
  } catch (error) {
    console.error(error)
    return null
  }
}

export default getYoutubeVideoId
